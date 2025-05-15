
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function useAdminAuth() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Benutzer-Session abrufen und auf Auth-Änderungen reagieren
  useEffect(() => {
    console.log("useAdminAuth: Setting up auth monitoring");
    
    // Set up the auth listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("useAdminAuth: Auth state changed:", event);
      
      if (session?.user) {
        console.log("useAdminAuth: User session updated:", session.user.email);
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        console.log("useAdminAuth: User signed out");
        setUser(null);
        navigate("/auth");
      }
    });
    
    // Then get the current user state
    const getUser = async () => {
      try {
        console.log("useAdminAuth: Getting current user");
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("useAdminAuth: Error fetching user:", error);
          navigate("/auth");
          setAuthLoading(false);
          return;
        }
        
        if (data?.user) {
          console.log("useAdminAuth: User found", data.user.email);
          setUser(data.user);
        } else {
          console.log("useAdminAuth: No user found, redirecting to login");
          navigate("/auth");
        }
      } catch (err) {
        console.error("useAdminAuth: Unexpected error:", err);
      } finally {
        setAuthLoading(false);
      }
    };
    
    getUser();
    
    // Cleanup
    return () => {
      console.log("useAdminAuth: Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      console.log("useAdminAuth: Logging out");
      await supabase.auth.signOut();
      toast({
        title: "Erfolgreich abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet."
      });
      navigate("/auth");
    } catch (error) {
      console.error("Fehler beim Abmelden:", error);
      toast({
        title: "Fehler beim Abmelden",
        description: "Es gab ein Problem beim Abmelden.",
        variant: "destructive"
      });
    }
  };

  return {
    user,
    authLoading,
    handleLogout
  };
}
