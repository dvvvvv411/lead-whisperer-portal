
import { useState, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw, CheckCircle, Trophy, Award, BarChart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUserCredit } from "@/hooks/useUserCredit";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Default credit threshold if not provided
const DEFAULT_CREDIT_THRESHOLD = 250;

interface PaymentStatusViewProps {
  paymentId: string | null;
  creditThreshold?: number;
}

const PaymentStatusView = ({ paymentId, creditThreshold = DEFAULT_CREDIT_THRESHOLD }: PaymentStatusViewProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Get the user to fetch their credit
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUser(data.user);
      }
    };
    
    getUser();
  }, []);
  
  // Use the credit hook to check the current credit status
  const { userCredit, fetchUserCredit } = useUserCredit(currentUser?.id);

  // Effect to check if user is activated and show celebration
  useEffect(() => {
    if (userCredit !== null && userCredit >= creditThreshold) {
      setShowCelebration(true);
      const timer = setTimeout(() => {
        navigate('/nutzer');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [userCredit, creditThreshold, navigate]);

  // Function to manually check activation status
  const checkActivationStatus = async () => {
    if (!currentUser) return;
    
    setIsChecking(true);
    try {
      // First refresh the user credit to get the latest value
      await fetchUserCredit();
      
      if (userCredit >= creditThreshold) {
        toast({
          title: "Konto aktiviert",
          description: `Ihr Konto wurde mit ${userCredit.toFixed(2)}€ aktiviert! Die Seite wird aktualisiert...`
        });
        
        setShowCelebration(true);
        setTimeout(() => {
          navigate('/nutzer');
        }, 3000);
      } else {
        const remaining = creditThreshold - (userCredit || 0);
        toast({
          title: "Noch nicht genug Guthaben",
          description: `Sie benötigen noch ${remaining.toFixed(2)}€, um Ihr Konto zu aktivieren.`
        });
      }
    } catch (error) {
      console.error("Error checking activation status:", error);
      toast({
        title: "Fehler beim Überprüfen",
        description: "Es gab einen Fehler beim Überprüfen Ihres Kontostands.",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Function to refresh the page
  const refreshPage = () => {
    window.location.reload();
  };

  // Calculate remaining amount needed to activate
  const remainingAmount = creditThreshold - (userCredit || 0);
  const isActivated = userCredit !== null && userCredit >= creditThreshold;
  const activationProgress = userCredit !== null ? Math.min((userCredit / creditThreshold) * 100, 100) : 0;

  if (showCelebration) {
    return (
      <ActivationSuccessView credit={userCredit} />
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <motion.div 
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2 gradient-text">Zahlung wird überprüft</h1>
        <p className="text-gray-400">Bitte verlassen Sie diese Seite nicht, während Ihre Zahlung überprüft wird.</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-gold/20 bg-slate-900/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Zahlungsstatus</CardTitle>
            <CardDescription>
              Ihre Zahlungsmeldung wurde erfolgreich eingereicht und wird jetzt überprüft.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 border border-slate-700/50 rounded-lg bg-slate-800/50">
              <Loader2 className="h-10 w-10 animate-spin text-gold mb-4" />
              <p className="text-lg font-medium text-white">Wir überprüfen Ihre Zahlung</p>
              <p className="text-sm text-gray-400 text-center mt-2">
                Dies kann bis zu 15 Minuten dauern. Bitte verlassen Sie diese Seite nicht.
              </p>
              
              {userCredit !== null && (
                <motion.div 
                  className={`mt-6 p-4 ${isActivated ? 'bg-green-900/20 border-green-700/30' : 'bg-amber-900/20 border-amber-700/30'} rounded-md w-full border`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex justify-between mb-2">
                    <p className="font-medium text-white">Aktuelles Guthaben: <span className={isActivated ? 'text-green-400' : 'text-amber-400'}>{userCredit.toFixed(2)}€</span></p>
                    <p className="font-medium text-white">{activationProgress.toFixed(0)}%</p>
                  </div>
                  
                  <div className="w-full bg-slate-700 rounded-full h-2.5 mb-2">
                    <div 
                      className={`h-2.5 rounded-full ${isActivated ? 'bg-green-500' : 'bg-amber-500'}`} 
                      style={{ width: `${activationProgress}%` }}
                    ></div>
                  </div>
                  
                  {!isActivated && (
                    <p className="text-sm mt-2 text-amber-400">
                      Sie benötigen noch {remainingAmount.toFixed(2)}€, um Ihr Konto zu aktivieren.
                    </p>
                  )}
                  
                  {isActivated && (
                    <p className="text-sm mt-2 font-medium text-green-400">
                      Ihr Konto ist jetzt aktiviert! Sie werden gleich weitergeleitet.
                    </p>
                  )}
                </motion.div>
              )}
            </div>
            
            <div className="bg-amber-900/10 p-4 rounded-lg border border-amber-700/30">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <p className="text-sm text-amber-400">
                  <strong>Wichtig:</strong> Bitte bleiben Sie auf dieser Seite, bis Ihre Zahlung bestätigt wurde. 
                  Sie werden automatisch weitergeleitet, sobald Ihr Guthaben mindestens {creditThreshold}€ erreicht hat.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4 border-t border-slate-700/50 pt-4">
            <Button
              variant="outline"
              onClick={checkActivationStatus}
              disabled={isChecking}
              className="border-slate-700 text-white hover:bg-slate-800 flex items-center gap-2"
            >
              {isChecking ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Status prüfen
            </Button>
            <Button
              variant="secondary"
              onClick={refreshPage}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Seite aktualisieren
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

const ActivationSuccessView = ({ credit }: { credit: number | null }) => {
  const navigate = useNavigate();
  
  const goToDashboard = () => {
    navigate('/nutzer');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto text-center"
    >
      <div className="p-12">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-28 h-28 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-6"
        >
          <Trophy className="h-14 w-14 text-white" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold mb-4 gradient-text"
        >
          Konto erfolgreich aktiviert!
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-gray-300 mb-8"
        >
          Willkommen in der Premium-Handelswelt! Ihr Guthaben von {credit?.toFixed(2)}€ ist einsatzbereit.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col md:flex-row gap-6 justify-center mb-10"
        >
          <div className="bg-slate-800/60 p-5 rounded-lg border border-slate-700 flex items-center">
            <div className="mr-4 p-3 bg-blue-900/30 rounded-full">
              <Award className="h-8 w-8 text-blue-400" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white">Premium-Funktionen</h3>
              <p className="text-sm text-gray-400">Alle Handelstools freigeschaltet</p>
            </div>
          </div>
          
          <div className="bg-slate-800/60 p-5 rounded-lg border border-slate-700 flex items-center">
            <div className="mr-4 p-3 bg-green-900/30 rounded-full">
              <BarChart className="h-8 w-8 text-green-400" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white">AI-Trading</h3>
              <p className="text-sm text-gray-400">KI-Algorithmus einsatzbereit</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-gray-400 mb-6">
            Sie werden in wenigen Sekunden automatisch weitergeleitet...
          </p>
          
          <Button onClick={goToDashboard} className="bg-gold hover:bg-gold/80 text-black">
            <CheckCircle className="mr-2 h-4 w-4" />
            Zum Dashboard
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PaymentStatusView;
