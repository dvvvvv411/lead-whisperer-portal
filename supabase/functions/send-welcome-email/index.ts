
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const { name, email, password, phone, redirectUrl } = await req.json();

    console.log(`Sending welcome email to ${email}`);
    
    // Format phone number for display if present
    const phoneDisplay = phone ? phone : "Nicht angegeben";

    const { data, error } = await resend.emails.send({
      from: "KI-Trading-Bot <noreply@bitloon.net>",
      to: email,
      subject: "Willkommen bei KI-Trading-Bot! Ihre Kontoinformationen",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .logo { max-width: 150px; }
            .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
            .credentials { background-color: #fff; padding: 15px; margin: 15px 0; border-left: 4px solid #ffd700; }
            .button { display: inline-block; background-color: #ffd700; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 15px 0; }
            .footer { text-align: center; font-size: 12px; color: #999; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://i.imgur.com/Q191f5z.png" alt="KI-Trading-Bot Logo" class="logo">
              <h1>Willkommen bei KI-Trading-Bot!</h1>
            </div>
            
            <div class="content">
              <p>Hallo ${name},</p>
              
              <p>Wir freuen uns, dass Sie sich für KI-Trading-Bot entschieden haben! Ihr Konto wurde erfolgreich eingerichtet, und Sie können sich jetzt mit den folgenden Zugangsdaten anmelden:</p>
              
              <div class="credentials">
                <p><strong>E-Mail:</strong> ${email}</p>
                <p><strong>Passwort:</strong> ${password}</p>
                <p><strong>Telefon:</strong> ${phoneDisplay}</p>
              </div>
              
              <p>Um mit dem Handeln zu beginnen, klicken Sie auf den Button unten:</p>
              
              <a href="${redirectUrl}/auth" class="button">Jetzt einloggen</a>
              
              <p>Nach dem ersten Login empfehlen wir Ihnen, Ihr Passwort zu ändern und Ihr Profil zu vervollständigen.</p>
              
              <p>Bei Fragen stehen wir Ihnen jederzeit zur Verfügung.</p>
              
              <p>Viel Erfolg mit KI-Trading-Bot!</p>
            </div>
            
            <div class="footer">
              <p>KI-Trading-Bot, © 2025 Alle Rechte vorbehalten.</p>
              <p>Diese E-Mail wurde automatisch generiert, bitte antworten Sie nicht darauf.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw error;
    }

    console.log("Welcome email sent successfully:", { data, error });

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Error in send-welcome-email function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to send welcome email", 
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
});
