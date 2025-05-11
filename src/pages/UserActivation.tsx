
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePaymentFlow } from "@/hooks/usePaymentFlow";
import { checkUserRole } from "@/services/roleService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Components
import PaymentStatusView from "@/components/user/activation/PaymentStatusView";
import ActivationForm from "@/components/user/activation/ActivationForm";
import UserAuthCheck from "@/components/user/activation/UserAuthCheck";
import LogoutButton from "@/components/user/activation/LogoutButton";

const UserActivation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [isCheckingActivation, setIsCheckingActivation] = useState(false);
  
  // Use the payment flow hook with isActivation flag
  const { paymentCompleted } = usePaymentFlow({
    userId: user?.id,
    paymentId,
    paymentSubmitted,
    isActivation: true
  });

  // Immediately check if user is already activated when component mounts
  useEffect(() => {
    const checkActivationOnLoad = async () => {
      try {
        setIsCheckingActivation(true);
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user) {
          // Check if the user already has the 'user' role
          const isActivated = await checkUserRole('user');
          
          console.log("Initial activation check on activation page:", isActivated);
          
          if (isActivated) {
            console.log("User is already activated, redirecting from activation page");
            toast({
              title: "Bereits aktiviert",
              description: "Ihr Konto ist bereits aktiviert. Sie werden zum Dashboard weitergeleitet."
            });
            navigate('/nutzer');
          }
        }
      } catch (error) {
        console.error("Error checking activation status on load:", error);
      } finally {
        setIsCheckingActivation(false);
      }
    };
    
    checkActivationOnLoad();
  }, [navigate, toast]);

  // Regular check if user is already activated when the component mounts
  useEffect(() => {
    if (user?.id) {
      const checkActivationStatus = async () => {
        const isActivated = await checkUserRole('user');
        if (isActivated) {
          console.log("User is already activated, redirecting from activation page");
          navigate('/nutzer');
        }
      };
      
      checkActivationStatus();
    }
  }, [user?.id, navigate]);

  const handleUserLoaded = (userData: any) => {
    setUser(userData);
    
    // Automatically redirect if user is already activated
    if (userData.isActivated) {
      console.log("User is already activated, redirecting to dashboard");
      navigate('/nutzer');
      return;
    }
    
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

  if (isCheckingActivation) {
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
          <p className="text-gray-600">Hallo {user?.email}, aktivieren Sie Ihr Konto, um Zugriff auf alle Funktionen zu erhalten.</p>
        </div>

        {paymentSubmitted ? (
          <PaymentStatusView paymentId={paymentId} />
        ) : (
          <ActivationForm user={user} />
        )}
      </div>
    </UserAuthCheck>
  );
};

export default UserActivation;
