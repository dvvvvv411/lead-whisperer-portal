
import { supabase } from "@/integrations/supabase/client";

// Credit threshold for user activation (250€)
const CREDIT_ACTIVATION_THRESHOLD = 250;

// Original role check function - still used for admin role checks
export const checkUserRole = async (role: "admin" | "user"): Promise<boolean> => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Error getting current user:", userError);
      throw userError;
    }
    
    if (!userData?.user) {
      console.log("No user found in checkUserRole");
      return false;
    }
    
    // Special handling for specific admin users by ID
    if (role === 'admin' && (
        userData.user.id === "7eccf781-5911-4d90-a683-1df251069a2f" || 
        userData.user.id === "054c7ee0-7f82-4e34-a0c0-45552f6a67f8")) {
      console.log(`Admin access granted to user with ID: ${userData.user.id}`);
      return true;
    }
    
    // Special handling for 'user' role - check credit instead
    if (role === 'user') {
      return await checkUserCredit();
    }
    
    // Standard role check for other roles (like 'admin')
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: userData.user.id,
      _role: role
    });
    
    if (error) {
      console.error("Error checking user role:", error);
      throw error;
    }
    
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
    if (userError) {
      console.error("Error getting current user for credit check:", userError);
      throw userError;
    }
    
    if (!userData?.user) {
      console.log("No user found in checkUserCredit");
      return false;
    }
    
    // Special handling for specific admin users by ID
    if (userData.user.id === "7eccf781-5911-4d90-a683-1df251069a2f" || 
        userData.user.id === "054c7ee0-7f82-4e34-a0c0-45552f6a67f8") {
      console.log(`Credit check bypassed for admin user with ID: ${userData.user.id}`);
      return true;
    }
    
    // Get user credit
    const { data: creditData, error: creditError } = await supabase
      .from('user_credits')
      .select('amount')
      .eq('user_id', userData.user.id)
      .maybeSingle();
    
    if (creditError) {
      if (creditError.code === 'PGRST116') {
        // No credit record found - definitely below threshold
        console.log("No credit record found for user");
        return false;
      }
      console.error("Error checking user credit:", creditError);
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
