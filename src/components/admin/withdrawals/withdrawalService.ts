
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
    console.log(`Calling secure database function to process withdrawal ${withdrawal.id}`);
    
    // Use the new secure database function instead of directly updating the table
    const { data, error } = await supabase.rpc(
      'process_withdrawal_status',
      {
        withdrawal_id: withdrawal.id,
        new_status: status,
        withdrawal_notes: notes || null,
        is_approved: isApproved
      }
    );
    
    console.log("Process withdrawal response:", { data, error });
    
    if (error) {
      console.error("Error processing withdrawal:", error);
      throw error;
    }
    
    if (!data || !data.success) {
      console.error("Failed to process withdrawal:", data || "Unknown error");
      throw new Error(data?.message || "Failed to process withdrawal");
    }
    
    return { 
      success: true, 
      statusUpdated: status,
      data: data
    };
  } catch (error) {
    console.error("Fatal error in processWithdrawal:", error);
    throw error;
  }
}
