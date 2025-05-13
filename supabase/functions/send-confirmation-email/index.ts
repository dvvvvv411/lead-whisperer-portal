
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
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              margin: 0;
              padding: 0;
              background-color: #f6f6f7;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              border: 1px solid #e1e1e1;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }
            .header {
              text-align: center;
              padding: 30px 0;
              background-color: #f9f9f9;
              border-bottom: 1px solid #e1e1e1;
            }
            .logo {
              max-width: 180px;
            }
            .content {
              padding: 30px;
              background-color: rgba(255, 255, 255, 0.95);
            }
            .greeting {
              font-size: 22px;
              margin-bottom: 20px;
              color: #333333;
              font-weight: bold;
            }
            .message {
              color: #505050;
              margin-bottom: 25px;
              font-size: 16px;
            }
            .highlight {
              color: #6366F1;
              font-weight: bold;
            }
            .notification-box {
              background-color: #f1f5f9;
              border-left: 4px solid #6366F1;
              padding: 15px;
              margin: 20px 0;
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
              color: #6366F1;
            }
            .footer {
              text-align: center;
              padding: 20px;
              background-color: #f9f9f9;
              font-size: 12px;
              color: #888888;
              border-top: 1px solid #e1e1e1;
            }
            .footer p {
              margin: 5px 0;
            }
            .progress {
              background-color: #f1f1f1;
              height: 10px;
              border-radius: 5px;
              margin: 20px 0;
              overflow: hidden;
            }
            .progress-bar {
              width: 25%;
              height: 100%;
              background-color: #6366F1;
              border-radius: 5px;
            }
            .progress-step {
              display: flex;
              justify-content: space-between;
              margin-top: 8px;
              position: relative;
              z-index: 2;
              flex-wrap: nowrap;
              gap: 0;
            }
            .step {
              display: flex;
              flex-direction: column;
              align-items: center;
              flex: 1;
              text-align: center;
            }
            .step-icon {
              width: 30px;
              height: 30px;
              background-color: #f1f1f1;
              border-radius: 50%;
              border: 1px solid #e1e1e1;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 5px;
              color: #888888;
              font-weight: bold;
            }
            .step-current .step-icon {
              background-color: #6366F1;
              color: #fff;
              border-color: #6366F1;
            }
            .step-label {
              font-size: 12px;
              color: #888888;
              width: 100%;
            }
            .step-current .step-label {
              color: #6366F1;
              font-weight: bold;
            }
            .step-line {
              flex-grow: 1;
              height: 1px;
              background-color: #e1e1e1;
              margin: 0 5px;
              position: relative;
              top: 15px;
            }
            .signature {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #f1f1f1;
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
        <body bgcolor="#f6f6f7">
          <div class="container">
            <div class="header">
              <img src="https://i.imgur.com/Q191f5z.png" alt="KI-Trading Logo" class="logo">
            </div>
            <div class="content">              
              <h2 class="greeting">Hallo ${name},</h2>
              <p class="message">
                Vielen Dank für deine Anfrage bei <span class="highlight">KI-Trading</span>!
              </p>
              <p class="message">
                Wir haben deine Nachricht erhalten und werden uns <span class="highlight">in Kürze</span> bei dir melden.
              </p>
              
              <div class="notification-box">
                <p><span class="notification-icon">🔔</span> Bitte halte dein Telefon bereit, da wir dich anrufen werden, um dir weitere Informationen über unsere KI-Trading-Lösung zu geben.</p>
              </div>
              
              <p class="message">Du bist nur noch einen Schritt von der finanziellen Freiheit entfernt!</p>
              
              <div class="progress">
                <div class="progress-bar"></div>
              </div>
              
              <div class="progress-step">
                <div class="step step-current">
                  <div class="step-icon">✓</div>
                  <div class="step-label">Anfrage</div>
                </div>
                <div class="step-line"></div>
                <div class="step">
                  <div class="step-icon">2</div>
                  <div class="step-label">Beratung</div>
                </div>
                <div class="step-line"></div>
                <div class="step">
                  <div class="step-icon">3</div>
                  <div class="step-label">Aktivierung</div>
                </div>
                <div class="step-line"></div>
                <div class="step">
                  <div class="step-icon">4</div>
                  <div class="step-label">Trading</div>
                </div>
              </div>
              
              <p class="signature">
                Mit freundlichen Grüßen,<br>
                <span class="highlight">Dein KI-Trading Team</span>
              </p>
            </div>
            <div class="footer">
              <p>© 2024 KI-Trading Bot. Alle Rechte vorbehalten.</p>
              <p>Diese E-Mail wurde automatisch generiert, bitte antworte nicht darauf.</p>
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
