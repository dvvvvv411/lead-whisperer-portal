
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
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({
          error: "Name, email, and password are required"
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
      subject: "Willkommen bei KI-Trading - Deine Zugangsdaten",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Willkommen bei KI-Trading</title>
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
              background-color: #1A1F2C;
              border-radius: 12px;
              overflow: hidden;
              border: 1px solid rgba(255, 215, 0, 0.2);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            }
            .header {
              text-align: center;
              padding: 30px 0;
              background: linear-gradient(135deg, #cba135 0%, #FFD700 50%, #e8c564 100%);
              position: relative;
              overflow: hidden;
            }
            .header-glow {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: radial-gradient(circle at center, rgba(255, 215, 0, 0.4) 0%, rgba(255, 215, 0, 0) 70%);
              z-index: 1;
            }
            .logo {
              max-width: 180px;
              position: relative;
              z-index: 2;
              filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
            }
            .content {
              padding: 30px;
              background-color: #21283B;
              position: relative;
            }
            .content-bg-pattern {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              opacity: 0.05;
              background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNNTcuNTQ5IDI5LjYzN2wtNC43Mi00LjcyYy0xLjA5OS0xLjA5OS0yLjg4OC0xLjA5OS0zLjk4NyAwbC00LjcyIDQuNzJjLTEuMDk5IDEuMDk5LTEuMDk5IDIuODg4IDAgMy45ODdsNC43MiA0LjcyYzEuMDk5IDEuMDk5IDIuODg4IDEuMDk5IDMuOTg3IDBsNC43Mi00LjcyYzEuMDk5LTEuMDk5IDEuMDk5LTIuODg4IDAtMy45ODd6IiBmaWxsPSIjRkZGIi8+PC9zdmc+');
            }
            .vip-badge {
              position: absolute;
              top: -15px;
              right: -15px;
              width: 100px;
              height: 100px;
              overflow: hidden;
            }
            .vip-badge-inner {
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              right: 0;
              background: linear-gradient(135deg, transparent 50%, #FFD700 50%);
              transform: rotate(45deg) translate(35%, -15%);
              box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            }
            .vip-text {
              position: absolute;
              top: 32px;
              right: 5px;
              transform: rotate(45deg);
              color: #000;
              font-weight: bold;
              font-size: 12px;
              text-transform: uppercase;
            }
            .greeting {
              font-size: 24px;
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
            .credentials {
              background-color: rgba(13, 15, 20, 0.5);
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
              border: 1px solid rgba(255, 215, 0, 0.3);
              position: relative;
              z-index: 2;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            }
            .credentials h3 {
              color: #FFD700;
              margin-top: 0;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .credentials h3:before {
              content: '🔐';
              font-size: 20px;
            }
            .credentials p {
              margin: 12px 0;
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              padding-bottom: 10px;
            }
            .credentials p:last-child {
              border-bottom: none;
              margin-bottom: 0;
              padding-bottom: 0;
            }
            .credentials strong {
              color: #fff;
            }
            .credentials .value {
              color: #FFD700;
              background: rgba(0, 0, 0, 0.2);
              padding: 4px 10px;
              border-radius: 4px;
              font-family: 'Courier New', monospace;
              letter-spacing: 1px;
              border: 1px solid rgba(255, 215, 0, 0.2);
            }
            .security-note {
              background-color: rgba(139, 92, 246, 0.1);
              border-left: 4px solid #8B5CF6;
              padding: 15px;
              margin: 20px 0;
              font-size: 14px;
              border-radius: 6px;
              position: relative;
              z-index: 2;
            }
            .button {
              display: block;
              background: linear-gradient(90deg, #cba135 0%, #FFD700 50%, #e8c564 100%);
              color: #000000;
              text-decoration: none;
              padding: 15px 25px;
              border-radius: 50px;
              font-weight: bold;
              margin: 25px auto;
              text-align: center;
              transition: all 0.3s ease;
              position: relative;
              max-width: 250px;
              box-shadow: 0 6px 20px rgba(203, 161, 53, 0.4);
              z-index: 2;
            }
            .button:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(255, 215, 0, 0.5);
            }
            .button:after {
              content: '';
              position: absolute;
              top: -6px;
              left: -6px;
              right: -6px;
              bottom: -6px;
              border-radius: 50px;
              background: linear-gradient(90deg, rgba(203, 161, 53, 0.3) 0%, rgba(255, 215, 0, 0.3) 50%, rgba(232, 197, 100, 0.3) 100%);
              z-index: -1;
              animation: pulse 2s infinite;
            }
            .steps {
              margin: 30px 0;
              background-color: rgba(13, 15, 20, 0.5);
              border-radius: 8px;
              padding: 20px;
              position: relative;
              z-index: 2;
              border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .steps h4 {
              margin-top: 0;
              color: #ffffff;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .steps h4:before {
              content: '🚀';
              font-size: 20px;
            }
            .step {
              display: flex;
              margin: 15px 0;
              align-items: flex-start;
            }
            .step-number {
              background-color: #FFD700;
              color: #000;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              margin-right: 15px;
              flex-shrink: 0;
              box-shadow: 0 2px 8px rgba(255, 215, 0, 0.5);
            }
            .step-content {
              flex-grow: 1;
            }
            .step-title {
              color: #FFD700;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .step-description {
              color: #ccc;
              font-size: 14px;
              margin: 0;
            }
            .rewards-section {
              background: linear-gradient(135deg, rgba(19, 21, 23, 0.8) 0%, rgba(33, 40, 59, 0.8) 100%);
              margin: 30px -30px -30px;
              padding: 30px;
              position: relative;
              border-top: 1px solid rgba(255, 215, 0, 0.2);
            }
            .rewards-title {
              text-align: center;
              color: #FFD700;
              margin-top: 0;
              font-size: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
            }
            .rewards-title:before {
              content: '🏆';
              font-size: 24px;
            }
            .reward-item {
              display: flex;
              align-items: center;
              margin: 15px 0;
              background-color: rgba(0, 0, 0, 0.2);
              padding: 12px;
              border-radius: 8px;
              border: 1px solid rgba(255, 215, 0, 0.1);
            }
            .reward-icon {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: linear-gradient(135deg, #cba135 0%, #FFD700 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 15px;
              font-size: 20px;
              color: #000;
            }
            .reward-text {
              flex-grow: 1;
            }
            .reward-title {
              color: #fff;
              margin: 0 0 5px 0;
              font-size: 16px;
            }
            .reward-description {
              color: #aaa;
              margin: 0;
              font-size: 14px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              background-color: #16181A;
              font-size: 12px;
              color: #777;
            }
            .footer p {
              margin: 5px 0;
            }
            .footer a {
              color: #FFD700;
              text-decoration: none;
            }
            @keyframes pulse {
              0% {
                opacity: 0.6;
                transform: scale(0.95);
              }
              50% {
                opacity: 0.3;
                transform: scale(1.05);
              }
              100% {
                opacity: 0.6;
                transform: scale(0.95);
              }
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
              .rewards-section {
                margin: 20px -20px -20px;
                padding: 20px;
              }
              .credentials .value {
                word-break: break-all;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="header-glow"></div>
              <img src="https://i.imgur.com/Q191f5z.png" alt="KI-Trading Logo" class="logo">
            </div>
            <div class="content">
              <div class="content-bg-pattern"></div>
              <div class="vip-badge">
                <div class="vip-badge-inner">
                  <span class="vip-text">VIP</span>
                </div>
              </div>
              
              <h2 class="greeting">Willkommen, ${name}!</h2>
              <p class="message">
                Dein Account für <span class="highlight highlight-glow">KI-Trading</span> wurde erfolgreich erstellt.
              </p>
              <p class="message">
                Mit unserer KI-Trading-Lösung bist du bereit, den Markt mit Hilfe unseres fortschrittlichen Algorithmus zu erobern und deine finanzielle Zukunft selbst zu gestalten.
              </p>
              
              <div class="credentials">
                <h3>Deine Zugangsdaten</h3>
                <p>
                  <strong>E-Mail:</strong>
                  <span class="value">${email}</span>
                </p>
                <p>
                  <strong>Passwort:</strong>
                  <span class="value">${password}</span>
                </p>
                ${phone ? `
                <p>
                  <strong>Telefon:</strong>
                  <span class="value">${phone}</span>
                </p>
                ` : ''}
              </div>
              
              <div class="security-note">
                <p><strong>🔒 Sicherheitshinweis:</strong> Bitte bewahre deine Zugangsdaten sicher auf und teile sie mit niemandem.</p>
              </div>
              
              <p class="message">Mit diesen Zugangsdaten kannst du dich sofort einloggen und mit dem Trading beginnen:</p>
              
              <a href="https://ki-trading-bot.de/auth" class="button">Jetzt einloggen</a>
              
              <div class="steps">
                <h4>Nächste Schritte</h4>
                
                <div class="step">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <div class="step-title">Account aktivieren</div>
                    <p class="step-description">Führe deine erste Einzahlung durch, um deinen Account zu aktivieren und Zugriff auf alle Trading-Features zu erhalten.</p>
                  </div>
                </div>
                
                <div class="step">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <div class="step-title">KI-Trading Bot einrichten</div>
                    <p class="step-description">Konfiguriere den KI-Trading Bot nach deinen Präferenzen und Handelsstrategien.</p>
                  </div>
                </div>
                
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <div class="step-title">Erste Trades ausführen</div>
                    <p class="step-description">Starte mit deinen ersten Trades und beobachte, wie der KI-Algorithmus für dich arbeitet.</p>
                  </div>
                </div>
              </div>
              
              <div class="rewards-section">
                <h3 class="rewards-title">Deine Vorteile</h3>
                
                <div class="reward-item">
                  <div class="reward-icon">💰</div>
                  <div class="reward-text">
                    <h5 class="reward-title">Passive Einkommensquelle</h5>
                    <p class="reward-description">Verdiene täglich durch automatisierte KI-gesteuerte Trades.</p>
                  </div>
                </div>
                
                <div class="reward-item">
                  <div class="reward-icon">🤖</div>
                  <div class="reward-text">
                    <h5 class="reward-title">KI-Technologie</h5>
                    <p class="reward-description">Nutze fortschrittliche Algorithmen für optimale Trading-Entscheidungen.</p>
                  </div>
                </div>
                
                <div class="reward-item">
                  <div class="reward-icon">🔒</div>
                  <div class="reward-text">
                    <h5 class="reward-title">Sicherheit & Support</h5>
                    <p class="reward-description">Profitiere von höchsten Sicherheitsstandards und unserem 24/7 Support.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="footer">
              <p>© 2024 KI-Trading Bot. Alle Rechte vorbehalten.</p>
              <p>Bei Fragen oder Problemen stehen wir dir jederzeit zur Verfügung. Kontaktiere uns einfach per <a href="mailto:support@ki-trading-bot.de">E-Mail</a> oder Telefon.</p>
              <p>Bitte bewahre deine Zugangsdaten sicher auf und teile sie mit niemandem.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
