
import { supabase } from "@/integrations/supabase/client";

// Function to set the credit for a specific user
async function setUserCredit(userId: string, amountInEuros: number) {
  try {
    // Convert euros to cents for storage
    const amountInCents = Math.round(amountInEuros * 100);
    
    // Add the credit directly to the user_credits table
    const { error } = await supabase
      .from('user_credits')
      .upsert({
        user_id: userId,
        amount: amountInCents,
        last_updated: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error setting credit:', error);
      return false;
    }
    
    console.log(`Successfully set ${amountInEuros}€ credit for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error in setUserCredit:', error);
    return false;
  }
}

// Execute the function for our test user
const testUserId = "17ff2479-0e9f-433a-b87a-44d613dd9c48";
const creditAmount = 100; // 100 euros

console.log(`Setting ${creditAmount}€ credit for user ${testUserId}...`);
setUserCredit(testUserId, creditAmount)
  .then(success => {
    if (success) {
      console.log('Credit set successfully!');
    } else {
      console.error('Failed to set credit.');
    }
  });

// You can run this file directly with:
// ts-node src/scripts/addCredit.ts
