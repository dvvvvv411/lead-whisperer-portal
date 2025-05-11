
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import UserDashboard from "@/components/user/UserDashboard";
import { checkUserRole } from "@/services/roleService";
import { useToast } from "@/hooks/use-toast";
import CryptoTradingSection from "@/components/user/trading/CryptoTradingSection";
import { useUserCredit } from "@/hooks/useUserCredit";

const UserPage = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isActivated, setIsActivated] = useState(false);
  
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
        
        setLoading(false);
      } else {
        // Wenn kein Benutzer eingeloggt ist, zur Login-Seite weiterleiten
        window.location.href = "/admin";
      }
    };
    
    getUser();
  }, [toast]);
  
  // Use the new custom hook for credit management
  const { userCredit, fetchUserCredit } = useUserCredit(user?.id);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8">
        {isActivated && user && (
          <UserDashboard 
            user={user} 
            userCredit={userCredit} 
            onCreditUpdated={fetchUserCredit} 
          />
        )}
        
        {isActivated && user && userCredit !== null && (
          <CryptoTradingSection 
            user={user}
            userCredit={userCredit}
            onUpdated={fetchUserCredit}
          />
        )}
      </div>
    </div>
  );
};

export default UserPage;
