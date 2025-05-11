
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import UserAuthWrapper from "@/components/user/auth/UserAuthWrapper";

interface UserAuthCheckProps {
  children: React.ReactNode;
  onUserLoaded: (user: any) => void;
  redirectToActivation?: boolean;
}

const UserAuthCheck = ({ 
  children, 
  onUserLoaded, 
  redirectToActivation = true 
}: UserAuthCheckProps) => {
  // Set up credit change subscription
  useEffect(() => {
    if (!onUserLoaded) return;
    
    console.log("Setting up credit subscription in UserAuthCheck");
    
    // Subscribe to user_credits changes to detect when user gets sufficient credit
    const creditSubscription = supabase
      .channel('user-credits-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_credits'
      }, async () => {
        console.log("User credit change detected");
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(creditSubscription);
    };
  }, [onUserLoaded]);
  
  return (
    <UserAuthWrapper 
      onUserLoaded={onUserLoaded}
      redirectToActivation={redirectToActivation}
    >
      {children}
    </UserAuthWrapper>
  );
};

export default UserAuthCheck;
