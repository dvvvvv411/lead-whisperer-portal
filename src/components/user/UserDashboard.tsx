
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCcw, Wallet, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

// Credit threshold required to access the dashboard (in EUR)
const CREDIT_ACTIVATION_THRESHOLD = 250;

interface UserDashboardProps {
  user: any;
  userCredit: number | null;
  onCreditUpdated?: () => void;
}

const UserDashboard = ({ user, userCredit, onCreditUpdated }: UserDashboardProps) => {
  const [showActivationMessage, setShowActivationMessage] = useState<boolean>(false);
  
  // Check local storage to see if this is the first time the user sees the dashboard
  // after reaching the activation threshold
  useEffect(() => {
    const activationAcknowledged = localStorage.getItem(`activation-acknowledged-${user?.id}`);
    
    if (!activationAcknowledged && userCredit && userCredit >= CREDIT_ACTIVATION_THRESHOLD) {
      setShowActivationMessage(true);
    }
  }, [user?.id, userCredit]);
  
  const handleDismissActivationMessage = () => {
    localStorage.setItem(`activation-acknowledged-${user?.id}`, 'true');
    setShowActivationMessage(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/admin";
    } catch (error) {
      console.error("Fehler beim Abmelden:", error);
    }
  };

  const handleRefreshCredit = () => {
    console.log("Refresh credit button clicked");
    if (onCreditUpdated) {
      onCreditUpdated();
    }
  };

  console.log("UserDashboard received credit:", userCredit);

  return (
    <div className="container mx-auto p-4">
      {showActivationMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-green-800">Konto erfolgreich aktiviert!</h3>
              <p className="text-green-700 mt-1">
                Ihr Konto wurde erfolgreich aktiviert. Sie haben nun Zugriff auf alle Funktionen des Systems.
              </p>
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-green-700 border-green-300 hover:bg-green-100"
                  onClick={handleDismissActivationMessage}
                >
                  Verstanden
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Benutzer Dashboard</h1>
        <div className="flex items-center gap-2">
          {user && <span className="text-sm text-gray-600">Angemeldet als: {user.email}</span>}
          <Button variant="outline" onClick={handleLogout}>Abmelden</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Willkommen</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Sie sind als aktiver Benutzer angemeldet. Vielen Dank für die Aktivierung Ihres Kontos!</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-primary" />
                Ihr Guthaben
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={handleRefreshCredit} title="Guthaben aktualisieren">
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{userCredit !== null ? `${userCredit.toFixed(2)}€` : "0,00€"}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Ihr Guthaben wird für den Krypto-Trading-Simulator verwendet und nach jedem Trade aktualisiert.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
