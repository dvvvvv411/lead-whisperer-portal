
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID') || "7111152096"; // Using the default chat ID
    
    if (!botToken) {
      console.error('Missing environment variable: TELEGRAM_BOT_TOKEN');
      throw new Error('Missing required environment variable: TELEGRAM_BOT_TOKEN');
    }

    // Parse request body
    let payload;
    if (req.method === 'POST' && req.headers.get('content-type')?.includes('application/json')) {
      payload = await req.json();
      console.log('Received lead form submission:', JSON.stringify(payload));
    } else {
      throw new Error('Invalid request format. JSON payload required.');
    }

    // Validate lead data
    if (!payload || !payload.name || !payload.email || !payload.phone) {
      throw new Error('Invalid lead data: Name, email and phone are required');
    }

    // Format message
    const message = `🚨 *Neuer Lead über Landingpage!* 🚨\n\n` +
      `*Name:* ${payload.name}\n` +
      `*Email:* ${payload.email}\n` +
      `*Telefon:* ${payload.phone}\n` +
      `*Nachricht:* ${payload.message || "Keine Nachricht"}\n` +
      `*Zeit:* ${new Date().toLocaleString('de-DE')}\n\n` +
      `➡️ Admin-Panel: https://app.kitrading.io/admin/leads`;

    // Send to Telegram
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const telegramPayload = {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    };

    console.log('Sending Telegram notification for lead form submission');
    const telegramResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telegramPayload),
    });

    const telegramResult = await telegramResponse.json();
    
    if (!telegramResponse.ok) {
      console.error('Telegram API error:', JSON.stringify(telegramResult));
      throw new Error(`Telegram API error: ${JSON.stringify(telegramResult)}`);
    }

    console.log('Lead notification sent successfully to Telegram');

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Lead notification sent to Telegram'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error sending lead notification:', error);
    
    // Return error response
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
