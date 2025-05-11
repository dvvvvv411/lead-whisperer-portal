
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

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

// Define the type for our database function response
interface ProcessWithdrawalResponse {
  success: boolean;
  withdrawal_id?: string;
  status?: string;
  updated_at?: string;
  message?: string;
  error?: string;
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
    
    // Fix: Using the correct type parameters for rpc
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
    
    // Fix: Proper type checking and safe access
    const responseData = data as unknown as ProcessWithdrawalResponse;
    if (!responseData || responseData.success === false) {
      console.error("Failed to process withdrawal:", responseData || "Unknown error");
      throw new Error(responseData?.message || "Failed to process withdrawal");
    }
    
    return { 
      success: true, 
      statusUpdated: status,
      data: responseData
    };
  } catch (error) {
    console.error("Fatal error in processWithdrawal:", error);
    throw error;
  }
}
