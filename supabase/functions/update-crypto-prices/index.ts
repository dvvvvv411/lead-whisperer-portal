
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

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
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch top cryptocurrencies from CoinGecko
    const cryptoResponse = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    if (!cryptoResponse.ok) {
      throw new Error(`CoinGecko API error: ${cryptoResponse.status}`);
    }
    
    const cryptoData = await cryptoResponse.json();
    console.log(`Fetched ${cryptoData.length} cryptocurrencies from CoinGecko`);
    
    // Process and insert crypto data
    for (const coin of cryptoData) {
      const { data: existingCrypto, error: findError } = await supabase
        .from('crypto_assets')
        .select('*')
        .eq('symbol', coin.symbol.toUpperCase())
        .maybeSingle();
      
      if (findError) {
        console.error(`Error finding crypto ${coin.symbol}:`, findError.message);
        continue;
      }
      
      const cryptoData = {
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        price_change_24h: coin.price_change_24h,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        image_url: coin.image,
        last_updated: new Date().toISOString()
      };
      
      if (existingCrypto) {
        // Update existing crypto
        const { error: updateError } = await supabase
          .from('crypto_assets')
          .update(cryptoData)
          .eq('id', existingCrypto.id);
        
        if (updateError) {
          console.error(`Error updating crypto ${coin.symbol}:`, updateError.message);
        } else {
          console.log(`Updated crypto: ${coin.name} (${coin.symbol})`);
        }
      } else {
        // Insert new crypto
        const { error: insertError } = await supabase
          .from('crypto_assets')
          .insert([cryptoData]);
        
        if (insertError) {
          console.error(`Error inserting crypto ${coin.symbol}:`, insertError.message);
        } else {
          console.log(`Added new crypto: ${coin.name} (${coin.symbol})`);
        }
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Updated ${cryptoData.length} cryptocurrencies`,
        updated_at: new Date().toISOString() 
      }),
      {
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating crypto prices:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 500,
      }
    );
  }
});
