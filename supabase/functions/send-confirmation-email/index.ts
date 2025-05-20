
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    const { name, email } = await req.json();

    if (!name || !email) {
      return new Response(
        JSON.stringify({
          error: "Name and email are required"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Extract first name only (to avoid showing email address if name contains it)
    const displayName = name.split(' ')[0].trim();

    const emailResponse = await resend.emails.send({
      from: "bitloon <noreply@bitloon.net>",
      to: [email],
      subject: "Danke für dein Interesse an bitloon",
      html: `
      <!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Anmeldebestätigung</title>
  <style>
    body {
      background-color: #0e0e1a;
      color: #ffffff;
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 700px;
      margin: 30px auto;
      padding: 30px;
      background: linear-gradient(145deg, #1f1f2e, #29293e);
      border-radius: 15px;
      box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
    }
    header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #333;
    }
    header h1 {
      color: #FFD700;
      font-size: 28px;
      margin: 0;
    }
    .content {
      padding: 20px 0;
    }
    .content h2 {
      color: #FFD700;
      font-size: 22px;
      margin-bottom: 10px;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
      color: #ffffff;
    }
    .notification {
      background-color: rgba(40, 167, 69, 0.2);
      border: 1px solid #28a745;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
      color: #ffffff;
    }
    footer {
      text-align: center;
      font-size: 13px;
      color: #aaa;
      margin-top: 30px;
    }
    footer a {
      color: #FFD700;
      text-decoration: none;
    }
    footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <img src="https://i.imgur.com/Q191f5z.png" alt="Bitloon Logo" style="height: 60px; margin-bottom: 10px;">
    </header>
    <div class="content">
      <h2>Hallo ${displayName},</h2>
      <p>Vielen Dank für Ihr Interesse an unserem KI Krypto Bot. Wir freuen uns, dass Sie sich für unsere automatisierte Trading-Lösung interessieren.</p>
      
      <div class="notification">
        <p style="margin: 0; font-weight: normal;">Ein Teammitglied wird Sie in Kürze telefonisch kontaktieren, um Ihnen alle Details zu erläutern und Ihnen bei der Einrichtung zu helfen.</p>
      </div>
    </div>
    <footer>
      &copy; 2025 Bitloon - GMS Management und Service GmbH | 
      <a href="https://bitloon.net/impressum" target="_blank">Impressum</a> | 
      <a href="https://bitloon.net" target="_blank">Webseite</a> | 
      <a href="https://bitloon.net/datenschutz" target="_blank">Datenschutz</a>
    </footer>
  </div>
</body>
</html>
      `,
    });

    console.log("Confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
