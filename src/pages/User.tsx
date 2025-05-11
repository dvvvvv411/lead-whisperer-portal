
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useUserCredit } from "@/hooks/useUserCredit";
import UserNavbar from "@/components/user/UserNavbar";
import { useToast } from "@/hooks/use-toast";
import CryptoTradingSection from "@/components/user/trading/CryptoTradingSection";
import TradeHistoryList from "@/components/user/trading/TradeHistoryList";
import CryptoMarketList from "@/components/user/trading/CryptoMarketList";
import AITradingBot from "@/components/user/trading/AITradingBot";
import { useCryptos } from "@/hooks/useCryptos";
import { useTradeHistory } from "@/hooks/useTradeHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

// Credit threshold required to access the dashboard (in EUR)
const CREDIT_ACTIVATION_THRESHOLD = 250;

const User = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [redirectChecked, setRedirectChecked] = useState(false);
  const [showActivationMessage, setShowActivationMessage] = useState<boolean>(false);

  // Use the credit hook with a key that forces refresh when coming back to this page
  const { userCredit, loading: creditLoading, fetchUserCredit } = useUserCredit(user?.id);
  const { cryptos, loading: cryptosLoading } = useCryptos();
  const { trades, botTrades, loading: tradesLoading } = useTradeHistory(user?.id);

  // Force refresh of credit when component mounts or when user changes
  useEffect(() => {
    if (user?.id) {
      console.log("Forcing credit refresh for user:", user.id);
      fetchUserCredit();
    }
  }, [user?.id, fetchUserCredit]);

  // Check authentication once
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        console.log("Fetching current user on /nutzer page");
        const { data } = await supabase.auth.getUser();
        
        if (data?.user) {
          console.log("User found on /nutzer page:", data.user.id);
          setUser(data.user);
        } else {
          // If no user is logged in, redirect to login page
          console.log("No user found, redirecting to login");
          navigate("/admin");
          return;
        }
      } catch (error) {
        console.error("Error checking user on /nutzer page:", error);
        navigate("/admin");
        return;
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };
    
    getUser();
  }, [navigate]);

  // Check credit threshold only once after user and credit are loaded
  useEffect(() => {
    if (!user?.id || creditLoading || redirectChecked) return;
    
    console.log("Checking user credit for activation:", userCredit);
    
    // If user has less than the threshold, redirect to activation page
    if (userCredit !== null && userCredit < CREDIT_ACTIVATION_THRESHOLD) {
      console.log(`User credit (${userCredit}€) is below threshold (${CREDIT_ACTIVATION_THRESHOLD}€), redirecting to activation page`);
      navigate("/nutzer/aktivierung");
    } else {
      console.log(`User credit (${userCredit}€) is adequate, staying on dashboard page`);
      
      // Check local storage to see if this is the first time the user sees the dashboard
      // after reaching the activation threshold
      const activationAcknowledged = localStorage.getItem(`activation-acknowledged-${user?.id}`);
      if (!activationAcknowledged) {
        setShowActivationMessage(true);
      }
    }
    
    // Mark this check as done
    setRedirectChecked(true);
  }, [userCredit, creditLoading, user?.id, navigate, redirectChecked]);

  // Early return to prevent any content rendering before verification is complete
  if (loading || creditLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-casino-dark">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-gold border-casino-card animate-spin mb-4"></div>
          <p className="text-muted-foreground">Wird geladen...</p>
        </div>
      </div>
    );
  }

  const handleCreditUpdated = () => {
    console.log("Refreshing user credit...");
    fetchUserCredit();
  };

  const handleDismissActivationMessage = () => {
    localStorage.setItem(`activation-acknowledged-${user?.id}`, 'true');
    setShowActivationMessage(false);
  };

  console.log("Current user credit:", userCredit);

  // Only render the dashboard if authentication is checked
  return authChecked ? (
    <div className="flex flex-col min-h-screen bg-casino-dark dark">
      <UserNavbar userId={user?.id} userEmail={user?.email} />
      
      <main className="flex-1 container mx-auto p-4">
        {/* Activation success message */}
        {showActivationMessage && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-500/30 rounded-lg animate-fade-in">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-green-400">Konto erfolgreich aktiviert!</h3>
                <p className="text-green-300 mt-1">
                  Ihr Konto wurde erfolgreich aktiviert. Sie haben nun Zugriff auf alle Funktionen des Systems.
                </p>
                <div className="mt-3">
                  <button 
                    className="px-3 py-1 text-sm bg-green-800/50 hover:bg-green-700/50 text-green-200 rounded"
                    onClick={handleDismissActivationMessage}
                  >
                    Verstanden
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main section - AI Bot (takes 2/3 of the screen on large displays) */}
          <div className="lg:col-span-2">
            <Card className="casino-card overflow-hidden mb-6 transform transition-all duration-300 hover:translate-y-[-2px]">
              <CardHeader className="bg-gold/5 border-b border-gold/10">
                <CardTitle className="gradient-text text-2xl">
                  KI-Trading Bot
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <AITradingBot 
                  userId={user?.id} 
                  userCredit={userCredit || 0}
                  onTradeExecuted={handleCreditUpdated}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar sections (1/3 of screen on large displays) */}
          <div className="space-y-6">
            {/* Market Overview */}
            <Card className="casino-card overflow-hidden transform transition-all duration-300 hover:translate-y-[-2px]">
              <CardHeader className="bg-gold/5 border-b border-gold/10">
                <CardTitle className="text-lg text-foreground">
                  Marktübersicht
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 max-h-[400px] overflow-y-auto">
                {cryptosLoading ? (
                  <div className="p-4 text-center">
                    <div className="h-8 w-8 rounded-full border-2 border-t-gold border-casino-card animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Lade Marktdaten...</p>
                  </div>
                ) : (
                  <CryptoMarketList 
                    cryptos={cryptos} 
                    userCredit={userCredit || 0}
                    onTrade={() => {}}
                    compact={true}
                  />
                )}
              </CardContent>
            </Card>

            {/* Trade History */}
            <Card className="casino-card overflow-hidden transform transition-all duration-300 hover:translate-y-[-2px]">
              <CardHeader className="bg-gold/5 border-b border-gold/10">
                <CardTitle className="text-lg text-foreground">
                  Handelshistorie
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 max-h-[400px] overflow-y-auto">
                {tradesLoading ? (
                  <div className="p-4 text-center">
                    <div className="h-8 w-8 rounded-full border-2 border-t-gold border-casino-card animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Lade Handelshistorie...</p>
                  </div>
                ) : (
                  <TradeHistoryList 
                    trades={trades} 
                    botTrades={botTrades}
                    compact={true} 
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  ) : null;
};

export default User;
