
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAdminAuth() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Benutzer-Session abrufen
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        // Wenn kein Benutzer eingeloggt ist, zur Login-Seite weiterleiten
        window.location.href = "/admin";
      }
      setAuthLoading(false);
    };
    
    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/admin";
    } catch (error) {
      console.error("Fehler beim Abmelden:", error);
    }
  };

  return {
    user,
    authLoading,
    handleLogout
  };
}
