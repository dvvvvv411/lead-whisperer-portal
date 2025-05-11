
import { supabase } from "@/integrations/supabase/client";

export const addCreditToUser = async (userId: string, amountInEuros: number): Promise<boolean> => {
  try {
    // Convert euro amount to cents
    const amountInCents = Math.round(amountInEuros * 100);
    
    // Get current credit value first
    const { data: creditData, error: fetchError } = await supabase
      .from('user_credits')
      .select('amount')
      .eq('user_id', userId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching current credit:", fetchError);
      return false;
    }
    
    // Calculate the new amount
    const currentAmount = creditData?.amount || 0;
    const newAmount = currentAmount + amountInCents;
    
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
    
    // Update or insert user credit
    const { error } = await supabase
      .from('user_credits')
      .upsert({ 
        user_id: userId,
        amount: amountInCents,
        last_updated: new Date().toISOString()
      });
    
    if (error) {
      console.error("Error setting credit:", error);
      return false;
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

// Call this function once to add credit
giveTestCredit();
