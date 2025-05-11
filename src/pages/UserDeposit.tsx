
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UserAuthCheck from "@/components/user/activation/UserAuthCheck";
import DepositForm from "@/components/user/deposit/DepositForm";
import DepositHistory from "@/components/user/deposit/DepositHistory";
import PaymentStatusView from "@/components/user/activation/PaymentStatusView";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { usePaymentFlow } from "@/hooks/usePaymentFlow";
import { useWallets } from "@/hooks/useWallets";
import { useUserCredit } from "@/hooks/useUserCredit";

const UserDeposit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  
  // Fetch crypto wallets for payment
  const { wallets, walletsLoading, walletError, fetchWallets } = useWallets();
  
  // Get user credit
  const { userCredit } = useUserCredit(user?.id);
  
  // Monitor payment status using the custom hook
  const { paymentCompleted, paymentRejected } = usePaymentFlow({
    userId: user?.id,
    paymentId,
    paymentSubmitted,
    redirectPath: '/nutzer',
    redirectDelay: 2000
  });

  // Handle user loaded callback from auth check
  const handleUserLoaded = (userData: any) => {
    setUser(userData);
  };
  
  // Handle back navigation
  const handleBack = () => {
    navigate('/nutzer');
  };
  
  // Handle deposit submission
  const handleDepositSubmit = async (amount: number, walletCurrency: string, walletId: string) => {
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
          wallet_id: walletId,
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

  return (
    <UserAuthCheck
      onUserLoaded={handleUserLoaded}
      redirectToActivation={false}
    >
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
    </UserAuthCheck>
  );
};

export default UserDeposit;
