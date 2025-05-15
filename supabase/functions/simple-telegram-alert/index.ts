
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
    let userData = null;
    
    // Parse request body if it's a POST request with JSON content
    if (req.method === 'POST' && req.headers.get('content-type')?.includes('application/json')) {
      const payload = await req.json();
      console.log("Received payload:", JSON.stringify(payload));
      
      // Extract user data if provided
      userData = {
        name: payload.name || "",
        email: payload.email || "",
        phone: payload.phone || "",
        message: payload.message || ""
      };
      
      // Just check the type - no database lookup needed
      if (payload.type === 'lead') {
        eventType = 'lead';
        
        // Format detailed message with user's form data
        messageText = `🔔 *Neuer Lead erhalten!*\n\n` +
          `👤 *Name:* ${userData.name}\n` +
          `📧 *Email:* ${userData.email}\n` + 
          `📱 *Telefon:* ${userData.phone}\n` +
          (userData.message ? `💬 *Nachricht:* ${userData.message}` : "");
      } 
      else if (payload.type === 'payment') {
        eventType = 'payment';
        
        // Enhanced payment notification with amount, method, and user email
        const amount = payload.amount !== undefined ? `${payload.amount}€` : "Nicht angegeben";
        const paymentMethod = payload.paymentMethod || "Nicht angegeben";
        const userEmail = payload.userEmail || "Nicht angegeben";
        
        messageText = `💰 *Neue Zahlung erhalten!*\n\n` +
          `💵 *Betrag:* ${amount}\n` +
          `💳 *Zahlungsmethode:* ${paymentMethod}\n` +
          `👤 *Nutzer:* ${userEmail}`;
      }
      else if (payload.type === 'payment-activation') {
        eventType = 'payment-activation';
        // Format message for account activation payment with payment method
        messageText = `💰 *Kontoaktivierung - 250€*\n\n` +
          `💳 *Zahlungsmethode:* ${payload.paymentMethod || "Nicht angegeben"}`;
          
        if (payload.userEmail) {
          messageText += `\n📧 *Nutzer:* ${payload.userEmail}`;
        }
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
