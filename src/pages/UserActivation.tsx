
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePaymentFlow } from "@/hooks/usePaymentFlow";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserCredit } from "@/hooks/useUserCredit";

// Components
import PaymentStatusView from "@/components/user/activation/PaymentStatusView";
import ActivationForm from "@/components/user/activation/ActivationForm";
import UserAuthCheck from "@/components/user/activation/UserAuthCheck";
import LogoutButton from "@/components/user/activation/LogoutButton";

// Credit threshold required to access the dashboard (in EUR)
const CREDIT_ACTIVATION_THRESHOLD = 250;

const UserActivation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [isCheckingCredit, setIsCheckingCredit] = useState(false);
  
  // Use the user credit hook to check if the user has enough credit
  const { userCredit, loading: creditLoading, fetchUserCredit } = useUserCredit(user?.id);
  
  // Use the payment flow hook with isActivation flag
  const { paymentCompleted } = usePaymentFlow({
    userId: user?.id,
    paymentId,
    paymentSubmitted,
    isActivation: true
  });

  // Immediately check if user already has enough credit when component mounts
  useEffect(() => {
    const checkCreditOnLoad = async () => {
      try {
        setIsCheckingCredit(true);
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user) {
          // If we have user data but credit is still loading, wait for it
          if (user?.id && !creditLoading && userCredit !== null) {
            console.log("Initial credit check on activation page:", userCredit);
            
            if (userCredit >= CREDIT_ACTIVATION_THRESHOLD) {
              console.log(`User already has sufficient credit (${userCredit}€), redirecting from activation page`);
              toast({
                title: "Konto bereits aktiviert",
                description: "Ihr Konto ist bereits aktiviert. Sie werden zum Dashboard weitergeleitet."
              });
              navigate('/nutzer');
            }
          }
        }
      } catch (error) {
        console.error("Error checking credit status on load:", error);
      } finally {
        setIsCheckingCredit(false);
      }
    };
    
    checkCreditOnLoad();
  }, [navigate, toast, user?.id, userCredit, creditLoading]);

  // Regular check if user already has enough credit
  useEffect(() => {
    if (user?.id && !creditLoading && userCredit !== null) {
      if (userCredit >= CREDIT_ACTIVATION_THRESHOLD) {
        console.log(`User has sufficient credit (${userCredit}€), redirecting from activation page`);
        navigate('/nutzer');
      } else {
        console.log(`User credit (${userCredit}€) is below threshold (${CREDIT_ACTIVATION_THRESHOLD}€), staying on activation page`);
      }
    }
  }, [user?.id, navigate, userCredit, creditLoading]);

  const handleUserLoaded = (userData: any) => {
    setUser(userData);
    
    // Check if user already has a pending payment
    if (userData.paymentStatus?.pending) {
      setPaymentSubmitted(true);
      setPaymentId(userData.paymentStatus.paymentId);
    }
  };

  // Watch for payment submission from the activation form
  const checkPaymentSubmission = () => {
    const paymentElement = document.getElementById('payment-submitted') as HTMLInputElement;
    if (paymentElement && paymentElement.value) {
      setPaymentSubmitted(true);
      setPaymentId(paymentElement.value);
    }
  };

  // Call checkPaymentSubmission every 500ms
  setTimeout(checkPaymentSubmission, 500);

  if (isCheckingCredit || creditLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Aktivierungsstatus wird überprüft...</p>
      </div>
    );
  }

  return (
    <UserAuthCheck onUserLoaded={handleUserLoaded} redirectToActivation={false}>
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Konto Aktivierung</h1>
          <LogoutButton />
        </div>
        
        <div className="mb-8 text-center">
          <p className="text-gray-600">
            Hallo {user?.email}, aktivieren Sie Ihr Konto durch eine Einzahlung von mindestens {CREDIT_ACTIVATION_THRESHOLD}€, um Zugriff auf alle Funktionen zu erhalten.
          </p>
          {userCredit !== null && userCredit > 0 && (
            <p className="mt-2 font-medium">
              Aktuelles Guthaben: {userCredit.toFixed(2)}€ 
              {userCredit < CREDIT_ACTIVATION_THRESHOLD && (
                <span className="text-amber-600"> (Sie benötigen noch {(CREDIT_ACTIVATION_THRESHOLD - userCredit).toFixed(2)}€)</span>
              )}
            </p>
          )}
        </div>

        {paymentSubmitted ? (
          <PaymentStatusView paymentId={paymentId} creditThreshold={CREDIT_ACTIVATION_THRESHOLD} />
        ) : (
          <ActivationForm user={user} creditThreshold={CREDIT_ACTIVATION_THRESHOLD} />
        )}
      </div>
    </UserAuthCheck>
  );
};

export default UserActivation;
