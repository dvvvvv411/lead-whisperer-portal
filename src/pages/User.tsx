
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
  const [redirectChecked, setRedirectChecked] = useState(false);

  // Use the credit hook with a key that forces refresh when coming back to this page
  const { userCredit, loading: creditLoading, fetchUserCredit } = useUserCredit(user?.id);

  // Force refresh of credit when component mounts or when user changes
  useEffect(() => {
    if (user?.id) {
      console.log("Forcing credit refresh for user:", user.id);
      fetchUserCredit();
    }
  }, [user?.id, fetchUserCredit]);

  // Check authentication once
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        console.log("Fetching current user on /nutzer page");
        const { data } = await supabase.auth.getUser();
        
        if (data?.user) {
          console.log("User found on /nutzer page:", data.user.id);
          setUser(data.user);
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

  // Check credit threshold only once after user and credit are loaded
  useEffect(() => {
    if (!user?.id || creditLoading || redirectChecked) return;
    
    console.log("Checking user credit for activation:", userCredit);
    
    // If user has less than the threshold, redirect to activation page
    if (userCredit !== null && userCredit < CREDIT_ACTIVATION_THRESHOLD) {
      console.log(`User credit (${userCredit}€) is below threshold (${CREDIT_ACTIVATION_THRESHOLD}€), redirecting to activation page`);
      navigate("/nutzer/aktivierung");
    } else {
      console.log(`User credit (${userCredit}€) is adequate, staying on dashboard page`);
    }
    
    // Mark this check as done
    setRedirectChecked(true);
  }, [userCredit, creditLoading, user?.id, navigate, redirectChecked]);

  // Early return to prevent any content rendering before verification is complete
  if (loading || creditLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Wird geladen...</p>
      </div>
    );
  }

  const handleCreditUpdated = () => {
    console.log("Refreshing user credit...");
    fetchUserCredit();
  };

  console.log("Current user credit:", userCredit);

  // Only render the dashboard if authentication is checked
  return authChecked ? (
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
