
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("Simple Telegram Alert function called");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Telegram bot token from environment variables
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      console.error('Missing TELEGRAM_BOT_TOKEN environment variable');
      throw new Error('Missing TELEGRAM_BOT_TOKEN environment variable');
    }

    // Fixed chat ID as requested - no customization needed
    const chatId = "7111152096";
    
    let messageText = "";
    let eventType = "";
    
    // Parse request body if it's a POST request with JSON content
    if (req.method === 'POST' && req.headers.get('content-type')?.includes('application/json')) {
      const payload = await req.json();
      console.log("Received payload:", JSON.stringify(payload));
      
      // Just check the type - no database lookup needed
      if (payload.type === 'lead') {
        eventType = 'lead';
        messageText = "🔔 *Neuer Lead erhalten!*";
      } 
      else if (payload.type === 'payment') {
        eventType = 'payment';
        messageText = "💰 *Neue Zahlung erhalten!*";
      }
      else {
        eventType = 'unknown';
        messageText = "⚠️ *Neue Benachrichtigung*";
      }
    } else {
      throw new Error('Invalid request: Expected POST with JSON content');
    }

    console.log(`Sending ${eventType} notification to Telegram chat ${chatId}`);
    
    // Send to Telegram
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const telegramPayload = {
      chat_id: chatId,
      text: messageText,
      parse_mode: 'Markdown',
    };

    console.log("Calling Telegram API with payload:", JSON.stringify({
      ...telegramPayload,
      chat_id: "[REDACTED]" // Don't log the actual chat ID
    }));
    
    const telegramResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telegramPayload),
    });

    const telegramResult = await telegramResponse.json();
    console.log("Telegram API response:", JSON.stringify(telegramResult));
    
    if (!telegramResponse.ok) {
      throw new Error(`Telegram API error: ${JSON.stringify(telegramResult)}`);
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Notification sent to Telegram: ${eventType}`,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    
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
