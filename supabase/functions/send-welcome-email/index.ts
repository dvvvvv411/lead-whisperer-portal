
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
    const { name, email, password, redirectUrl } = await req.json();

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({
          error: "Name, email and password are required"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Extract origin from the request URL or use a fallback
    const origin = redirectUrl || "https://ai-bitloon.com";
    const loginUrl = `${origin}/nutzer`;

    const emailResponse = await resend.emails.send({
      from: "bitloon <noreply@ai-bitloon.com>",
      to: [email],
      subject: "Ihre Zugangsdaten für bitloon",
      html: `
        <!DOCTYPE html>
        <html lang="de">
        <head>
          <meta charset="UTF-8">
          <title>Zugangsdaten</title>
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
              margin-bottom: 10px;
            }
            .content p {
              font-size: 16px;
              line-height: 1.6;
              color: #ffffff;
            }
            .credentials {
              background-color: rgba(40, 167, 69, 0.2);
              border: 1px solid #28a745;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
              color: #ffffff;
            }
            .credentials p {
              margin: 5px 0;
              font-family: monospace;
              font-weight: normal;
            }
            .cta {
              display: inline-block;
              margin-top: 20px;
              padding: 12px 24px;
              background-color: #FFD700;
              color: #fff;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
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
              <h2>Zugangsdaten für Ihr Konto</h2>
              <p>Hallo <strong>${name}</strong>,</p>
              <p>Ihr Konto wurde erfolgreich erstellt. Verwenden Sie die folgenden Zugangsdaten, um sich einzuloggen:</p>
              <div class="credentials">
                <p><strong>Benutzername:</strong> ${email}</p>
                <p><strong>Passwort:</strong> ${password}</p>
              </div>
              <a href="${loginUrl}" class="cta">Zum Login</a>
            </div>
            <footer>
              &copy; ${new Date().getFullYear()} Bitloon - GMS Management und Service GmbH | 
              <a href="https://ai-bitloon.com/impressum" target="_blank">Impressum</a> | 
              <a href="https://ai-bitloon.com" target="_blank">Webseite</a> | 
              <a href="https://ai-bitloon.com/datenschutz" target="_blank">Datenschutz</a>
            </footer>
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
