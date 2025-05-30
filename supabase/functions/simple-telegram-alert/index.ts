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
    return !!(payload.user_email && payload.amount);
  } else if (type === 'withdrawal') {
    // Updated validation for withdrawal payload from frontend
    return !!(payload.amount && payload.walletCurrency && payload.walletAddress && payload.userEmail);
  } else if (type === 'test') {
    return true; // Test messages don't need validation
  }
  
  return false;
}

// Helper function to get all registered Telegram chat IDs
async function getChatIds(supabase: any, specificId?: string): Promise<string[]> {
  try {
    let query = supabase.from('telegram_chat_ids').select('chat_id');
    
    // If a specific ID was provided, only get that one
    if (specificId) {
      query = query.eq('chat_id', specificId);
    }
    
    const { data, error } = await query;
    
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
    const defaultChatId = "7111152096"; // Fixed chat ID as requested
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!botToken) {
      console.error('Missing environment variable: TELEGRAM_BOT_TOKEN');
      throw new Error('Missing required environment variable: TELEGRAM_BOT_TOKEN');
    }

    // Initialize Supabase client with admin privileges
    let supabase;
    if (supabaseUrl && supabaseServiceKey) {
      supabase = createClient(supabaseUrl, supabaseServiceKey);
    } else {
      throw new Error('Missing Supabase credentials');
    }

    // Initialize variables
    let message = '';
    let entry_type = '';
    let entry_id = '';
    let payload; 
    let customChatId = null;
    
    // Check if this is a request with a body
    if (req.method === 'POST' && req.headers.get('content-type')?.includes('application/json')) {
      try {
        payload = await req.json();
        console.log('Received payload:', JSON.stringify(payload));
        
        // Check if a specific chat ID was provided
        if (payload.chatId) {
          customChatId = payload.chatId;
          console.log(`Using custom chat ID: ${customChatId}`);
        }
      } catch (e) {
        console.error('Error parsing request body:', e);
        throw new Error(`Could not parse request body: ${e.message}`);
      }
    }
    
    // Test endpoint for direct verification
    const url = new URL(req.url);
    if (url.pathname.endsWith('/test') || payload?.type === 'test') {
      console.log('Test endpoint called');
      
      // Determine which chat IDs to use
      let chatIds: string[];
      if (customChatId) {
        // If a specific chat ID was provided in the payload, only use that one
        chatIds = [customChatId];
      } else {
        // Otherwise, get all chat IDs from the database
        chatIds = await getChatIds(supabase);
      }
      
      // Use custom message if provided in payload, otherwise use default test message
      const testMessage = payload?.message || `🧪 *Test Nachricht* 🧪\n\nDiese Nachricht bestätigt, dass der Telegram-Bot funktioniert.`;
      
      // Track success for all chat IDs
      const results = [];
      
      // Send test message to each chat ID
      for (const chatId of chatIds) {
        const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const telegramPayload = {
          chat_id: chatId,
          text: testMessage + `\n\nGesendet an Chat-ID: ${chatId}`,
          parse_mode: 'Markdown',
        };

        console.log(`Sending test message to Telegram chat ID: ${chatId}`);
        
        try {
          const telegramResponse = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(telegramPayload),
          });

          const telegramResult = await telegramResponse.json();
          console.log(`Telegram API response for ${chatId}:`, telegramResult);
          
          results.push({
            chat_id: chatId,
            success: telegramResponse.ok,
            details: telegramResult
          });
        } catch (error) {
          console.error(`Error sending test to ${chatId}:`, error);
          results.push({
            chat_id: chatId,
            success: false,
            error: error.message
          });
        }
      }
      
      // Check if all messages were sent successfully
      const allSuccess = results.every(r => r.success);
      
      return new Response(
        JSON.stringify({ 
          success: allSuccess, 
          message: allSuccess ? 'Test message sent to all Telegram chat IDs' : 'Some messages failed to send',
          results: results
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: allSuccess ? 200 : 500
        }
      );
    }
    
    // Check if this is a direct API call with payload
    if (req.method === 'POST' && payload) {
      console.log('Processing direct payload:', JSON.stringify(payload));
      
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
          `*Telefon:* ${payload.phone || 'Nicht angegeben'}`;
      } 
      else if (payload.type === 'payment') {
        // For payment, handle both database-created format and direct API call format
        if (payload.id && payload.created_at) {
          // Standard format from database
          // Validate payload has required fields
          if (!validatePayload(payload, 'payment')) {
            throw new Error(`Invalid payment payload: ${JSON.stringify(payload)}`);
          }
          
          entry_type = 'payment';
          entry_id = payload.id;
          message = `💰 *Neue Zahlung erhalten!*\n\n` +
            `*Benutzer:* ${payload.user_email}\n` +
            `*Betrag:* ${formatAmount(payload.amount)}\n` +
            `*Währung:* ${payload.currency || 'EUR'}\n` +
            `*Status:* ${payload.status || 'pending'}`;
        } else {
          // Direct API call format with minimal info (from frontend)
          entry_type = 'payment';
          // Use temporary ID until actual payment is created
          entry_id = 'temp_' + Date.now();
          
          // Handle amount in different formats
          let amountStr: string;
          if (typeof payload.amount === 'number') {
            // If it's already a number (either cents or euros)
            if (payload.amount > 1000) {
              // Likely in cents, format accordingly
              amountStr = formatAmount(payload.amount);
            } else {
              // Likely in euros, convert to cents then format
              amountStr = formatAmount(payload.amount * 100);
            }
          } else if (typeof payload.amount === 'string') {
            // If it's a string, try to parse and format
            const amountNum = parseFloat(payload.amount);
            amountStr = isNaN(amountNum) ? 'Unbekannt' : formatAmount(amountNum * 100);
          } else {
            amountStr = 'Unbekannt';
          }
          
          // Get the wallet currency from the payload
          const walletCurrency = payload.wallet_currency || payload.walletCurrency || 'Krypto';
          
          message = `💰 *Neue Einzahlung eingegangen!*\n\n` +
            `*Benutzer:* ${payload.userEmail || payload.user_email || 'Nicht angegeben'}\n` +
            `*Betrag:* ${amountStr}\n` +
            `*Zahlungsmethode:* ${walletCurrency}\n` +
            `*Status:* Ausstehend`;
        }
      }
      else if (payload.type === 'withdrawal') {
        // Validate payload has required fields
        if (!validatePayload(payload, 'withdrawal')) {
          console.error('Withdrawal payload validation failed:', payload);
          throw new Error(`Invalid withdrawal payload. Required fields: amount, walletCurrency, walletAddress, userEmail. Received: ${JSON.stringify(payload)}`);
        }
        
        entry_type = 'withdrawal';
        entry_id = 'temp_' + Date.now();
        message = `💸 *Auszahlungsantrag erhalten!*\n\n` +
          `💵 *Betrag:* ${payload.amount}€\n` +
          `💱 *Währung:* ${payload.walletCurrency}\n` +
          `📝 *Wallet-Adresse:* \`${payload.walletAddress}\`\n` +
          `📧 *Nutzer:* ${payload.userEmail}`;
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
            `*Telefon:* ${entry.phone || 'Nicht angegeben'}`;
        } 
        else if (entry_type === 'payment') {
          message = `💰 *Neue Zahlung erhalten!*\n\n` +
            `*Benutzer:* ${entry.email}\n` +
            `*Betrag:* ${formatAmount(entry.amount)}\n` +
            `*Währung:* ${entry.currency}\n` +
            `*Status:* ${entry.status}`;
        }
        
        // Send the message to Telegram
        if (message) {
          console.log(`Sending notification for ${entry_type}:${entry_id}`);
          
          // Get all chat IDs from the database
          const chatIds = await getChatIds(supabase);
          let success = true;
          let errorMessages = [];
          
          // Send to all chat IDs
          for (const chatId of chatIds) {
            // Send the message to Telegram
            const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
            const telegramPayload = {
              chat_id: chatId,
              text: message,
              parse_mode: 'Markdown',
            };

            try {
              const telegramResponse = await fetch(telegramApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(telegramPayload),
              });

              const telegramResult = await telegramResponse.json();
              
              if (!telegramResponse.ok) {
                success = false;
                errorMessages.push(`Error with chat_id ${chatId}: ${JSON.stringify(telegramResult)}`);
              }
            } catch (error: any) {
              success = false;
              errorMessages.push(`Exception with chat_id ${chatId}: ${error.message}`);
            }
          }
          
          // Create a log entry regardless of success (to avoid duplicate notifications)
          await supabase.from('notification_log').insert({
            entry_type,
            entry_id,
            success,
            error_message: errorMessages.length > 0 ? errorMessages.join('; ') : null
          });
          
          if (!success) {
            throw new Error(`Telegram API errors: ${errorMessages.join('; ')}`);
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
    
    // Send the message to all Telegram chat IDs
    if (message) {
      // Get chat IDs - if a specific ID was provided, only use that one
      const chatIds = customChatId ? [customChatId] : await getChatIds(supabase);
      console.log(`Sending notification to ${chatIds.length} chat IDs`);
      
      const results = [];
      let allSuccess = true;
      
      for (const chatId of chatIds) {
        const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const telegramPayload = {
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        };

        console.log(`Sending to chat ID ${chatId}`);
        
        try {
          const telegramResponse = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(telegramPayload),
          });

          const telegramResult = await telegramResponse.json();
          console.log(`Response for ${chatId}:`, telegramResult);
          
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
        console.error('Some Telegram notifications failed:', results.filter(r => !r.success));
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
