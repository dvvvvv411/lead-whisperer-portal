
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import UserDashboard from "@/components/user/UserDashboard";
import CryptoTradingSection from "@/components/user/trading/CryptoTradingSection";
import { useUserCredit } from "@/hooks/useUserCredit";

// Credit threshold required to access the dashboard (in EUR)
const CREDIT_ACTIVATION_THRESHOLD = 250;

const User = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
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
          
          // Once user is set, userCredit will automatically load via the hook
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

  // Check if user has enough credit after credit is loaded
  useEffect(() => {
    if (!user?.id || creditLoading) return;
    
    console.log("Checking user credit for activation:", userCredit);
    
    // If user has less than the threshold, redirect to activation page
    if (userCredit < CREDIT_ACTIVATION_THRESHOLD) {
      console.log(`User credit (${userCredit}€) is below threshold (${CREDIT_ACTIVATION_THRESHOLD}€), redirecting to activation page`);
      navigate("/nutzer/aktivierung");
      return;
    }
    
    console.log(`User credit (${userCredit}€) is above threshold (${CREDIT_ACTIVATION_THRESHOLD}€), access granted`);
  }, [userCredit, creditLoading, user?.id, navigate]);

  // Periodically check credit status to ensure user is still allowed to access the page
  useEffect(() => {
    if (!user?.id) return;
    
    const creditCheckInterval = setInterval(async () => {
      try {
        // Re-fetch credit to ensure it's current
        await fetchUserCredit();
        
        // If credit falls below threshold, redirect to activation page
        if (userCredit < CREDIT_ACTIVATION_THRESHOLD) {
          console.log("User credit has fallen below threshold, redirecting to activation page");
          navigate("/nutzer/aktivierung");
        }
      } catch (error) {
        console.error("Error checking credit status:", error);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(creditCheckInterval);
  }, [user?.id, userCredit, navigate, fetchUserCredit]);

  // Early return to prevent any content rendering before verification is complete
  if (loading || creditLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Wird geladen...</p>
      </div>
    );
  }

  // Second security check - if auth is checked and user doesn't have enough credit, redirect
  if (authChecked && userCredit < CREDIT_ACTIVATION_THRESHOLD) {
    console.log("Auth checked and credit below threshold, redirecting");
    navigate("/nutzer/aktivierung");
    return null;
  }

  const handleCreditUpdated = () => {
    console.log("Refreshing user credit...");
    fetchUserCredit();
  };

  console.log("Current user credit:", userCredit);

  // Only render the dashboard if user has sufficient credit
  return userCredit >= CREDIT_ACTIVATION_THRESHOLD ? (
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
