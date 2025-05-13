
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
              font-size: 24px;
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
            .credentials {
              background-color: #f8fafc;
              border-radius: 6px;
              padding: 20px;
              margin: 25px 0;
              border: 1px solid #e1e1e1;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }
            .credentials h3 {
              color: #333333;
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
              border-bottom: 1px solid #f1f1f1;
              padding-bottom: 10px;
            }
            .credentials p:last-child {
              border-bottom: none;
              margin-bottom: 0;
              padding-bottom: 0;
            }
            .credentials strong {
              color: #333333;
            }
            .credentials .value {
              color: #6366F1;
              background: #f1f5f9;
              padding: 4px 10px;
              border-radius: 4px;
              font-family: 'Courier New', monospace;
              letter-spacing: 1px;
              border: 1px solid #e1e1e1;
            }
            .security-note {
              background-color: #f8fafc;
              border-left: 4px solid #6366F1;
              padding: 15px;
              margin: 20px 0;
              font-size: 14px;
              border-radius: 4px;
            }
            .button {
              display: block;
              background-color: #6366F1;
              color: #ffffff;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-weight: bold;
              margin: 25px auto;
              text-align: center;
              max-width: 200px;
            }
            .steps {
              margin: 30px 0;
              background-color: #f8fafc;
              border-radius: 6px;
              padding: 20px;
              border: 1px solid #e1e1e1;
            }
            .steps h4 {
              margin-top: 0;
              color: #333333;
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
              background-color: #6366F1;
              color: #fff;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              margin-right: 15px;
              flex-shrink: 0;
            }
            .step-content {
              flex-grow: 1;
            }
            .step-title {
              color: #333333;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .step-description {
              color: #505050;
              font-size: 14px;
              margin: 0;
            }
            .rewards-section {
              background-color: #f9f9f9;
              margin: 30px -30px -30px;
              padding: 30px;
              border-top: 1px solid #e1e1e1;
            }
            .rewards-title {
              text-align: center;
              color: #333333;
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
              background-color: #ffffff;
              padding: 12px;
              border-radius: 6px;
              border: 1px solid #e1e1e1;
            }
            .reward-icon {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background-color: #6366F1;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 15px;
              font-size: 20px;
              color: #fff;
            }
            .reward-text {
              flex-grow: 1;
            }
            .reward-title {
              color: #333333;
              margin: 0 0 5px 0;
              font-size: 16px;
            }
            .reward-description {
              color: #505050;
              margin: 0;
              font-size: 14px;
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
            .footer a {
              color: #6366F1;
              text-decoration: none;
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
        <body bgcolor="#f6f6f7">
          <div class="container">
            <div class="header">
              <img src="https://i.imgur.com/Q191f5z.png" alt="KI-Trading Logo" class="logo">
            </div>
            <div class="content">              
              <h2 class="greeting">Willkommen, ${name}!</h2>
              <p class="message">
                Dein Account für <span class="highlight">KI-Trading</span> wurde erfolgreich erstellt.
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
