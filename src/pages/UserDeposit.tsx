
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
import LevelProgressChart from "@/components/user/deposit/LevelProgressChart";
import { Card } from "@/components/ui/card";

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
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zum Dashboard
          </Button>
          
          <h1 className="text-2xl md:text-3xl font-bold bg-gold-gradient bg-clip-text text-transparent animate-gradient-shift">
            Guthaben einzahlen
          </h1>
          {userCredit !== null && (
            <p className="text-lg text-accent1-light mt-2">
              Aktuelles Guthaben: {userCredit.toFixed(2)}€
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left section - Level chart */}
          <Card className="casino-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent1/10 rounded-full blur-xl"></div>
            <h2 className="text-xl font-semibold mb-4">Level & Handelsvorteile</h2>
            <LevelProgressChart currentBalance={userCredit || 0} />
          </Card>
          
          {/* Right section - Deposit form */}
          <div>
            {paymentSubmitted ? (
              <PaymentStatusView paymentId={paymentId} />
            ) : (
              <Card className="casino-card overflow-hidden">
                <DepositForm 
                  wallets={wallets}
                  walletsLoading={walletsLoading}
                  walletError={walletError}
                  onRetryWallets={fetchWallets}
                  onSubmit={handleDepositSubmit}
                />
              </Card>
            )}
          </div>
        </div>
        
        {/* Transaction history section */}
        <Card className="casino-card mt-6 p-6">
          <DepositHistory userId={user?.id} />
        </Card>
      </div>
    </UserAuthCheck>
  );
};

export default UserDeposit;
