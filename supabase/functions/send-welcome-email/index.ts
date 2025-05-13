
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
      subject: "Willkommen bei KI-Trading - Ihre Zugangsdaten",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Willkommen bei KI-Trading</title>
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
              font-size: 24px;
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
            .credentials {
              background-color: #F9F9F9;
              border-radius: 6px;
              padding: 20px;
              margin: 25px 0;
              border: 1px solid #E8E8E8;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }
            .credentials h3 {
              color: #333333;
              margin-top: 0;
              display: flex;
              align-items: center;
              gap: 10px;
              padding-bottom: 10px;
              border-bottom: 1px solid #E8E8E8;
              margin-bottom: 15px;
            }
            .credentials h3:before {
              content: '🔐';
              font-size: 20px;
            }
            .credentials p {
              margin: 12px 0;
              display: flex;
              justify-content: space-between;
              padding-bottom: 10px;
              align-items: center;
            }
            .credentials p:not(:last-child) {
              border-bottom: 1px solid #F0F0F0;
            }
            .credentials strong {
              color: #333333;
            }
            .credentials .value {
              color: #D4AF37;
              background: #FAFAFA;
              padding: 8px 12px;
              border-radius: 4px;
              font-family: 'Arial', sans-serif;
              letter-spacing: 0.5px;
              border: 1px solid #F0F0F0;
              font-weight: 500;
            }
            .security-note {
              background-color: #F9F9F9;
              border-left: 4px solid #D4AF37;
              padding: 15px;
              margin: 20px 0;
              font-size: 14px;
              border-radius: 4px;
            }
            .button {
              display: block;
              background: linear-gradient(90deg, #D4AF37 0%, #E6C868 100%);
              color: #FFFFFF;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-weight: bold;
              margin: 25px auto;
              text-align: center;
              max-width: 200px;
              transition: all 0.2s ease;
            }
            .button:hover {
              background: #D4AF37;
            }
            .steps {
              margin: 30px 0;
              background-color: #F9F9F9;
              border-radius: 6px;
              padding: 20px;
              border: 1px solid #E8E8E8;
            }
            .steps h4 {
              margin-top: 0;
              color: #333333;
              display: flex;
              align-items: center;
              gap: 10px;
              padding-bottom: 10px;
              border-bottom: 1px solid #E8E8E8;
              margin-bottom: 15px;
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
              background: linear-gradient(90deg, #D4AF37 0%, #E6C868 100%);
              color: #FFFFFF;
              width: 25px;
              height: 25px;
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
            .benefits-section {
              background-color: #F9F9F9;
              margin: 30px -30px -30px;
              padding: 30px;
              border-top: 1px solid #E8E8E8;
            }
            .benefits-title {
              text-align: center;
              color: #333333;
              margin-top: 0;
              margin-bottom: 20px;
              font-size: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
            }
            .benefits-title:before {
              content: '🏆';
              font-size: 24px;
            }
            .benefit-item {
              display: flex;
              align-items: center;
              margin: 15px 0;
              background-color: #FFFFFF;
              padding: 15px;
              border-radius: 6px;
              border: 1px solid #E8E8E8;
              transition: all 0.2s ease;
            }
            .benefit-item:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
            }
            .benefit-icon {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: linear-gradient(90deg, #D4AF37 0%, #E6C868 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 15px;
              font-size: 20px;
              color: #FFFFFF;
            }
            .benefit-text {
              flex-grow: 1;
            }
            .benefit-title {
              color: #333333;
              margin: 0 0 5px 0;
              font-size: 16px;
            }
            .benefit-description {
              color: #505050;
              margin: 0;
              font-size: 14px;
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
            .footer a {
              color: #D4AF37;
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
              .benefits-section {
                margin: 20px -20px -20px;
                padding: 20px;
              }
              .credentials .value {
                word-break: break-all;
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
              <h2 class="greeting">Willkommen, ${name}!</h2>
              <p class="message">
                Ihr Account für <span class="highlight">KI-Trading</span> wurde erfolgreich erstellt.
              </p>
              <p class="message">
                Mit unserer KI-Trading-Lösung sind Sie bereit, den Markt mit Hilfe unseres fortschrittlichen Algorithmus zu erobern und Ihre finanzielle Zukunft selbst zu gestalten.
              </p>
              
              <div class="credentials">
                <h3>Ihre Zugangsdaten</h3>
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
                <p><strong>🔒 Sicherheitshinweis:</strong> Bitte bewahren Sie Ihre Zugangsdaten sicher auf und teilen Sie diese mit niemandem.</p>
              </div>
              
              <p class="message">Mit diesen Zugangsdaten können Sie sich sofort einloggen und mit dem Trading beginnen:</p>
              
              <a href="https://ki-trading-bot.de/auth" class="button">Jetzt einloggen</a>
              
              <div class="steps">
                <h4>Nächste Schritte</h4>
                
                <div class="step">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <div class="step-title">Account aktivieren</div>
                    <p class="step-description">Führen Sie Ihre erste Einzahlung durch, um Ihren Account zu aktivieren und Zugriff auf alle Trading-Features zu erhalten.</p>
                  </div>
                </div>
                
                <div class="step">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <div class="step-title">KI-Trading Bot einrichten</div>
                    <p class="step-description">Konfigurieren Sie den KI-Trading Bot nach Ihren Präferenzen und Handelsstrategien.</p>
                  </div>
                </div>
                
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <div class="step-title">Erste Trades ausführen</div>
                    <p class="step-description">Starten Sie mit Ihren ersten Trades und beobachten Sie, wie der KI-Algorithmus für Sie arbeitet.</p>
                  </div>
                </div>
              </div>
              
              <div class="benefits-section">
                <h3 class="benefits-title">Ihre Vorteile</h3>
                
                <div class="benefit-item">
                  <div class="benefit-icon">💰</div>
                  <div class="benefit-text">
                    <h5 class="benefit-title">Passive Einkommensquelle</h5>
                    <p class="benefit-description">Verdienen Sie täglich durch automatisierte KI-gesteuerte Trades.</p>
                  </div>
                </div>
                
                <div class="benefit-item">
                  <div class="benefit-icon">🤖</div>
                  <div class="benefit-text">
                    <h5 class="benefit-title">KI-Technologie</h5>
                    <p class="benefit-description">Nutzen Sie fortschrittliche Algorithmen für optimale Trading-Entscheidungen.</p>
                  </div>
                </div>
                
                <div class="benefit-item">
                  <div class="benefit-icon">🔒</div>
                  <div class="benefit-text">
                    <h5 class="benefit-title">Sicherheit & Support</h5>
                    <p class="benefit-description">Profitieren Sie von höchsten Sicherheitsstandards und unserem 24/7 Support.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="footer">
              <p>© 2024 KI-Trading Bot. Alle Rechte vorbehalten.</p>
              <p>Bei Fragen oder Problemen stehen wir Ihnen jederzeit zur Verfügung. Kontaktieren Sie uns einfach per <a href="mailto:support@ki-trading-bot.de">E-Mail</a> oder Telefon.</p>
              <p>Bitte bewahren Sie Ihre Zugangsdaten sicher auf und teilen Sie diese mit niemandem.</p>
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
