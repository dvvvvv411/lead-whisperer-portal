
import { supabase } from "@/integrations/supabase/client";

// Credit threshold for user activation (250€)
const CREDIT_ACTIVATION_THRESHOLD = 250;

// Original role check function - still used for admin role checks
export const checkUserRole = async (role: string): Promise<boolean> => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!userData?.user) return false;
    
    // Special handling for 'user' role - check credit instead
    if (role === 'user') {
      return await checkUserCredit();
    }
    
    // Standard role check for other roles (like 'admin')
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: userData.user.id,
      _role: role
    });
    
    if (error) throw error;
    
    return data || false;
  } catch (error) {
    console.error("Error checking user role:", error);
    return false;
  }
};

// New function to check if user has enough credit to be considered "activated"
export const checkUserCredit = async (): Promise<boolean> => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!userData?.user) return false;
    
    // Get user credit
    const { data: creditData, error: creditError } = await supabase
      .from('user_credits')
      .select('amount')
      .eq('user_id', userData.user.id)
      .single();
    
    if (creditError) {
      if (creditError.code === 'PGRST116') {
        // No credit record found - definitely below threshold
        console.log("No credit record found for user");
        return false;
      }
      throw creditError;
    }
    
    // Credit amount is stored in cents, convert to euros for comparison
    const creditInEuros = (creditData?.amount || 0) / 100;
    console.log(`User credit: ${creditInEuros}€, threshold: ${CREDIT_ACTIVATION_THRESHOLD}€`);
    
    // Return true if user has enough credit
    return creditInEuros >= CREDIT_ACTIVATION_THRESHOLD;
  } catch (error) {
    console.error("Error checking user credit:", error);
    return false;
  }
};
