
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
      from: "KI-Trading Bot <noreply@ki-trading-bot.de>",
      to: [email],
      subject: "Willkommen bei KI-Trading - Deine Zugangsdaten",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Willkommen bei KI-Trading</title>
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
            .credentials {
              background-color: #f5f5f5;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
              border-left: 4px solid #cba135;
            }
            .button {
              display: inline-block;
              background: linear-gradient(to right, #cba135, #e8c564);
              color: #000;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
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
              <h2>Willkommen, ${name}!</h2>
              <p>Dein Account für KI-Trading wurde erfolgreich erstellt.</p>
              <p>Mit unserer KI-Trading-Lösung bist du bereit, den Markt mit Hilfe unseres fortschrittlichen Algorithmus zu erobern.</p>
              
              <div class="credentials">
                <h3>Deine Zugangsdaten:</h3>
                <p><strong>E-Mail:</strong> ${email}</p>
                <p><strong>Passwort:</strong> ${password}</p>
                ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
              </div>
              
              <p>Mit diesen Zugangsdaten kannst du dich sofort einloggen und mit dem Trading beginnen:</p>
              
              <a href="https://ki-trading-bot.de/auth" class="button">Jetzt einloggen</a>
              
              <p>Bei Fragen oder Problemen stehen wir dir jederzeit zur Verfügung. Kontaktiere uns einfach per E-Mail oder Telefon.</p>
              
              <p>Viel Erfolg beim Trading!<br>Dein KI-Trading Team</p>
            </div>
            <div class="footer">
              <p>© 2024 KI-Trading Bot. Alle Rechte vorbehalten.</p>
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
