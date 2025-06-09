
import { supabase } from "@/integrations/supabase/client";

// Credit threshold for user activation (250€)
const CREDIT_ACTIVATION_THRESHOLD = 250;

// Original role check function with enhanced error handling
export const checkUserRole = async (role: "admin" | "user"): Promise<boolean> => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("roleService: Error getting current user:", userError);
      throw userError;
    }
    
    if (!userData?.user) {
      console.log("roleService: No user found in checkUserRole");
      return false;
    }
    
    const userId = userData.user.id;
    
    // Enhanced hardcoded admin check for both special users
    if (role === 'admin' && (
        userId === "7eccf781-5911-4d90-a683-1df251069a2f" || 
        userId === "054c7ee0-7f82-4e34-a0c0-45552f6a67f8")) {
      console.log(`roleService: Hardcoded admin access granted to user with ID: ${userId}`);
      return true;
    }
    
    // Special handling for 'user' role - check credit instead
    if (role === 'user') {
      return await checkUserCredit();
    }
    
    // Standard role check for other roles (like 'admin') with enhanced error handling
    console.log(`roleService: Checking role '${role}' for user: ${userId}`);
    
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: role
    });
    
    if (error) {
      console.error("roleService: Error checking user role via RPC:", error);
      console.error("roleService: Error details:", {
        message: error.message,
        code: error.code,
        hint: error.hint
      });
      
      // For admin role checks, fallback to false on error
      if (role === 'admin') {
        console.log("roleService: Denying admin access due to RPC error");
        return false;
      }
      
      throw error;
    }
    
    console.log(`roleService: Role check result for user ${userId}: ${data}`);
    return data || false;
  } catch (error) {
    console.error("roleService: Unexpected error in checkUserRole:", error);
    return false;
  }
};

// Enhanced function to check if user has enough credit to be considered "activated"
export const checkUserCredit = async (): Promise<boolean> => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("roleService: Error getting current user for credit check:", userError);
      throw userError;
    }
    
    if (!userData?.user) {
      console.log("roleService: No user found in checkUserCredit");
      return false;
    }
    
    const userId = userData.user.id;
    
    // Enhanced hardcoded admin check for both special users
    if (userId === "7eccf781-5911-4d90-a683-1df251069a2f" || 
        userId === "054c7ee0-7f82-4e34-a0c0-45552f6a67f8") {
      console.log(`roleService: Credit check bypassed for hardcoded admin user with ID: ${userId}`);
      return true;
    }
    
    // Get user credit
    const { data: creditData, error: creditError } = await supabase
      .from('user_credits')
      .select('amount')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (creditError) {
      if (creditError.code === 'PGRST116') {
        // No credit record found - definitely below threshold
        console.log("roleService: No credit record found for user");
        return false;
      }
      console.error("roleService: Error checking user credit:", creditError);
      throw creditError;
    }
    
    // Credit amount is stored in cents, convert to euros for comparison
    const creditInEuros = (creditData?.amount || 0) / 100;
    console.log(`roleService: User credit: ${creditInEuros}€, threshold: ${CREDIT_ACTIVATION_THRESHOLD}€`);
    
    // Return true if user has enough credit
    return creditInEuros >= CREDIT_ACTIVATION_THRESHOLD;
  } catch (error) {
    console.error("roleService: Error checking user credit:", error);
    return false;
  }
};

// Debug function to test role checking functionality
export const debugRoleCheck = async (userId: string, role: "admin" | "user") => {
  try {
    console.log(`roleService: DEBUG - Checking role '${role}' for user: ${userId}`);
    
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: role
    });
    
    console.log("roleService: DEBUG - RPC Response:", { data, error });
    
    return { data, error };
  } catch (error) {
    console.error("roleService: DEBUG - Unexpected error:", error);
    return { data: null, error };
  }
};
