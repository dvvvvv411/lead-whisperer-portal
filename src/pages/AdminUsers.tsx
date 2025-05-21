
import { useEffect, useState } from "react";
import { checkUserRole } from "@/services/roleService";
import { supabase } from "@/integrations/supabase/client";
import { UserManager } from "@/components/admin/users/UserManager";
import { motion } from "framer-motion";

const AdminUsers = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        console.log("No session found, redirecting to admin login");
        window.location.href = "/admin";
        return;
      }
      
      // Special handling for specific admin users
      if (data.session.user.id === "7eccf781-5911-4d90-a683-1df251069a2f" || 
          data.session.user.id === "054c7ee0-7f82-4e34-a0c0-45552f6a67f8") {
        console.log(`Admin user detected (ID: ${data.session.user.id}), allowing access to users page`);
        setIsAdmin(true);
        setLoading(false);
        return;
      }
      
      // For other users, check admin role
      try {
        const adminCheck = await checkUserRole('admin');
        console.log(`Admin role check: ${adminCheck ? "Is admin" : "Not admin"}`);
        setIsAdmin(adminCheck);
        
        // If not admin, redirect to user dashboard
        if (!adminCheck) {
          console.log("Not an admin, redirecting to user dashboard");
          window.location.href = "/nutzer";
        }
      } catch (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
        
        // Redirect on error as well
        console.log("Error checking admin status, redirecting to user dashboard");
        window.location.href = "/nutzer";
      } finally {
        setLoading(false);
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
