
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import UserNavbar from "@/components/user/UserNavbar";
import ActivationSuccessMessage from "./ActivationSuccessMessage";
import DashboardContent from "./DashboardContent";

// Credit threshold required to access the dashboard (in EUR)
const CREDIT_ACTIVATION_THRESHOLD = 250;

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showActivationMessage, setShowActivationMessage] = useState<boolean>(false);
  
  // Use our authentication hook to get user data and credit
  const { 
    user, 
    loading, 
    userCredit, 
    creditLoading,
    fetchUserCredit 
  } = useUserAuth({ 
    redirectToActivation: true,
    onUserLoaded: (userData) => {
      console.log("User loaded in dashboard:", userData);
    }
  });
  
  // Use our redirect hook to handle conditional redirects
  useAuthRedirect({
    userId: user?.id,
    userCredit,
    creditLoading,
    redirectToActivation: true
  });

  // Effect to check if this is the first time user sees dashboard after activation
  useEffect(() => {
    if (user?.id && !loading && !creditLoading && userCredit !== null) {
      // Check local storage to see if this is the first time the user sees the dashboard
      // after reaching the activation threshold
      const activationAcknowledged = localStorage.getItem(`activation-acknowledged-${user?.id}`);
      if (!activationAcknowledged && userCredit >= CREDIT_ACTIVATION_THRESHOLD) {
        setShowActivationMessage(true);
      }
    }
  }, [user?.id, loading, creditLoading, userCredit]);

  const handleCreditUpdated = () => {
    console.log("Refreshing user credit...");
    fetchUserCredit();
  };

  const handleDismissActivationMessage = () => {
    if (user?.id) {
      localStorage.setItem(`activation-acknowledged-${user?.id}`, 'true');
      setShowActivationMessage(false);
    }
  };

  // Loading state
  if (loading || creditLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-casino-dark">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-gold border-casino-card animate-spin mb-4"></div>
          <p className="text-muted-foreground">Wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-casino-darker to-casino-dark dark">
      <UserNavbar userId={user?.id} userEmail={user?.email} />
      
      <main className="flex-1 container mx-auto p-4">
        {/* Activation success message */}
        {showActivationMessage && (
          <ActivationSuccessMessage onDismiss={handleDismissActivationMessage} />
        )}

        {/* Dashboard content */}
        <DashboardContent 
          userId={user?.id} 
          userEmail={user?.email} 
          userCredit={userCredit || 0} 
          onTradeExecuted={handleCreditUpdated}
        />
      </main>
    </div>
  );
};

export default UserDashboard;
