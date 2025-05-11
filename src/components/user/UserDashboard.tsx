
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkUserRole } from "@/services/roleService";
import { useToast } from "@/hooks/use-toast";

const UserDashboard = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isActivated, setIsActivated] = useState(false);
  const [userCredit, setUserCredit] = useState<number | null>(null);
  
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        
        // Prüfen, ob der Nutzer die Rolle "user" hat (aktiviert ist)
        const activated = await checkUserRole('user');
        setIsActivated(activated);
        
        // Wenn nicht aktiviert, zur Aktivierungsseite weiterleiten
        if (!activated) {
          console.log("Benutzer nicht aktiviert, Weiterleitung zur Aktivierungsseite");
          toast({
            title: "Aktivierung erforderlich",
            description: "Bitte aktivieren Sie Ihr Konto, um fortzufahren.",
          });
          window.location.href = "/nutzer/aktivierung";
          return;
        }
        
        // Guthaben des Nutzers abrufen
        await fetchUserCredit(data.user.id);
        
        setLoading(false);
      } else {
        // Wenn kein Benutzer eingeloggt ist, zur Login-Seite weiterleiten
        window.location.href = "/admin";
      }
    };
    
    getUser();
  }, [toast]);
  
  // Guthaben des Nutzers abrufen
  const fetchUserCredit = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('amount')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Summe aller bestätigten Zahlungen berechnen
      if (data && data.length > 0) {
        const totalAmount = data.reduce((sum, payment) => sum + payment.amount, 0) / 100; // Umrechnung von Cent in Euro
        setUserCredit(totalAmount);
      }
    } catch (error: any) {
      console.error("Fehler beim Abrufen des Guthabens:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/admin";
    } catch (error) {
      console.error("Fehler beim Abmelden:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Wird geladen...</p>
      </div>
    );
  }

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
            <CardTitle>Ihr Guthaben</CardTitle>
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
