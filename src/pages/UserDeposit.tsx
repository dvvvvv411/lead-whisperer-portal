
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UserAuthCheck from "@/components/user/activation/UserAuthCheck";
import DepositForm from "@/components/user/deposit/DepositForm";
import DepositHistory from "@/components/user/deposit/DepositHistory";
import PaymentStatusViewDeposit from "@/components/user/deposit/PaymentStatusViewDeposit";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CircleDollarSign, CreditCard, Wallet, Trophy } from "lucide-react";
import { usePaymentFlow } from "@/hooks/usePaymentFlow";
import { useWallets } from "@/hooks/useWallets";
import { useUserCredit } from "@/hooks/useUserCredit";
import LevelProgressChart from "@/components/user/deposit/LevelProgressChart";
import SecurityAssurance from "@/components/user/deposit/SecurityAssurance";
import { Card } from "@/components/ui/card";
import UserNavbar from "@/components/user/UserNavbar";

const UserDeposit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  
  // Fetch crypto wallets for payment
  const { wallets, walletsLoading, walletError, fetchWallets } = useWallets();
  
  // Get user credit
  const { userCredit } = useUserCredit(user?.id);
  
  // Monitor payment status using the custom hook with noRedirect option to prevent page reload
  const { status } = usePaymentFlow({
    userId: user?.id,
    paymentId,
    paymentSubmitted,
    redirectPath: '/nutzer',
    redirectDelay: 2000,
    isActivation: false, // This is a regular deposit, not activation
    noRedirect: true // Prevent automatic redirect
  });

  // Handle user loaded callback from auth check
  const handleUserLoaded = (userData: any) => {
    setUser(userData);
  };
  
  // Handle back navigation
  const handleBack = () => {
    navigate('/nutzer');
  };
  
  // Send direct notification to Telegram with payment details
  const sendPaymentNotification = async (amount: number, walletCurrency: string) => {
    try {
      // Create payload with all the information available at submission time
      const payload = {
        type: 'payment',
        id: 'pending', // Will be updated after DB insertion
        user_email: user?.email || "Nicht angegeben",
        amount: Math.round(amount * 100), // Convert to cents for consistent format
        currency: 'EUR',
        wallet_currency: walletCurrency, // Include the selected cryptocurrency
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      console.log('Sending direct payment notification with details:', payload);
      
      // Call the simple-telegram-alert function with the enhanced payload
      const { data, error } = await supabase.functions.invoke('simple-telegram-alert', {
        body: payload
      });
      
      if (error) {
        console.error('Error sending telegram notification:', error);
        // No toast needed here since this is a background operation
        return false;
      }
      
      console.log('Direct notification response:', data);
      return true;
    } catch (err) {
      console.error('Error sending direct payment notification:', err);
      // No need to show error to user as this is a background operation
      return false;
    }
  };
  
  // Handle deposit submission
  const handleDepositSubmit = async (amount: number, walletCurrency: string, walletId: string) => {
    if (!user) return;
    
    try {
      setDepositAmount(amount);
      setIsSendingNotification(true);
      
      // Send direct notification with details from the form FIRST
      const notificationSent = await sendPaymentNotification(amount, walletCurrency);
      
      if (!notificationSent) {
        console.warn('Telegram notification could not be sent, but continuing with deposit');
      }
      
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
        setIsSendingNotification(false);
        setPaymentSubmitted(true);
        
        toast({
          title: "Zahlung eingereicht",
          description: "Ihre Einzahlung wurde erfolgreich eingereicht und wartet auf Bestätigung."
        });
      }
    } catch (error: any) {
      setIsSendingNotification(false);
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
      <div className="flex flex-col min-h-screen bg-casino-dark dark">
        {/* Navigation Bar */}
        <UserNavbar userId={user?.id} userEmail={user?.email} />
        
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-4 text-white/80 hover:text-white hover:bg-gold/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zum Dashboard
            </Button>
            
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gold-light to-amber-500 bg-clip-text text-transparent animate-gradient-shift">
              Guthaben einzahlen
            </h1>
            {userCredit !== null && (
              <p className="text-lg text-gold-light mt-2">
                Aktuelles Guthaben: {userCredit.toFixed(2)}€
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left section - Level chart */}
            <Card className="backdrop-blur-xl bg-black/40 p-6 relative overflow-hidden h-full border-gold/20">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/30 rounded-full blur-xl"></div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-gold-light" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-light to-amber-500">Level & Handelsvorteile</span>
              </h2>
              <LevelProgressChart currentBalance={userCredit || 0} />
            </Card>
            
            {/* Right section - Two stacked cards */}
            <div className="flex flex-col space-y-6">
              {/* Deposit Form Card */}
              <Card className="backdrop-blur-xl bg-black/40 overflow-hidden flex-1 border-gold/20">
                {isSendingNotification ? (
                  <div className="p-6 h-full flex flex-col items-center justify-center">
                    <div className="flex justify-center mb-6">
                      <Wallet className="h-16 w-16 text-amber-500 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-gold-light to-amber-500 mb-4">
                      Zahlung wird vorbereitet...
                    </h2>
                    <p className="text-center text-white/80">
                      Einen Moment bitte, wir bereiten Ihre Zahlung vor.
                    </p>
                  </div>
                ) : paymentSubmitted ? (
                  <PaymentStatusViewDeposit status={status} />
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="bg-black/60 p-4 border-b border-gold/20 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-gold-light" />
                      <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gold-light to-amber-500">
                        Einzahlung durchführen
                      </h2>
                    </div>
                    <div className="p-5">
                      <DepositForm 
                        wallets={wallets}
                        walletsLoading={walletsLoading}
                        walletError={walletError}
                        onRetryWallets={fetchWallets}
                        onSubmit={handleDepositSubmit}
                      />
                      
                      {/* Security Assurance now moved below DepositForm */}
                      <SecurityAssurance />
                    </div>
                  </div>
                )}
              </Card>
              
              {/* Deposit History Card */}
              <Card className="backdrop-blur-xl bg-black/40 p-6 border-gold/20">
                <DepositHistory userId={user?.id} />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </UserAuthCheck>
  );
};

export default UserDeposit;
