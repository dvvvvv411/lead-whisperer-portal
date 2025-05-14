
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Format date to be more readable
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Format amount in cents to Euro
function formatAmount(amount: number): string {
  return (amount / 100).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR'
  });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!botToken || !chatId) {
      throw new Error('Missing required environment variables: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    }

    // Parse the request body
    const payload = await req.json();
    console.log('Received payload:', JSON.stringify(payload));

    // Format the message based on the notification type
    let message = '';
    
    if (payload.type === 'lead') {
      message = `🔔 *Neuer Lead erhalten!*\n\n` +
        `*Name:* ${payload.name}\n` +
        `*Email:* ${payload.email}\n` +
        `*Telefon:* ${payload.phone}\n` +
        `*Datum:* ${formatDate(payload.created_at)}`;
    } 
    else if (payload.type === 'payment') {
      message = `💰 *Neue Zahlung erhalten!*\n\n` +
        `*Benutzer:* ${payload.user_email}\n` +
        `*Betrag:* ${formatAmount(payload.amount)}\n` +
        `*Währung:* ${payload.currency}\n` +
        `*Status:* ${payload.status}\n` +
        `*Datum:* ${formatDate(payload.created_at)}`;
    }
    else {
      throw new Error(`Unknown notification type: ${payload.type}`);
    }

    // Send the message to Telegram
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const telegramPayload = {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    };

    const telegramResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telegramPayload),
    });

    const telegramResult = await telegramResponse.json();
    
    if (!telegramResponse.ok) {
      throw new Error(`Telegram API error: ${JSON.stringify(telegramResult)}`);
    }

    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent to Telegram' }),
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
