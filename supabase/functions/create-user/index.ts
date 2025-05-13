
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to validate phone numbers
function validateAndNormalizePhone(phone: string): string {
  if (!phone) return "";
  
  // Remove anything that's not a digit, +, -, space, or parentheses
  const normalizedPhone = phone.trim().replace(/[^\d+\-\s()]/g, '');
  
  // Check if it has any digits
  const hasDigits = /\d/.test(normalizedPhone);
  if (!hasDigits) return "";
  
  return normalizedPhone;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract the token from the Authorization header
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT and get the user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: authError }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin using has_role function
    const { data: adminCheck, error: roleError } = await supabaseAdmin.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError || !adminCheck) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin privileges required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get request body
    const { email, password, name, phone, leadId } = await req.json();
    
    if (!email || !password || !leadId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate and normalize phone number
    const validatedPhone = validateAndNormalizePhone(phone || "");
    
    console.log("Creating user account for:", email);
    console.log("Phone number being used:", validatedPhone);
    
    // Create the user with metadata including name and phone
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        phone: validatedPhone
      }
    });

    if (userError) {
      console.error("Error creating user:", userError);
      return new Response(
        JSON.stringify({ error: userError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Update the lead status
    if (userData.user) {
      const { error: leadError } = await supabaseAdmin
        .from('leads')
        .update({ 
          name: name,
          email: email,
          phone: validatedPhone,
          status: 'akzeptiert' 
        })
        .eq('id', leadId);
      
      if (leadError) {
        console.error("Error updating lead:", leadError);
        // Continue even if lead update fails
      }

      // Send welcome email
      try {
        const origin = req.headers.get('Origin') || "https://bitloon.net";
        const emailResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-welcome-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            phone: validatedPhone || "",
            redirectUrl: origin
          })
        });
        
        if (!emailResponse.ok) {
          console.error("Welcome email error:", await emailResponse.text());
        }
      } catch (emailError) {
        console.error("Error calling welcome email function:", emailError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, user: userData.user }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in create-user function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
