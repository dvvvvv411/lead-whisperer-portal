
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
  // Update the withdrawal status
  const { error: updateError } = await supabase
    .from('withdrawals')
    .update({ 
      status,
      notes,
      updated_at: new Date().toISOString()
    })
    .eq('id', withdrawal.id);
  
  if (updateError) throw updateError;
  
  // If approved, update user credit by subtracting the withdrawal amount
  if (isApproved) {
    const { data: currentCreditData, error: creditFetchError } = await supabase
      .from('user_credits')
      .select('amount')
      .eq('user_id', withdrawal.user_id)
      .single();
    
    if (creditFetchError) throw creditFetchError;
    
    const currentCredit = currentCreditData?.amount || 0;
    // Only subtract the amount of the withdrawal, not resetting the entire credit
    const newCredit = Math.max(0, currentCredit - withdrawal.amount);
    
    const { error: creditUpdateError } = await supabase
      .from('user_credits')
      .update({ 
        amount: newCredit,
        last_updated: new Date().toISOString()
      })
      .eq('user_id', withdrawal.user_id);
    
    if (creditUpdateError) throw creditUpdateError;
  }
  
  return { success: true };
}
