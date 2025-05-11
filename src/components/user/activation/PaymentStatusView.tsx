
import { useState, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUserCredit } from "@/hooks/useUserCredit";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
        
        setTimeout(() => {
          navigate('/nutzer');
        }, 1500);
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

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Zahlung wird überprüft</h1>
        <p className="text-gray-600">Bitte verlassen Sie diese Seite nicht, während Ihre Zahlung überprüft wird.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Zahlungsstatus</CardTitle>
          <CardDescription>
            Ihre Zahlungsmeldung wurde erfolgreich eingereicht und wird jetzt überprüft.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-gray-50">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Wir überprüfen Ihre Zahlung</p>
            <p className="text-sm text-gray-500 text-center mt-2">
              Dies kann bis zu 15 Minuten dauern. Bitte verlassen Sie diese Seite nicht.
            </p>
            
            {userCredit !== null && (
              <div className={`mt-4 p-3 ${isActivated ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'} rounded-md w-full`}>
                <div className="flex justify-between mb-1">
                  <p className="font-medium">Aktuelles Guthaben: {userCredit.toFixed(2)}€</p>
                  <p className="font-medium">{activationProgress.toFixed(0)}%</p>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${isActivated ? 'bg-green-600' : 'bg-amber-500'}`} 
                    style={{ width: `${activationProgress}%` }}
                  ></div>
                </div>
                
                {!isActivated && (
                  <p className="text-sm mt-2">
                    Sie benötigen noch {remainingAmount.toFixed(2)}€, um Ihr Konto zu aktivieren.
                  </p>
                )}
                
                {isActivated && (
                  <p className="text-sm mt-2 font-medium text-green-700">
                    Ihr Konto ist jetzt aktiviert! Sie werden gleich weitergeleitet.
                  </p>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <p className="text-sm text-yellow-700">
                <strong>Wichtig:</strong> Bitte bleiben Sie auf dieser Seite, bis Ihre Zahlung bestätigt wurde. 
                Sie werden automatisch weitergeleitet, sobald Ihr Guthaben mindestens {creditThreshold}€ erreicht hat.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 border-t pt-4">
          <Button
            variant="outline"
            onClick={checkActivationStatus}
            disabled={isChecking}
            className="flex items-center gap-2"
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
    </div>
  );
};

export default PaymentStatusView;
