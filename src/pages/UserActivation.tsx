
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePaymentFlow } from "@/hooks/usePaymentFlow";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserCredit } from "@/hooks/useUserCredit";
import { motion } from "framer-motion";

// Components
import PaymentStatusView from "@/components/user/activation/PaymentStatusView";
import ActivationForm from "@/components/user/activation/ActivationForm";
import UserAuthCheck from "@/components/user/activation/UserAuthCheck";
import LogoutButton from "@/components/user/navbar/LogoutButton";
import ActivationHero from "@/components/user/activation/ActivationHero";
import ActivationProgress from "@/components/user/activation/ActivationProgress";

// Credit threshold required to access the dashboard (in EUR)
const CREDIT_ACTIVATION_THRESHOLD = 250;

const UserActivation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [isCheckingCredit, setIsCheckingCredit] = useState(false);
  const [redirectedToUser, setRedirectedToUser] = useState(false);
  const [activationStep, setActivationStep] = useState(0);
  
  // Use the user credit hook to check if the user has enough credit
  const { userCredit, loading: creditLoading, fetchUserCredit } = useUserCredit(user?.id);
  
  // Use the payment flow hook with isActivation flag
  const { paymentCompleted } = usePaymentFlow({
    userId: user?.id,
    paymentId,
    paymentSubmitted,
    isActivation: true
  });

  // Only check once if user already has enough credit when component mounts
  useEffect(() => {
    const checkCreditOnLoad = async () => {
      try {
        if (redirectedToUser) return;
        
        setIsCheckingCredit(true);
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user) {
          // If we have user data and credit is loaded, check it
          if (user?.id && !creditLoading && userCredit !== null) {
            console.log("Initial credit check on activation page:", userCredit);
            
            if (userCredit >= CREDIT_ACTIVATION_THRESHOLD) {
              console.log(`User already has sufficient credit (${userCredit}€), redirecting from activation page`);
              toast({
                title: "Konto bereits aktiviert",
                description: "Ihr Konto ist bereits aktiviert. Sie werden zum Dashboard weitergeleitet."
              });
              
              setRedirectedToUser(true);
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
  }, [navigate, toast, user?.id, userCredit, creditLoading, redirectedToUser]);

  const handleUserLoaded = (userData: any) => {
    setUser(userData);
    
    // Check if user already has a pending payment
    if (userData.paymentStatus?.pending) {
      setPaymentSubmitted(true);
      setPaymentId(userData.paymentStatus.paymentId);
      setActivationStep(2); // Aktivierung step
    }
  };

  // Handler for step changes
  const handleStepChange = (step: number) => {
    setActivationStep(step);
  };

  // Watch for payment submission from the activation form
  const checkPaymentSubmission = () => {
    const paymentElement = document.getElementById('payment-submitted') as HTMLInputElement;
    if (paymentElement && paymentElement.value) {
      setPaymentSubmitted(true);
      setPaymentId(paymentElement.value);
      setActivationStep(2); // Move to Aktivierung step
    }
  };

  // Call checkPaymentSubmission every 500ms
  setTimeout(checkPaymentSubmission, 500);

  if (isCheckingCredit || creditLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-casino-dark dark">
        <p className="text-white/70">Aktivierungsstatus wird überprüft...</p>
      </div>
    );
  }

  return (
    <UserAuthCheck onUserLoaded={handleUserLoaded} redirectToActivation={false}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-casino-dark dark"
      >
        <div className="container mx-auto p-4 max-w-7xl">
          <div className="flex justify-end mb-8 pt-4">
            <LogoutButton />
          </div>
          
          <motion.div 
            className="text-center mb-10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.7, 
              type: "spring",
              bounce: 0.4
            }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gold-gradient bg-clip-text py-2 px-4 inline-block relative">
              Konto Aktivierung
              <motion.div 
                className="absolute -z-10 inset-0 bg-gold/10 rounded-lg blur-xl"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.7, 0.5] 
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </h1>
            
            {userCredit !== null && userCredit > 0 && (
              <p className="mt-2 font-medium text-white">
                Aktuelles Guthaben: {userCredit.toFixed(2)}€ 
                {userCredit < CREDIT_ACTIVATION_THRESHOLD && (
                  <span className="text-amber-500"> (Sie benötigen noch {(CREDIT_ACTIVATION_THRESHOLD - userCredit).toFixed(2)}€)</span>
                )}
              </p>
            )}
          </motion.div>

          {!paymentSubmitted ? (
            <>
              <ActivationProgress currentStep={activationStep} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                {/* Linke Spalte mit Illustration und Animation */}
                <div className="w-full">
                  <ActivationHero />
                </div>
                
                {/* Rechte Spalte mit Aktivierungsformular */}
                <div className="w-full">
                  <ActivationForm 
                    user={user} 
                    creditThreshold={CREDIT_ACTIVATION_THRESHOLD}
                    onStepChange={handleStepChange} 
                  />
                </div>
              </div>
            </>
          ) : (
            <PaymentStatusView paymentId={paymentId} creditThreshold={CREDIT_ACTIVATION_THRESHOLD} />
          )}
        </div>
      </motion.div>
    </UserAuthCheck>
  );
};

export default UserActivation;
