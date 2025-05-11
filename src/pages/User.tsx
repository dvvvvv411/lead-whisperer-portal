
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import UserDashboard from "@/components/user/UserDashboard";
import { checkUserRole } from "@/services/roleService";
import { useToast } from "@/hooks/use-toast";
import CryptoTradingSection from "@/components/user/trading/CryptoTradingSection";

const UserPage = () => {
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
    
    // Setze ein Intervall, um das Guthaben regelmäßig zu aktualisieren
    const creditUpdateInterval = setInterval(() => {
      if (user?.id) {
        fetchUserCredit(user.id);
      }
    }, 15000); // Alle 15 Sekunden aktualisieren
    
    return () => clearInterval(creditUpdateInterval);
  }, [toast]);
  
  // Guthaben des Nutzers abrufen
  const fetchUserCredit = async (userId: string) => {
    try {
      console.log("Aktualisiere Benutzerguthaben für ID:", userId);
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
        console.log("Neues Benutzerguthaben:", totalAmount);
        setUserCredit(totalAmount);
      }
    } catch (error: any) {
      console.error("Fehler beim Abrufen des Guthabens:", error.message);
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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8">
        {isActivated && user && (
          <UserDashboard user={user} userCredit={userCredit} onCreditUpdated={() => fetchUserCredit(user.id)} />
        )}
        
        {isActivated && user && userCredit !== null && (
          <CryptoTradingSection 
            user={user}
            userCredit={userCredit}
            onUpdated={() => fetchUserCredit(user.id)}
          />
        )}
      </div>
    </div>
  );
};

export default UserPage;
