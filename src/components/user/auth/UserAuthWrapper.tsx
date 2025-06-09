
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useUserCredit } from "@/hooks/useUserCredit";

interface UserAuthWrapperProps {
  children: (user: any) => React.ReactNode;
  redirectTo: string;
  minCredit?: number; // Optional minimum credit requirement
}

const UserAuthWrapper = ({ children, redirectTo, minCredit = 0 }: UserAuthWrapperProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { userCredit, loading: creditLoading } = useUserCredit(user?.id);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change in UserAuthWrapper:", event);
      if (event === "SIGNED_OUT") {
        // Use replace: true to avoid history accumulation
        navigate(redirectTo, { replace: true });
      } else if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
      }
    });
    
    // THEN check for existing session
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Error getting user in UserAuthWrapper:", error.message);
          throw error;
        }
        
        if (data?.user) {
          console.log("User found in UserAuthWrapper:", data.user.email);
          setUser(data.user);
        } else {
          console.log("No user found in UserAuthWrapper, redirecting");
          // If not authenticated, redirect to the specified route using replace to avoid history issues
          navigate(redirectTo, { replace: true });
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigate(redirectTo, { replace: true });
      } finally {
        setLoading(false);
      }
    };
    
    getUser();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, redirectTo]);

  // Check for minimum credit requirement
  useEffect(() => {
    if (!loading && !creditLoading && minCredit > 0) {
      if (userCredit !== null && userCredit < minCredit) {
        console.log("User credit below minimum, redirecting to activation");
        navigate("/nutzer/aktivierung", { replace: true });
      }
    }
  }, [userCredit, loading, creditLoading, minCredit, navigate]);

  if (loading || (minCredit > 0 && creditLoading)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Wird geladen...</p>
      </div>
    );
  }

  return <>{user && children(user)}</>;
};

export default UserAuthWrapper;
