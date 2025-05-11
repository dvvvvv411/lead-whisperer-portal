
import { useState, useEffect, useCallback } from "react";
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
  
  // Implement fetchUserCredit as a useCallback to avoid recreation on each render
  const fetchUserCredit = useCallback(async (userId: string) => {
    try {
      console.log("Aktualisiere Benutzerguthaben für ID:", userId);
      const { data, error } = await supabase
        .from('payments')
        .select('amount, status')
        .eq('user_id', userId)
        .eq('status', 'completed');
      
      if (error) throw error;
      
      // Summe aller bestätigten Zahlungen berechnen
      if (data && data.length > 0) {
        const totalAmount = data.reduce((sum, payment) => sum + payment.amount, 0) / 100; // Umrechnung von Cent in Euro
        console.log("Neues Benutzerguthaben:", totalAmount);
        setUserCredit(totalAmount);
      } else {
        console.log("Keine Zahlungen gefunden, setze Guthaben auf 0");
        setUserCredit(0);
      }
    } catch (error: any) {
      console.error("Fehler beim Abrufen des Guthabens:", error.message);
      toast({
        title: "Fehler beim Abrufen des Guthabens",
        description: "Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.",
        variant: "destructive"
      });
    }
  }, [toast]);
  
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
        
        // Echtzeit-Abonnement für Zahlungsänderungen einrichten
        const paymentsChannel = supabase
          .channel('payments_updates')
          .on(
            'postgres_changes',
            { 
              event: '*', 
              schema: 'public', 
              table: 'payments',
              filter: `user_id=eq.${data.user.id}`
            },
            () => {
              console.log('Zahlungsänderung erkannt, aktualisiere Guthaben');
              fetchUserCredit(data.user.id);
            }
          )
          .subscribe();
          
        setLoading(false);
        
        // Cleanup subscription
        return () => {
          supabase.removeChannel(paymentsChannel);
        };
      } else {
        // Wenn kein Benutzer eingeloggt ist, zur Login-Seite weiterleiten
        window.location.href = "/admin";
      }
    };
    
    getUser();
    
    // Setze ein Intervall, um das Guthaben regelmäßig zu aktualisieren (als Backup)
    const creditUpdateInterval = setInterval(() => {
      if (user?.id) {
        fetchUserCredit(user.id);
      }
    }, 10000); // Alle 10 Sekunden aktualisieren (erhöht von 15 Sekunden)
    
    return () => clearInterval(creditUpdateInterval);
  }, [toast, fetchUserCredit]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8">
        {isActivated && user && (
          <UserDashboard user={user} userCredit={userCredit} onCreditUpdated={() => user?.id && fetchUserCredit(user.id)} />
        )}
        
        {isActivated && user && userCredit !== null && (
          <CryptoTradingSection 
            user={user}
            userCredit={userCredit}
            onUpdated={() => user?.id && fetchUserCredit(user.id)}
          />
        )}
      </div>
    </div>
  );
};

export default UserPage;
