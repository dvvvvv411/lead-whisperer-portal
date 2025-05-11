
import { supabase } from "@/integrations/supabase/client";

interface Withdrawal {
  id: string;
  user_id: string;
  user_email: string;
  amount: number;
  currency: string;
  wallet_currency: string;
  wallet_address: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface ProcessWithdrawalParams {
  withdrawal: Withdrawal;
  status: "completed" | "rejected";
  notes: string | null;
  isApproved: boolean;
}

export async function processWithdrawal({ 
  withdrawal, 
  status, 
  notes, 
  isApproved 
}: ProcessWithdrawalParams) {
  // Add extensive logging to understand what's happening
  console.log(`Beginning withdrawal process for ID ${withdrawal.id}`, {
    currentStatus: withdrawal.status,
    newStatus: status,
    isApproved,
    notes
  });
  
  try {
    // First try direct update with explicit status value to ensure it's passed correctly
    const { data: updateData, error: updateError } = await supabase
      .from('withdrawals')
      .update({ 
        status: status, 
        notes: notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', withdrawal.id)
      .select();
    
    console.log("Withdrawal update response:", { updateData, updateError });
    
    if (updateError) {
      console.error("Error updating withdrawal status:", updateError);
      throw updateError;
    }
    
    // Fetch the withdrawal to verify the update was successful
    const { data: verifyData, error: verifyError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', withdrawal.id)
      .single();
      
    console.log("Verification after update:", { 
      verifyData, 
      verifyError,
      statusMatches: verifyData?.status === status 
    });
    
    if (verifyError) {
      console.error("Error verifying withdrawal update:", verifyError);
      throw verifyError;
    }
    
    // If approved, update user credit by subtracting the withdrawal amount
    if (isApproved) {
      const { data: currentCreditData, error: creditFetchError } = await supabase
        .from('user_credits')
        .select('amount')
        .eq('user_id', withdrawal.user_id)
        .single();
      
      console.log("Current user credit:", { currentCreditData, creditFetchError });
      
      if (creditFetchError) {
        console.error("Error fetching user credit:", creditFetchError);
        throw creditFetchError;
      }
      
      const currentCredit = currentCreditData?.amount || 0;
      // Only subtract the amount of the withdrawal, not resetting the entire credit
      const newCredit = Math.max(0, currentCredit - withdrawal.amount);
      
      console.log("Credit update calculation:", { 
        userId: withdrawal.user_id,
        currentCredit, 
        withdrawalAmount: withdrawal.amount, 
        newCredit 
      });
      
      const { data: creditUpdateData, error: creditUpdateError } = await supabase
        .from('user_credits')
        .update({ 
          amount: newCredit,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', withdrawal.user_id);
      
      console.log("Credit update result:", { creditUpdateData, creditUpdateError });
      
      if (creditUpdateError) {
        console.error("Error updating user credit:", creditUpdateError);
        throw creditUpdateError;
      }
    }
    
    return { 
      success: true, 
      statusUpdated: status,
      data: updateData
    };
  } catch (error) {
    console.error("Fatal error in processWithdrawal:", error);
    throw error;
  }
}
