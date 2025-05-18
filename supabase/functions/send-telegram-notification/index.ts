
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

// Helper function to get all registered Telegram chat IDs
async function getChatIds(supabase: any): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('telegram_chat_ids')
      .select('chat_id');
    
    if (error) {
      console.error('Error fetching chat IDs:', error);
      // Fall back to environment variable if DB fetch fails
      const defaultChatId = Deno.env.get('TELEGRAM_CHAT_ID') || "7111152096";
      return [defaultChatId];
    }
    
    if (!data || data.length === 0) {
      // If no chat IDs in database, use environment variable as fallback
      const defaultChatId = Deno.env.get('TELEGRAM_CHAT_ID') || "7111152096";
      console.log(`No chat IDs found in database, using default: ${defaultChatId}`);
      return [defaultChatId];
    }
    
    return data.map((row: any) => row.chat_id);
  } catch (err) {
    console.error('Exception getting chat IDs:', err);
    // Fall back to environment variable
    const defaultChatId = Deno.env.get('TELEGRAM_CHAT_ID') || "7111152096";
    return [defaultChatId];
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!botToken) {
      console.error('Missing required environment variables');
      throw new Error('Missing TELEGRAM_BOT_TOKEN environment variable');
    }

    // Initialize Supabase client with admin privileges
    let supabase;
    if (supabaseUrl && supabaseServiceKey) {
      supabase = createClient(supabaseUrl, supabaseServiceKey);
    } else {
      throw new Error('Missing Supabase credentials');
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

    // Get all chat IDs from the database
    const chatIds = await getChatIds(supabase);
    let allSuccess = true;
    const results = [];
    
    // Send message to all Telegram chat IDs
    for (const chatId of chatIds) {
      const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const telegramPayload = {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      };

      console.log(`Sending notification to Telegram chat ID: ${chatId}`);
      
      try {
        const telegramResponse = await fetch(telegramApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(telegramPayload),
        });

        const telegramResult = await telegramResponse.json();
        
        if (!telegramResponse.ok) {
          allSuccess = false;
          results.push({
            chat_id: chatId,
            success: false,
            error: telegramResult
          });
        } else {
          results.push({
            chat_id: chatId,
            success: true
          });
        }
      } catch (error: any) {
        allSuccess = false;
        results.push({
          chat_id: chatId,
          success: false,
          error: error.message
        });
      }
    }

    if (!allSuccess) {
      console.error('Some notifications failed to send:', results.filter(r => !r.success));
    } else {
      console.log('Notifications sent successfully to all chat IDs');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notifications sent to Telegram',
        results: results
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error sending notification:', error);
    
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
