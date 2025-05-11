
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { checkUserRole } from "@/services/roleService";
import { useWallets } from "@/hooks/useWallets";
import { useUserCredit } from "@/hooks/useUserCredit";
import { usePaymentFlow } from "@/hooks/usePaymentFlow";
import DepositForm from "@/components/user/deposit/DepositForm";
import DepositHistory from "@/components/user/deposit/DepositHistory";
import PaymentStatusView from "@/components/user/activation/PaymentStatusView";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const UserDeposit = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isActivated, setIsActivated] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  
  // Fetch crypto wallets for payment
  const { wallets, walletsLoading, walletError, fetchWallets } = useWallets();
  
  // Monitor payment status using the custom hook
  const { paymentCompleted, paymentRejected } = usePaymentFlow({
    userId: user?.id,
    paymentId,
    paymentSubmitted,
    redirectPath: '/nutzer',
    redirectDelay: 2000
  });

  // Fetch user credit information
  const { userCredit, fetchUserCredit } = useUserCredit(user?.id);
  
  // Check the user's authentication and role
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        
        // Check if the user has the 'user' role (is activated)
        const activated = await checkUserRole('user');
        setIsActivated(activated);
        
        // If not activated, redirect to activation page
        if (!activated) {
          toast({
            title: "Aktivierung erforderlich",
            description: "Bitte aktivieren Sie Ihr Konto, um fortzufahren.",
          });
          navigate("/nutzer/aktivierung");
          return;
        }
        
        setLoading(false);
      } else {
        // If no user is logged in, redirect to login page
        navigate("/admin");
      }
    };
    
    getUser();
  }, [navigate, toast]);

  // Handle deposit submission
  const handleDepositSubmit = async (amount: number, walletCurrency: string) => {
    if (!user) return;
    
    try {
      setDepositAmount(amount);
      
      // Create a new payment record in the database
      const { data, error } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          user_email: user.email,
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'EUR',
          wallet_currency: walletCurrency,
          status: 'pending'
        })
        .select('id')
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setPaymentId(data.id);
        setPaymentSubmitted(true);
        
        toast({
          title: "Zahlung eingereicht",
          description: "Ihre Einzahlung wurde erfolgreich eingereicht und wartet auf Bestätigung."
        });
      }
    } catch (error: any) {
      console.error("Fehler bei der Einzahlung:", error.message);
      toast({
        title: "Fehler bei der Einzahlung",
        description: "Bei der Einzahlung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    }
  };

  // Back navigation handler
  const handleBack = () => {
    navigate('/nutzer');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Wird geladen...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zum Dashboard
        </Button>
        
        <h1 className="text-3xl font-bold">Guthaben einzahlen</h1>
        {userCredit !== null && (
          <p className="text-lg text-gray-600 mt-2">
            Aktuelles Guthaben: {userCredit.toFixed(2)}€
          </p>
        )}
      </div>
      
      {paymentSubmitted ? (
        <PaymentStatusView paymentId={paymentId} />
      ) : (
        <DepositForm 
          wallets={wallets}
          walletsLoading={walletsLoading}
          walletError={walletError}
          onRetryWallets={fetchWallets}
          onSubmit={handleDepositSubmit}
        />
      )}
      
      {/* Add the transaction history component */}
      <DepositHistory userId={user?.id} />
    </div>
  );
};

export default UserDeposit;
