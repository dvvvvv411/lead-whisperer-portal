
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { name, email, phone, leadId } = await req.json();
    
    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: name and email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Sending user registration notification for:", email);

    // Get Telegram credentials from environment
    const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const telegramChatId = Deno.env.get("TELEGRAM_CHAT_ID");

    if (!telegramBotToken || !telegramChatId) {
      console.error("Telegram credentials not configured");
      return new Response(
        JSON.stringify({ error: "Telegram credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format the notification message
    const message = `🎉 *Neue Benutzerregistrierung*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📧 *E-Mail:* ${email}\n` +
      `📱 *Telefon:* ${phone || 'Nicht angegeben'}\n` +
      `🔗 *Lead ID:* ${leadId || 'Nicht verfügbar'}\n\n` +
      `⏰ *Zeit:* ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}`;

    // Send Telegram notification
    const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    const telegramPayload = {
      chat_id: telegramChatId,
      text: message,
      parse_mode: "Markdown"
    };

    const telegramResponse = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(telegramPayload),
    });

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text();
      console.error("Telegram API error:", errorText);
      throw new Error(`Telegram API error: ${telegramResponse.status}`);
    }

    console.log("User registration notification sent successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error sending user registration notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
