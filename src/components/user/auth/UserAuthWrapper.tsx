
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
    // Check if the user is authenticated
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        
        if (data?.user) {
          setUser(data.user);
        } else {
          // If not authenticated, redirect to the specified route
          navigate(redirectTo);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigate(redirectTo);
      } finally {
        setLoading(false);
      }
    };
    
    getUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate(redirectTo);
      } else if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate, redirectTo]);

  // Check for minimum credit requirement
  useEffect(() => {
    if (!loading && !creditLoading && minCredit > 0) {
      if (userCredit !== null && userCredit < minCredit) {
        navigate("/nutzer/aktivierung");
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
