
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import UserDashboard from "@/components/user/UserDashboard";
import CryptoTradingSection from "@/components/user/trading/CryptoTradingSection";
import { useUserCredit } from "@/hooks/useUserCredit";
import { checkUserRole } from "@/services/roleService";

const User = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isActivated, setIsActivated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Use the credit hook with a key that forces refresh when coming back to this page
  const { userCredit, loading: creditLoading, fetchUserCredit } = useUserCredit(user?.id);

  // Force refresh of credit when component mounts or when user changes
  useEffect(() => {
    if (user?.id) {
      console.log("Forcing credit refresh for user:", user.id);
      fetchUserCredit();
    }
  }, [user?.id, fetchUserCredit]);

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        console.log("Fetching current user on /nutzer page");
        const { data } = await supabase.auth.getUser();
        
        if (data?.user) {
          console.log("User found on /nutzer page:", data.user.id);
          setUser(data.user);
          
          // Check if the user has the 'user' role (is activated)
          const activated = await checkUserRole('user');
          console.log("User activation status on /nutzer page:", activated);
          setIsActivated(activated);
          
          // If not activated, immediately redirect to activation page
          if (!activated) {
            console.log("User not activated, redirecting from /nutzer to activation page");
            navigate("/nutzer/aktivierung");
            return;
          }
        } else {
          // If no user is logged in, redirect to login page
          console.log("No user found, redirecting to login");
          navigate("/admin");
          return;
        }
      } catch (error) {
        console.error("Error checking user on /nutzer page:", error);
        navigate("/admin");
        return;
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };
    
    getUser();
  }, [navigate]);

  // Periodically check activation status to ensure user is still allowed to access the page
  useEffect(() => {
    if (!user?.id) return;
    
    const activationCheckInterval = setInterval(async () => {
      try {
        const activated = await checkUserRole('user');
        if (!activated && isActivated) {
          console.log("User no longer activated, redirecting to activation page");
          navigate("/nutzer/aktivierung");
        }
      } catch (error) {
        console.error("Error checking activation status:", error);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(activationCheckInterval);
  }, [user?.id, isActivated, navigate]);

  // Early return to prevent any content rendering before verification is complete
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Wird geladen...</p>
      </div>
    );
  }

  // Second security check - if auth is checked and user is not activated, redirect
  if (authChecked && !isActivated) {
    console.log("Auth checked and user not activated, redirecting");
    navigate("/nutzer/aktivierung");
    return null;
  }

  const handleCreditUpdated = () => {
    console.log("Refreshing user credit...");
    fetchUserCredit();
  };

  console.log("Current user credit:", userCredit);

  // Only render the dashboard if user is activated
  return isActivated ? (
    <>
      <UserDashboard 
        user={user} 
        userCredit={userCredit} 
        onCreditUpdated={handleCreditUpdated} 
      />
      
      <div className="container mx-auto p-4 mt-8">
        <div className="mb-8">
          <Link 
            to="/nutzer/einzahlen" 
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
          >
            Guthaben einzahlen
          </Link>
        </div>
        
        <CryptoTradingSection 
          user={user} 
          userCredit={userCredit || 0}
          onUpdated={handleCreditUpdated}
        />
      </div>
    </>
  ) : null;
};

export default User;
