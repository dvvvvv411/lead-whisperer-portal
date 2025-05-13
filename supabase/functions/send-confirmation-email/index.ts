
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
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Danke für deine Anfrage</title>
          <style>
            body {
              font-family: 'Arial', 'Helvetica', sans-serif;
              line-height: 1.6;
              color: #333333;
              margin: 0;
              padding: 0;
              background-color: #FFFFFF;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #FFFFFF;
              border-radius: 8px;
              overflow: hidden;
              border: 1px solid #E8E8E8;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }
            .header {
              text-align: center;
              padding: 30px 0;
              background-color: #FFFFFF;
              border-bottom: 1px solid #F0F0F0;
            }
            .logo {
              max-width: 180px;
              height: auto;
            }
            .content {
              padding: 30px;
              background-color: #FFFFFF;
            }
            .greeting {
              font-size: 22px;
              margin-bottom: 25px;
              color: #333333;
              font-weight: bold;
            }
            .message {
              color: #505050;
              margin-bottom: 25px;
              font-size: 16px;
            }
            .highlight {
              color: #D4AF37;
              font-weight: bold;
            }
            .notification-box {
              background-color: #F9F9F9;
              border-left: 4px solid #D4AF37;
              padding: 15px;
              margin: 25px 0;
              border-radius: 4px;
            }
            .notification-box p {
              margin: 0;
              color: #505050;
            }
            .notification-icon {
              display: inline-block;
              width: 20px;
              height: 20px;
              margin-right: 10px;
              vertical-align: middle;
              font-size: 18px;
              color: #D4AF37;
            }
            .footer {
              text-align: center;
              padding: 20px;
              background-color: #F9F9F9;
              font-size: 12px;
              color: #888888;
              border-top: 1px solid #E8E8E8;
            }
            .footer p {
              margin: 5px 0;
            }
            .progress {
              background-color: #F0F0F0;
              height: 10px;
              border-radius: 5px;
              margin: 25px 0;
              overflow: hidden;
            }
            .progress-bar {
              width: 25%;
              height: 100%;
              background: linear-gradient(90deg, #D4AF37 0%, #E6C868 100%);
              border-radius: 5px;
            }
            .progress-step {
              display: flex;
              justify-content: space-between;
              margin-top: 10px;
              position: relative;
              z-index: 2;
              width: 100%;
            }
            .step {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 25%;
              text-align: center;
            }
            .step-icon {
              width: 30px;
              height: 30px;
              background-color: #F0F0F0;
              border-radius: 50%;
              border: 1px solid #E0E0E0;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 5px;
              color: #888888;
              font-weight: bold;
            }
            .step-current .step-icon {
              background: linear-gradient(90deg, #D4AF37 0%, #E6C868 100%);
              color: #FFFFFF;
              border-color: #D4AF37;
            }
            .step-label {
              font-size: 12px;
              color: #888888;
              width: 100%;
            }
            .step-current .step-label {
              color: #D4AF37;
              font-weight: bold;
            }
            .step-line {
              position: absolute;
              top: 15px;
              height: 1px;
              background-color: #E0E0E0;
              width: 100%;
              z-index: -1;
              left: 0;
            }
            .step-line-completed {
              position: absolute;
              top: 15px;
              height: 1px;
              background-color: #D4AF37;
              width: 12.5%;
              z-index: -1;
              left: 0;
            }
            .signature {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #F0F0F0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(90deg, #D4AF37 0%, #E6C868 100%);
              color: #FFFFFF;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 4px;
              font-weight: bold;
              margin: 20px auto;
              text-align: center;
            }
            @media (max-width: 600px) {
              .container {
                width: 100%;
                border-radius: 0;
              }
              .content {
                padding: 20px;
              }
              .greeting {
                font-size: 20px;
              }
              .step-label {
                font-size: 10px;
              }
            }
          </style>
        </head>
        <body bgcolor="#FFFFFF">
          <div class="container">
            <div class="header">
              <img src="https://i.imgur.com/Q191f5z.png" alt="KI-Trading Logo" class="logo">
            </div>
            <div class="content">              
              <h2 class="greeting">Hallo ${name},</h2>
              <p class="message">
                Vielen Dank für Ihre Anfrage bei <span class="highlight">KI-Trading</span>!
              </p>
              <p class="message">
                Wir haben Ihre Nachricht erhalten und werden uns <span class="highlight">in Kürze</span> bei Ihnen melden. Ihr Interesse an unserer KI-basierten Krypto-Handelsplattform freut uns sehr.
              </p>
              
              <div class="notification-box">
                <p><span class="notification-icon">🔔</span> Bitte halten Sie Ihr Telefon bereit, da wir Sie anrufen werden, um Ihnen weitere Informationen über unsere KI-Trading-Lösung zu geben.</p>
              </div>
              
              <p class="message">Sie sind nur noch einen Schritt von der finanziellen Freiheit entfernt!</p>
              
              <div class="progress">
                <div class="progress-bar"></div>
              </div>
              
              <div class="progress-step">
                <div class="step-line"></div>
                <div class="step-line-completed"></div>
                
                <div class="step step-current">
                  <div class="step-icon">✓</div>
                  <div class="step-label">Anfrage</div>
                </div>
                
                <div class="step">
                  <div class="step-icon">2</div>
                  <div class="step-label">Beratung</div>
                </div>
                
                <div class="step">
                  <div class="step-icon">3</div>
                  <div class="step-label">Aktivierung</div>
                </div>
                
                <div class="step">
                  <div class="step-icon">4</div>
                  <div class="step-label">Trading</div>
                </div>
              </div>
              
              <p class="signature">
                Mit freundlichen Grüßen,<br>
                <span class="highlight">Ihr KI-Trading Team</span>
              </p>
            </div>
            <div class="footer">
              <p>© 2024 KI-Trading Bot. Alle Rechte vorbehalten.</p>
              <p>Diese E-Mail wurde automatisch generiert, bitte antworten Sie nicht darauf.</p>
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
