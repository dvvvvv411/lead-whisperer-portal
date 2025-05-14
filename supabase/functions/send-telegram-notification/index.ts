
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

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

// Validate that the payload has the required data for a notification
function validatePayload(payload: any, type: string): boolean {
  console.log(`Validating ${type} payload:`, JSON.stringify(payload));
  
  if (!payload) return false;
  
  if (type === 'lead') {
    return !!(payload.id && payload.name && payload.email && payload.created_at);
  } else if (type === 'payment') {
    return !!(payload.id && payload.user_email && payload.amount && payload.created_at);
  }
  
  return false;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const defaultChatId = "7111152096"; // Fixed chat ID as requested
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!botToken) {
      console.error('Missing environment variable: TELEGRAM_BOT_TOKEN');
      throw new Error('Missing required environment variable: TELEGRAM_BOT_TOKEN');
    }

    // Initialize Supabase client with admin privileges if needed for database operations
    let supabase;
    if (supabaseUrl && supabaseServiceKey) {
      supabase = createClient(supabaseUrl, supabaseServiceKey);
    }

    // Initialize variables
    let message = '';
    let entry_type = '';
    let entry_id = '';
    let payload; 
    let customChatId = null;
    
    // Check if this is a request with a body
    if (req.method === 'POST' && req.headers.get('content-type')?.includes('application/json')) {
      payload = await req.json();
      
      // Check if a specific chat ID was provided
      if (payload.chatId) {
        customChatId = payload.chatId;
        console.log(`Using custom chat ID: ${customChatId}`);
      }
    }
    
    // Use the default chat ID (7111152096) unless a custom one is provided
    const chatId = customChatId || defaultChatId;
    
    // Test endpoint for direct verification
    const url = new URL(req.url);
    if (url.pathname.endsWith('/test')) {
      console.log('Test endpoint called with chat ID:', chatId);
      
      // Simple test message
      message = `🧪 *Test Nachricht* 🧪\n\nDiese Nachricht bestätigt, dass der Telegram-Bot funktioniert. Uhrzeit: ${formatDate(new Date().toISOString())}\n\nGesendet an Chat-ID: ${chatId}`;
      
      // Send test message to Telegram
      const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const telegramPayload = {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      };

      console.log('Sending test message to Telegram with payload:', telegramPayload);
      const telegramResponse = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telegramPayload),
      });

      const telegramResult = await telegramResponse.json();
      console.log('Telegram API response:', telegramResult);
      
      return new Response(
        JSON.stringify({ 
          success: telegramResponse.ok, 
          message: 'Test message sent to Telegram',
          telegram_response: telegramResult,
          chat_id: chatId
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: telegramResponse.ok ? 200 : 500
        }
      );
    }
    
    // Check if this is a direct API call with payload
    if (req.method === 'POST' && req.headers.get('content-type')?.includes('application/json')) {
      const payload = await req.json();
      console.log('Received direct payload:', JSON.stringify(payload));
      
      // Handle direct notification with full payload
      if (payload.type === 'lead') {
        // Validate payload has required fields
        if (!validatePayload(payload, 'lead')) {
          throw new Error(`Invalid lead payload: ${JSON.stringify(payload)}`);
        }
        
        entry_type = 'lead';
        entry_id = payload.id;
        message = `🔔 *Neuer Lead erhalten!*\n\n` +
          `*Name:* ${payload.name}\n` +
          `*Email:* ${payload.email}\n` +
          `*Telefon:* ${payload.phone || 'Nicht angegeben'}\n` +
          `*Datum:* ${formatDate(payload.created_at)}`;
      } 
      else if (payload.type === 'payment') {
        // Validate payload has required fields
        if (!validatePayload(payload, 'payment')) {
          throw new Error(`Invalid payment payload: ${JSON.stringify(payload)}`);
        }
        
        entry_type = 'payment';
        entry_id = payload.id;
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
    } 
    // If no direct payload, check for recent entries in the database
    else {
      // Query for recent entries (in the last 5 minutes)
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }
      
      const { data: recentEntries, error: entriesError } = await supabase
        .rpc('get_recent_entries', { minutes_ago: 5 });
      
      if (entriesError) {
        throw new Error(`Error querying recent entries: ${entriesError.message}`);
      }
      
      console.log(`Found ${recentEntries?.length || 0} recent entries`);
      
      // Process each entry
      for (const entry of recentEntries || []) {
        entry_type = entry.entry_type;
        entry_id = entry.entry_id;
        
        // Check if this entry has already been notified
        const { data: logEntry, error: logError } = await supabase
          .from('notification_log')
          .select('id')
          .eq('entry_type', entry_type)
          .eq('entry_id', entry_id)
          .single();
          
        if (logError && !logError.message.includes('No rows found')) {
          console.error(`Error checking notification log: ${logError.message}`);
          continue;
        }
        
        // Skip if already notified
        if (logEntry) {
          console.log(`Entry ${entry_type}:${entry_id} already notified, skipping`);
          continue;
        }
        
        // Format message based on entry type
        if (entry_type === 'lead') {
          message = `🔔 *Neuer Lead erhalten!*\n\n` +
            `*Name:* ${entry.name}\n` +
            `*Email:* ${entry.email}\n` +
            `*Telefon:* ${entry.phone || 'Nicht angegeben'}\n` +
            `*Datum:* ${formatDate(entry.created_at)}`;
        } 
        else if (entry_type === 'payment') {
          message = `💰 *Neue Zahlung erhalten!*\n\n` +
            `*Benutzer:* ${entry.email}\n` +
            `*Betrag:* ${formatAmount(entry.amount)}\n` +
            `*Währung:* ${entry.currency}\n` +
            `*Status:* ${entry.status}\n` +
            `*Datum:* ${formatDate(entry.created_at)}`;
        }
        
        // Send the message to Telegram
        if (message) {
          console.log(`Sending notification for ${entry_type}:${entry_id}`);
          
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
          
          // Create a log entry regardless of success (to avoid duplicate notifications)
          const success = telegramResponse.ok;
          const errorMessage = success ? null : JSON.stringify(telegramResult);
          
          await supabase.from('notification_log').insert({
            entry_type,
            entry_id,
            success,
            error_message: errorMessage
          });
          
          if (!telegramResponse.ok) {
            throw new Error(`Telegram API error: ${JSON.stringify(telegramResult)}`);
          }
          
          // Only process one notification at a time
          break;
        }
      }
    }

    // If no message was sent (e.g., no new entries), return a different response
    if (!message) {
      return new Response(
        JSON.stringify({ success: true, message: 'No new entries to notify' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
    
    // Send the message to Telegram if it hasn't been sent yet
    if (message && (!entry_type || !entry_id)) {
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

      if (!telegramResponse.ok) {
        const telegramResult = await telegramResponse.json();
        throw new Error(`Telegram API error: ${JSON.stringify(telegramResult)}`);
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification sent to Telegram',
        entry_type,
        entry_id 
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
