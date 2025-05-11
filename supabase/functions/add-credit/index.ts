
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    const { userId, amount } = await req.json();
    
    if (!userId || typeof amount !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: userId and amount' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Convert euros to cents
    const amountInCents = Math.round(amount * 100);
    console.log(`Adding ${amount}€ (${amountInCents} cents) to user ${userId}`);
    
    // First get the current balance to ensure we add to it, not replace it
    const { data: currentCreditData, error: fetchError } = await supabaseClient
      .from('user_credits')
      .select('amount')
      .eq('user_id', userId)
      .maybeSingle();
      
    let finalAmount: number;
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching current credit:', fetchError);
      throw fetchError;
    }
    
    // If user has existing credit, add to it; otherwise use the new amount
    if (currentCreditData) {
      const currentAmount = currentCreditData.amount || 0;
      finalAmount = currentAmount + amountInCents;
      console.log(`Current amount: ${currentAmount} cents + New amount: ${amountInCents} cents = Final: ${finalAmount} cents`);
    } else {
      finalAmount = amountInCents;
      console.log(`No existing credit found. Setting initial amount to ${finalAmount} cents`);
    }
    
    // Update the credit using upsert
    const { data, error } = await supabaseClient
      .from('user_credits')
      .upsert({ 
        user_id: userId,
        amount: finalAmount,
        last_updated: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.error('Error updating credit:', error);
      throw error;
    }
    
    console.log(`Successfully updated credit for user ${userId} to ${finalAmount} cents (${finalAmount/100}€)`);
    return new Response(
      JSON.stringify({ 
        success: true, 
        data,
        previousAmount: currentCreditData?.amount,
        addedAmount: amountInCents,
        newAmount: finalAmount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in add-credit function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
