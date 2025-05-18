
import { supabase } from "@/integrations/supabase/client";

export const addCreditToUser = async (userId: string, amountInEuros: number): Promise<boolean> => {
  try {
    // Convert euro amount to cents
    const amountInCents = Math.round(amountInEuros * 100);
    
    console.log(`Starting credit operation for user ${userId} with amount ${amountInEuros}€ (${amountInCents} cents)`);
    
    // Get current credit value first
    const { data: creditData, error: fetchError } = await supabase
      .from('user_credits')
      .select('amount')
      .eq('user_id', userId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching current credit:", fetchError);
      
      // If no credit record found, create one with the initial amount
      if (fetchError.code === 'PGRST116') { // "No rows" error
        console.log("No credit record found, creating new record with amount:", amountInCents);
        
        const { error: insertError } = await supabase
          .from('user_credits')
          .insert({ 
            user_id: userId, 
            amount: amountInCents,
            last_updated: new Date().toISOString() 
          });
          
        if (insertError) {
          console.error("Error creating new credit record:", insertError);
          return false;
        }
        
        console.log(`Successfully created new credit record with ${amountInCents} cents`);
        return true;
      }
      
      return false;
    }
    
    // Calculate the new amount by adding to existing credit
    // IMPORTANT: This is the key fix - we are ADDING the new amount to the current amount
    const currentAmount = creditData?.amount || 0;
    const newAmount = currentAmount + amountInCents;
    
    console.log("Current credit amount (cents):", currentAmount);
    console.log("Adding amount (cents):", amountInCents);
    console.log("New total amount (cents):", newAmount);
    
    // Update the user's credit
    const { error } = await supabase
      .from('user_credits')
      .update({ 
        amount: newAmount,
        last_updated: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error adding credit:", error);
      return false;
    }
    
    console.log(`Successfully updated credit to ${newAmount} cents (${newAmount/100}€)`);
    
    // Get user email for notification
    const { data: userData, error: userError } = await supabase
      .auth.admin.getUserById(userId);
      
    if (!userError && userData) {
      const userEmail = userData.user.email;
      
      // Send notification to all registered Telegram chat IDs
      await supabase.functions.invoke('simple-telegram-alert', {
        body: {
          type: 'payment',
          amount: amountInEuros,
          paymentMethod: 'Manuelle Gutschrift',
          userEmail: userEmail
        }
      });
    }
    
    return true;
  } catch (error) {
    console.error("Exception adding credit:", error);
    return false;
  }
};

export const setUserCredit = async (userId: string, amountInEuros: number): Promise<boolean> => {
  try {
    // Convert euro amount to cents
    const amountInCents = Math.round(amountInEuros * 100);
    
    console.log(`Setting fixed credit for user ${userId} to ${amountInEuros}€ (${amountInCents} cents)`);
    
    // Check if the user already has a credit record
    const { data: existingRecord, error: checkError } = await supabase
      .from('user_credits')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Error checking existing credit:", checkError);
      return false;
    }
    
    let result;
    
    if (existingRecord) {
      // Update existing record
      console.log("Updating existing credit record for user:", userId);
      result = await supabase
        .from('user_credits')
        .update({ 
          amount: amountInCents,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', userId);
    } else {
      // Insert new record
      console.log("Creating new credit record for user:", userId);
      result = await supabase
        .from('user_credits')
        .insert({ 
          user_id: userId,
          amount: amountInCents,
          last_updated: new Date().toISOString()
        });
    }
    
    if (result.error) {
      console.error("Error setting credit:", result.error);
      return false;
    }
    
    console.log(`Successfully set credit to ${amountInCents} cents (${amountInEuros}€)`);
    
    // Get user email for notification
    const { data: userData, error: userError } = await supabase
      .auth.admin.getUserById(userId);
      
    if (!userError && userData) {
      const userEmail = userData.user.email;
      
      // Send notification to all registered Telegram chat IDs
      await supabase.functions.invoke('simple-telegram-alert', {
        body: {
          type: 'payment',
          amount: amountInEuros,
          paymentMethod: 'Manuelle Gutschrift (Festbetrag)',
          userEmail: userEmail
        }
      });
    }
    
    return true;
  } catch (error) {
    console.error("Exception setting credit:", error);
    return false;
  }
};

// Execute the credit addition for the specified user
export const giveTestCredit = async () => {
  const userId = "17ff2479-0e9f-433a-b87a-44d613dd9c48";
  const amountToAdd = 100; // 100 Euro
  
  const result = await setUserCredit(userId, amountToAdd);
  
  if (result) {
    console.log(`Successfully set ${amountToAdd}€ credit for user ${userId}`);
  } else {
    console.error(`Failed to set credit for user ${userId}`);
  }
  
  return result;
};
