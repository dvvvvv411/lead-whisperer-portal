
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
        window.location.href = "/admin";
        return;
      }
      
      // Special handling for the restricted user with specific ID
      if (data.session.user.id === "7eccf781-5911-4d90-a683-1df251069a2f") {
        console.log("Restricted user detected, allowing access to users page");
        setIsAdmin(true);
        setLoading(false);
        return;
      }
      
      const adminCheck = await checkUserRole('admin');
      setIsAdmin(adminCheck);
      setLoading(false);
      
      // If not admin, redirect to user dashboard
      if (!adminCheck) {
        window.location.href = "/nutzer";
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
