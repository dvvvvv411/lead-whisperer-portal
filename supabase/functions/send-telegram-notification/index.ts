
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Required payload shape for payment activation notifications
interface PaymentActivationPayload {
  type: 'payment-activation';
  amount: number;
  paymentMethod: string;
  userEmail: string;
}

// General payload type
type NotificationPayload = PaymentActivationPayload;

// Validate and format payment activation notification
function formatPaymentActivationMessage(payload: PaymentActivationPayload): string {
  // Validate required fields
  const { amount, paymentMethod, userEmail } = payload;
  
  if (!amount || !paymentMethod || !userEmail) {
    throw new Error('Missing required fields for payment activation notification');
  }

  return `🔔 *Neue Zahlungsbestätigung* 🔔\n\n` +
    `*Betrag:* ${amount}€\n` +
    `*Zahlungsmethode:* ${paymentMethod}\n` +
    `*Benutzer:* ${userEmail}\n` +
    `*Zeit:* ${new Date().toLocaleString('de-DE')}\n\n` +
    `➡️ Bitte im Admin-Panel überprüfen: https://app.kitrading.io/admin/payments`;
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
      console.error('Missing required environment variables');
      throw new Error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID environment variables');
    }

    // Parse request body
    let payload: NotificationPayload;
    if (req.method === 'POST' && req.headers.get('content-type')?.includes('application/json')) {
      payload = await req.json();
      console.log('Received notification request:', JSON.stringify(payload));
    } else {
      throw new Error('Invalid request format. JSON payload required.');
    }

    // Format message based on notification type
    let message: string;
    if (payload.type === 'payment-activation') {
      message = formatPaymentActivationMessage(payload as PaymentActivationPayload);
    } else {
      throw new Error(`Unsupported notification type: ${payload.type}`);
    }

    // Send message to Telegram
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    console.log('Sending Telegram notification...');
    
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
      console.error('Telegram API error:', JSON.stringify(telegramResult));
      throw new Error(`Telegram API error: ${JSON.stringify(telegramResult)}`);
    }

    console.log('Notification sent successfully to Telegram');

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent to Telegram' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error sending notification:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Unknown error occurred' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
