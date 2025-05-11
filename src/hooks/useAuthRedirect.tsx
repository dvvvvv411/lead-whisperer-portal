
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Credit threshold required to access the dashboard (in EUR)
const CREDIT_ACTIVATION_THRESHOLD = 250;

interface UseAuthRedirectProps {
  userId?: string;
  userCredit: number | null;
  creditLoading: boolean;
  redirectToActivation: boolean;
}

export const useAuthRedirect = ({
  userId,
  userCredit,
  creditLoading,
  redirectToActivation
}: UseAuthRedirectProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [redirectChecked, setRedirectChecked] = useState(false);
  
  // Check redirect only once after user and credit are loaded
  useEffect(() => {
    if (!userId || creditLoading || redirectChecked) return;

    // Check if we need to redirect based on credit status
    if (redirectToActivation && userCredit < CREDIT_ACTIVATION_THRESHOLD && !window.location.pathname.includes('/aktivierung')) {
      console.log("User doesn't have sufficient credit, redirecting to activation page");
      navigate('/nutzer/aktivierung');
    } else if (userCredit >= CREDIT_ACTIVATION_THRESHOLD && window.location.pathname.includes('/aktivierung')) {
      console.log("User has sufficient credit, redirecting to dashboard from activation page");
      toast({
        title: "Konto aktiviert",
        description: "Ihr Konto wurde aktiviert! Sie werden zum Dashboard weitergeleitet."
      });
      navigate('/nutzer');
    }
    
    // Mark this check as done
    setRedirectChecked(true);
  }, [userId, navigate, toast, redirectToActivation, userCredit, creditLoading, redirectChecked]);

  return { redirectChecked };
};
