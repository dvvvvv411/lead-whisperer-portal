import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UserAuthCheck from "@/components/user/activation/UserAuthCheck";
import WithdrawalForm from "@/components/user/withdrawal/WithdrawalForm";
import WithdrawalHistory from "@/components/user/withdrawal/WithdrawalHistory";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Wallet, TrendingUp, Award, Trophy, Shield } from "lucide-react";
import { useWallets } from "@/hooks/useWallets";
import { useUserCredit } from "@/hooks/useUserCredit";
import { Card } from "@/components/ui/card";
import UserNavbar from "@/components/user/UserNavbar";
import RobotCoinAnimation from "@/components/user/withdrawal/RobotCoinAnimation";

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
      <div className="flex flex-col min-h-screen bg-casino-dark dark">
        {/* Navigation Bar */}
        <UserNavbar userId={user?.id} userEmail={user?.email} />
        
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-4 text-white/70 hover:text-gold-light hover:bg-gold/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zum Dashboard
            </Button>
            
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Guthaben auszahlen
            </h1>
            {userCredit !== null && (
              <p className="text-lg text-gold/80 mt-2">
                Aktuelles Guthaben: {userCredit.toFixed(2)}€
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left section - Withdrawal Illustration */}
            <Card className="backdrop-blur-xl bg-black/30 border-gold/20 overflow-hidden h-full relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl"></div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gold-light">
                  <Wallet className="h-5 w-5 mr-2 text-gold/70" />
                  <span>Auszahlungsoptionen</span>
                </h2>
                
                <div className="space-y-6 relative p-2">
                  {/* Replace static elements with our new animated robot */}
                  <RobotCoinAnimation />
                  
                  <div className="space-y-4 mt-8">
                    <div className="text-lg font-medium mb-2 flex items-center text-gold-light">
                      <TrendingUp className="mr-2 h-5 w-5 text-gold/70" />
                      <span>Vorteile unseres Auszahlungssystems</span>
                    </div>
                    
                    {/* Feature boxes */}
                    <div className="rounded-lg border border-gold/20 p-4 bg-black/30 hover:bg-black/40 transition-colors">
                      <div className="flex items-center mb-2">
                        <Award className="w-5 h-5 text-gold mr-2" />
                        <span className="text-gold-light font-medium">Niedrige Gebühren</span>
                      </div>
                      <p className="text-sm text-white/70 ml-7">
                        Profitieren Sie von den niedrigsten Gebühren am Markt für Krypto-Auszahlungen.
                      </p>
                    </div>
                    
                    <div className="rounded-lg border border-gold/20 p-4 bg-black/30 hover:bg-black/40 transition-colors">
                      <div className="flex items-center mb-2">
                        <Trophy className="w-5 h-5 text-gold mr-2" />
                        <span className="text-gold-light font-medium">Schnelle Abwicklung</span>
                      </div>
                      <p className="text-sm text-white/70 ml-7">
                        Auszahlungen werden in der Regel innerhalb eines Werktages abgewickelt.
                      </p>
                    </div>
                    
                    <div className="rounded-lg border border-gold/20 p-4 bg-black/30 hover:bg-black/40 transition-colors">
                      <div className="flex items-center mb-2">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-gold animate-pulse"></div>
                        </div>
                        <span className="text-gold-light font-medium ml-2">Maximale Sicherheit</span>
                      </div>
                      <p className="text-sm text-white/70 ml-7">
                        Unser Auszahlungssystem nutzt modernste Sicherheitstechnologien.
                      </p>
                    </div>
                    
                    {/* New advantage box */}
                    <div className="rounded-lg border border-gold/20 p-4 bg-black/30 hover:bg-black/40 transition-colors">
                      <div className="flex items-center mb-2">
                        <Shield className="w-5 h-5 text-gold mr-2" />
                        <span className="text-gold-light font-medium">Garantierte Auszahlung</span>
                      </div>
                      <p className="text-sm text-white/70 ml-7">
                        Alle Auszahlungen werden zu 100% garantiert und sind vollständig versichert.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Right section - Two stacked cards */}
            <div className="flex flex-col space-y-6">
              {/* Withdrawal Form Card */}
              <Card className="backdrop-blur-xl bg-black/30 border-gold/20 overflow-hidden flex-1">
                <div className="flex flex-col h-full">
                  <div className="bg-gradient-to-r from-black/70 to-black/40 p-4 border-b border-gold/20 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-gold/70" />
                    <h2 className="text-xl font-semibold text-gold-light">
                      Auszahlung durchführen
                    </h2>
                  </div>
                  <div className="p-5">
                    <WithdrawalForm 
                      wallets={wallets}
                      walletsLoading={walletsLoading}
                      walletError={walletError}
                      onRetryWallets={fetchWallets}
                      userCredit={userCredit || 0}
                      onSubmit={handleWithdrawalSubmit}
                    />
                  </div>
                </div>
              </Card>
              
              {/* Withdrawal History Card */}
              <Card className="backdrop-blur-xl bg-black/30 border-gold/20 p-6">
                <WithdrawalHistory userId={user?.id} />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </UserAuthCheck>
  );
};

export default UserWithdrawal;
