
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
    // Ensure we're using the correct timestamp format
    const currentTimestamp = new Date().toISOString();
    
    console.log(`Updating withdrawal ${withdrawal.id} to status: ${status}`);
    
    // Update the withdrawal status - don't use .single() here as it's causing the error
    const { data: updateData, error: updateError } = await supabase
      .from('withdrawals')
      .update({ 
        status: status, 
        notes: notes,
        updated_at: currentTimestamp
      })
      .eq('id', withdrawal.id);
    
    console.log("Withdrawal update response:", { updateData, updateError });
    
    if (updateError) {
      console.error("Error updating withdrawal status:", updateError);
      throw updateError;
    }
    
    // Verify the update was successful - don't use .single() here
    const { data: verifyData, error: verifyError } = await supabase
      .from('withdrawals')
      .select('status, updated_at')
      .eq('id', withdrawal.id);
      
    console.log("Verification after update:", { 
      verifyData, 
      verifyError,
      statusMatches: verifyData && verifyData[0]?.status === status 
    });
    
    if (verifyError) {
      console.error("Error verifying withdrawal update:", verifyError);
      throw verifyError;
    }
    
    if (!verifyData || verifyData.length === 0 || verifyData[0]?.status !== status) {
      console.error("Status was not updated correctly:", {
        expectedStatus: status,
        actualStatus: verifyData && verifyData[0]?.status
      });
    }
    
    // If approved, update user credit by subtracting the withdrawal amount
    if (isApproved) {
      const { data: currentCreditData, error: creditFetchError } = await supabase
        .from('user_credits')
        .select('amount')
        .eq('user_id', withdrawal.user_id)
        .maybeSingle();  // Use maybeSingle instead of single to avoid errors
      
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
          last_updated: currentTimestamp
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
