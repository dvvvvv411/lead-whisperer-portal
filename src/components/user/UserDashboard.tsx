
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCcw } from "lucide-react";

interface UserDashboardProps {
  user: any;
  userCredit: number | null;
  onCreditUpdated?: () => void;
}

const UserDashboard = ({ user, userCredit, onCreditUpdated }: UserDashboardProps) => {
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/admin";
    } catch (error) {
      console.error("Fehler beim Abmelden:", error);
    }
  };

  const handleRefreshCredit = () => {
    if (onCreditUpdated) {
      onCreditUpdated();
    }
  };

  return (
    <div className="container mx-auto p-4">
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
              <CardTitle>Ihr Guthaben</CardTitle>
              <Button variant="ghost" size="icon" onClick={handleRefreshCredit} title="Guthaben aktualisieren">
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{userCredit !== null ? `${userCredit.toFixed(2)}€` : "0,00€"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
