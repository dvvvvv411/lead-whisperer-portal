
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

    const emailResponse = await resend.emails.send({
      from: "KI-Trading Bot <noreply@bitloon.net>",
      to: [email],
      subject: "Danke für deine Anfrage bei KI-Trading",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Danke für deine Anfrage</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
            }
            .container {
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 5px;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              background: linear-gradient(to right, #cba135, #e8c564);
              border-radius: 5px 5px 0 0;
            }
            .logo {
              max-width: 150px;
            }
            .content {
              padding: 20px;
              background-color: #fff;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #888;
            }
            .highlight {
              color: #cba135;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://i.imgur.com/Q191f5z.png" alt="KI-Trading Logo" class="logo">
            </div>
            <div class="content">
              <h2>Hallo ${name},</h2>
              <p>Vielen Dank für deine Anfrage bei KI-Trading!</p>
              <p>Wir haben deine Nachricht erhalten und werden uns <span class="highlight">in Kürze</span> bei dir melden.</p>
              <p>Bitte halte dein Telefon bereit, da wir dich anrufen werden, um dir weitere Informationen über unsere KI-Trading-Lösung zu geben.</p>
              <p>Du bist nur noch einen Schritt von der finanziellen Freiheit entfernt!</p>
              <p>Mit freundlichen Grüßen,<br>Dein KI-Trading Team</p>
            </div>
            <div class="footer">
              <p>© 2024 KI-Trading Bot. Alle Rechte vorbehalten.</p>
            </div>
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
