
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UserAuthCheck from "@/components/user/activation/UserAuthCheck";
import WithdrawalForm from "@/components/user/withdrawal/WithdrawalForm";
import WithdrawalHistory from "@/components/user/withdrawal/WithdrawalHistory";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useWallets } from "@/hooks/useWallets";
import { useUserCredit } from "@/hooks/useUserCredit";

const UserWithdrawal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  
  // Fetch crypto wallets for payment
  const { wallets, walletsLoading, walletError, fetchWallets } = useWallets();
  
  // Get user credit
  const { userCredit, fetchUserCredit } = useUserCredit(user?.id);
  
  // Handle user loaded callback from auth check
  const handleUserLoaded = (userData: any) => {
    setUser(userData);
  };
  
  // Handle back navigation
  const handleBack = () => {
    navigate('/nutzer');
  };
  
  // Handle withdrawal submission
  const handleWithdrawalSubmit = async (amount: number, walletCurrency: string, walletAddress: string) => {
    if (!user) return;
    
    try {
      // Convert amount to cents for consistency with payment system
      const amountInCents = Math.round(amount * 100);
      
      // Create a new withdrawal record in the database
      const { error } = await supabase
        .from('withdrawals')
        .insert({
          user_id: user.id,
          user_email: user.email,
          amount: amountInCents,
          currency: 'EUR',
          wallet_currency: walletCurrency,
          wallet_address: walletAddress,
          status: 'pending'
        });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Auszahlung beantragt",
        description: "Ihr Auszahlungsantrag wurde erfolgreich eingereicht und wird überprüft."
      });
      
      // Refresh user credit to show updated balance
      fetchUserCredit();
    } catch (error: any) {
      console.error("Fehler bei der Auszahlung:", error.message);
      toast({
        title: "Fehler bei der Auszahlung",
        description: "Bei der Auszahlung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
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
          
          <h1 className="text-3xl font-bold">Guthaben auszahlen</h1>
          {userCredit !== null && (
            <p className="text-lg text-gray-600 mt-2">
              Aktuelles Guthaben: {userCredit.toFixed(2)}€
            </p>
          )}
        </div>
        
        <WithdrawalForm 
          wallets={wallets}
          walletsLoading={walletsLoading}
          walletError={walletError}
          onRetryWallets={fetchWallets}
          userCredit={userCredit || 0}
          onSubmit={handleWithdrawalSubmit}
        />
        
        <WithdrawalHistory userId={user?.id} />
      </div>
    </UserAuthCheck>
  );
};

export default UserWithdrawal;
