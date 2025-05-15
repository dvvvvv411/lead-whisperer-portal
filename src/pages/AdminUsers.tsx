
import { useEffect, useState } from "react";
import { checkUserRole } from "@/services/roleService";
import { supabase } from "@/integrations/supabase/client";
import { UserManager } from "@/components/admin/users/UserManager";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

const AdminUsers = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          toast({
            title: "Fehler",
            description: "Fehler beim Überprüfen der Session. Bitte versuchen Sie es erneut.",
            variant: "destructive"
          });
          window.location.href = "/admin";
          return;
        }
        
        if (!data.session) {
          console.log("No session found, redirecting to admin login");
          window.location.href = "/admin";
          return;
        }
        
        // Spezielle Behandlung für den Benutzer mit der Leads-Only-ID
        if (data.session.user.id === "7eccf781-5911-4d90-a683-1df251069a2f") {
          console.log("Leads-only user detected, allowing access to users page");
          setIsAdmin(true);
          setLoading(false);
          return;
        }
        
        const adminCheck = await checkUserRole('admin');
        console.log("Admin check result:", adminCheck);
        setIsAdmin(adminCheck);
        
        // Wenn kein Admin, zum Benutzer-Dashboard weiterleiten
        if (!adminCheck) {
          console.log("User is not admin, redirecting to user dashboard");
          window.location.href = "/nutzer";
          return;
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Unexpected error checking admin status:", error);
        toast({
          title: "Fehler",
          description: "Es ist ein unerwarteter Fehler aufgetreten.",
          variant: "destructive"
        });
        window.location.href = "/admin";
      }
    };
    
    checkAdminStatus();
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

  return isAdmin ? <UserManager /> : null;
};

export default AdminUsers;
