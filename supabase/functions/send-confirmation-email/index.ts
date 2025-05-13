
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
        <html lang="de">
        <head>
          <meta charset="UTF-8">
          <title>Danke für deine Anfrage</title>
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
            .content {
              padding: 20px 0;
            }
            .content h2 {
              color: #FFD700;
              font-size: 22px;
              margin-bottom: 15px;
            }
            .content p {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 15px;
            }
            .highlight {
              color: #FFD700;
              font-weight: bold;
            }
            .notification-box {
              background-color: #2e2e40;
              border-left: 4px solid #FFD700;
              padding: 15px;
              margin: 25px 0;
              border-radius: 4px;
            }
            .notification-box p {
              margin: 0;
            }
            .notification-icon {
              display: inline-block;
              width: 20px;
              height: 20px;
              margin-right: 10px;
              vertical-align: middle;
              font-size: 18px;
              color: #FFD700;
            }
            .progress {
              background-color: #2e2e40;
              height: 10px;
              border-radius: 5px;
              margin: 25px 0;
              overflow: hidden;
            }
            .progress-bar {
              width: 25%;
              height: 100%;
              background: linear-gradient(90deg, #FFD700 0%, #FFC82E 100%);
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
              background-color: #2e2e40;
              border-radius: 50%;
              border: 1px solid #444;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 5px;
              color: #aaa;
              font-weight: bold;
            }
            .step-current .step-icon {
              background: linear-gradient(90deg, #FFD700 0%, #FFC82E 100%);
              color: #000;
              border-color: #FFD700;
            }
            .step-label {
              font-size: 12px;
              color: #aaa;
              width: 100%;
            }
            .step-current .step-label {
              color: #FFD700;
              font-weight: bold;
            }
            .step-line {
              position: absolute;
              top: 15px;
              height: 1px;
              background-color: #444;
              width: 100%;
              z-index: -1;
              left: 0;
            }
            .step-line-completed {
              position: absolute;
              top: 15px;
              height: 1px;
              background-color: #FFD700;
              width: 12.5%;
              z-index: -1;
              left: 0;
            }
            .signature {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #333;
            }
            footer {
              text-align: center;
              font-size: 13px;
              color: #aaa;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <header>
              <img src="https://i.imgur.com/Q191f5z.png" alt="KI-Trading Bot Logo" style="height: 60px; margin-bottom: 10px;">
            </header>
            <div class="content">              
              <h2>Hallo ${name},</h2>
              <p>
                Vielen Dank für Ihre Anfrage bei <span class="highlight">KI-Trading</span>!
              </p>
              <p>
                Wir haben Ihre Nachricht erhalten und werden uns <span class="highlight">in Kürze</span> bei Ihnen melden. Ihr Interesse an unserer KI-basierten Krypto-Handelsplattform freut uns sehr.
              </p>
              
              <div class="notification-box">
                <p><span class="notification-icon">🔔</span> Bitte halten Sie Ihr Telefon bereit, da wir Sie anrufen werden, um Ihnen weitere Informationen über unsere KI-Trading-Lösung zu geben.</p>
              </div>
              
              <p>Sie sind nur noch einen Schritt von der finanziellen Freiheit entfernt!</p>
              
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
            <footer>
              © ${new Date().getFullYear()} KI-Trading Bot – Sicherheit und Präzision
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
