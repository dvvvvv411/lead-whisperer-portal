
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { checkUserRole } from "@/services/roleService";
import { motion } from "framer-motion";

const Admin = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isUser, setIsUser] = useState<boolean | null>(null);

  useEffect(() => {
    console.log("Admin page mounting, checking session...");
    
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Fehler beim Abrufen der Session:", error);
          setLoading(false);
          return;
        }
        
        console.log("Session check result:", data.session ? "Session found" : "No session");
        setSession(data.session);
        
        // Wenn der Benutzer eingeloggt ist, prüfen, ob er Admin oder User ist
        if (data.session) {
          console.log("User is logged in, checking roles...");
          const adminCheck = await checkUserRole('admin');
          const userCheck = await checkUserRole('user');
          console.log("Role check results - Admin:", adminCheck, "User:", userCheck);
          setIsAdmin(adminCheck);
          setIsUser(userCheck);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Unexpected error during session check:", err);
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Auth-Status-Änderungen überwachen
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event);
      setSession(newSession);
      
      if (newSession) {
        console.log("New session detected, checking roles");
        const adminCheck = await checkUserRole('admin');
        const userCheck = await checkUserRole('user');
        console.log("Updated role check - Admin:", adminCheck, "User:", userCheck);
        setIsAdmin(adminCheck);
        setIsUser(userCheck);
      } else {
        setIsAdmin(null);
        setIsUser(null);
      }
    });
    
    return () => {
      console.log("Admin page unmounting, cleaning up subscription");
      subscription.unsubscribe();
    };
  }, [navigate]);

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
    console.log("Session exists, admin:", isAdmin, "user:", isUser);
    
    // Wenn der Benutzer Admin ist, zeige das Admin-Dashboard
    if (isAdmin) {
      console.log("Displaying admin dashboard");
      return <AdminDashboard />;
    }
    // Wenn der Benutzer ein aktivierter normaler User ist, zum Benutzer-Dashboard weiterleiten
    else if (isUser) {
      console.log("Redirecting to user dashboard");
      navigate("/nutzer");
      return null;
    }
    // Wenn der Benutzer angemeldet ist, aber nicht aktiviert, zur Aktivierungsseite weiterleiten
    else {
      console.log("Redirecting to activation page");
      navigate("/nutzer/aktivierung");
      return null;
    }
  }

  // Wenn der Benutzer nicht angemeldet ist, Login-Formular anzeigen
  console.log("No session found, displaying login form");
  return (
    <div className="bg-casino-darker">
      <AdminLogin />
    </div>
  );
};

export default Admin;
