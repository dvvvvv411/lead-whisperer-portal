
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { checkUserRole } from "@/services/roleService";
import { motion } from "framer-motion";

const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isUser, setIsUser] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Fehler beim Abrufen der Session:", error);
      }
      
      setSession(data.session);
      
      // Wenn der Benutzer eingeloggt ist, prüfen, ob er Admin oder User ist
      if (data.session) {
        const adminCheck = await checkUserRole('admin');
        const userCheck = await checkUserRole('user');
        setIsAdmin(adminCheck);
        setIsUser(userCheck);
      }
      
      setLoading(false);
    };
    
    checkSession();
    
    // Auth-Status-Änderungen überwachen
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      
      if (newSession) {
        const adminCheck = await checkUserRole('admin');
        const userCheck = await checkUserRole('user');
        setIsAdmin(adminCheck);
        setIsUser(userCheck);
      } else {
        setIsAdmin(null);
        setIsUser(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-casino-darker text-gray-300">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="animate-pulse flex flex-col items-center"
        >
          <div className="h-12 w-12 bg-gold/20 rounded-full mb-4 flex items-center justify-center">
            <div className="h-6 w-6 bg-gold rounded-full animate-ping"></div>
          </div>
          <p>Wird geladen...</p>
        </motion.div>
      </div>
    );
  }

  // Wenn der Benutzer angemeldet ist
  if (session) {
    // Wenn der Benutzer Admin ist, zeige das Admin-Dashboard
    if (isAdmin) {
      return <AdminDashboard />;
    }
    // Wenn der Benutzer ein aktivierter normaler User ist, zum Benutzer-Dashboard weiterleiten
    else if (isUser) {
      window.location.href = "/nutzer";
      return null;
    }
    // Wenn der Benutzer angemeldet ist, aber nicht aktiviert, zur Aktivierungsseite weiterleiten
    else {
      window.location.href = "/nutzer/aktivierung";
      return null;
    }
  }

  // Wenn der Benutzer nicht angemeldet ist, Login-Formular anzeigen
  return (
    <div className="bg-casino-darker">
      <AdminLogin />
    </div>
  );
};

export default Admin;
