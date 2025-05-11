
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
        console.log("Fetching current user");
        const { data } = await supabase.auth.getUser();
        
        if (data?.user) {
          console.log("User found:", data.user);
          setUser(data.user);
          
          // Check if the user has the 'user' role (is activated)
          const activated = await checkUserRole('user');
          console.log("User activated:", activated);
          setIsActivated(activated);
          
          // If not activated, redirect to activation page
          if (!activated) {
            console.log("User not activated, redirecting to activation page");
            navigate("/nutzer/aktivierung");
            return;
          }
        } else {
          // If no user is logged in, redirect to login page
          console.log("No user found, redirecting to login");
          navigate("/admin");
        }
      } catch (error) {
        console.error("Error checking user:", error);
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };
    
    getUser();
  }, [navigate]);

  if (loading) {
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

  return (
    <>
      <UserDashboard 
        user={user} 
        userCredit={userCredit} 
        onCreditUpdated={handleCreditUpdated} 
      />
      
      <div className="container mx-auto p-4 mt-8">
        {isActivated && (
          <div className="mb-8">
            <Link 
              to="/nutzer/einzahlen" 
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
            >
              Guthaben einzahlen
            </Link>
          </div>
        )}
        
        <CryptoTradingSection 
          user={user} 
          userCredit={userCredit || 0}
          onUpdated={handleCreditUpdated}
        />
      </div>
    </>
  );
};

export default User;
