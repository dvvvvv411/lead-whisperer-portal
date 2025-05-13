
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
              color: #e1e1e1;
              margin: 0;
              padding: 0;
              background-color: #12151E;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: rgba(26, 31, 44, 0.85);
              border-radius: 12px;
              overflow: hidden;
              border: 1px solid rgba(255, 215, 0, 0.3);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            }
            .header {
              text-align: center;
              padding: 30px 0;
              background: linear-gradient(135deg, #000 0%, #1A1F2C 100%);
              position: relative;
              border-bottom: 1px solid rgba(255, 215, 0, 0.3);
            }
            .header-glow {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: radial-gradient(circle at center, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0) 70%);
              z-index: 1;
            }
            .logo {
              max-width: 180px;
              position: relative;
              z-index: 2;
              filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
            }
            .robot-container {
              text-align: center;
              margin: 20px 0;
            }
            .robot-image {
              max-width: 150px;
              margin: 0 auto;
              filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.5));
            }
            .content {
              padding: 30px;
              background-color: rgba(33, 40, 59, 0.7);
              position: relative;
            }
            .greeting {
              font-size: 22px;
              margin-bottom: 20px;
              color: #ffffff;
              font-weight: bold;
              position: relative;
              z-index: 2;
            }
            .message {
              color: #e1e1e1;
              margin-bottom: 25px;
              font-size: 16px;
              position: relative;
              z-index: 2;
            }
            .highlight {
              color: #FFD700;
              font-weight: bold;
              display: inline-block;
              position: relative;
            }
            .highlight:after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              right: 0;
              height: 2px;
              background: linear-gradient(90deg, rgba(255, 215, 0, 0) 0%, rgba(255, 215, 0, 0.8) 50%, rgba(255, 215, 0, 0) 100%);
            }
            .highlight-glow {
              text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
            }
            .notification-box {
              background-color: rgba(255, 215, 0, 0.1);
              border-left: 4px solid #FFD700;
              padding: 15px;
              margin: 20px 0;
              border-radius: 6px;
              position: relative;
              z-index: 2;
            }
            .notification-box p {
              margin: 0;
              color: #ffffff;
            }
            .notification-icon {
              display: inline-block;
              width: 20px;
              height: 20px;
              margin-right: 10px;
              vertical-align: middle;
              font-size: 20px;
              color: #FFD700;
            }
            .footer {
              text-align: center;
              padding: 20px;
              background-color: #16181a;
              font-size: 12px;
              color: #777;
            }
            .footer p {
              margin: 5px 0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(90deg, #cba135 0%, #FFD700 50%, #e8c564 100%);
              color: #000000;
              text-decoration: none;
              padding: 12px 25px;
              border-radius: 50px;
              font-weight: bold;
              margin: 20px 0;
              text-align: center;
              transition: transform 0.3s ease;
              position: relative;
              border: none;
              box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
            }
            .button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(255, 215, 0, 0.4);
            }
            .progress {
              background-color: #1A1F2C;
              height: 10px;
              border-radius: 5px;
              margin: 20px 0;
              overflow: hidden;
              position: relative;
              border: 1px solid rgba(255, 215, 0, 0.2);
            }
            .progress-bar {
              width: 25%;
              height: 100%;
              background: linear-gradient(90deg, #cba135 0%, #FFD700 100%);
              border-radius: 5px;
              position: relative;
              animation: pulse 2s infinite;
            }
            .progress-badge {
              position: absolute;
              top: -8px;
              right: -8px;
              background: linear-gradient(90deg, #FFD700 0%, #FFA500 100%);
              border-radius: 50%;
              width: 24px;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 14px;
              color: #000;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            }
            .progress-label {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
              font-size: 12px;
              color: #aaa;
            }
            .progress-step {
              display: flex;
              justify-content: space-between;
              margin-top: 5px;
              position: relative;
              z-index: 2;
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
              background-color: #1A1F2C;
              border-radius: 50%;
              border: 1px solid rgba(255, 215, 0, 0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 5px;
              color: #777;
            }
            .step-current .step-icon {
              background-color: #FFD700;
              color: #000;
              box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
            }
            .step-label {
              font-size: 11px;
              color: #aaa;
              width: 100%;
            }
            .step-current .step-label {
              color: #FFD700;
            }
            .step-line {
              flex-grow: 1;
              height: 1px;
              background-color: rgba(255, 215, 0, 0.3);
              margin: 0 5px;
              position: relative;
              top: 15px;
            }
            .signature {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
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
            }
          </style>
        </head>
        <body bgcolor="#12151E">
          <div class="container">
            <div class="header">
              <div class="header-glow"></div>
              <img src="https://i.imgur.com/Q191f5z.png" alt="KI-Trading Logo" class="logo">
            </div>
            <div class="content">
              <div class="robot-container">
                <img src="https://i.imgur.com/UWzBYw1.png" alt="AI Trading Robot" class="robot-image">
              </div>
              
              <h2 class="greeting">Hallo ${name},</h2>
              <p class="message">
                Vielen Dank für deine Anfrage bei <span class="highlight highlight-glow">KI-Trading</span>!
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
