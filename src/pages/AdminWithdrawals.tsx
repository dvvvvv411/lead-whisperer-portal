
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import WithdrawalManager from "@/components/admin/withdrawals/WithdrawalManager";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminWithdrawals = () => {
  const { user, authLoading, handleLogout } = useAdminAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (user) {
        // Special handling for the leads user with extended access
        if (user.id === "7eccf781-5911-4d90-a683-1df251069a2f") {
          setIsAuthorized(true);
          setLoading(false);
          return;
        }
        
        // For all other users, check admin role
        const { data, error } = await supabase.rpc('check_is_admin');
        if (!error && data) {
          setIsAuthorized(true);
        } else {
          window.location.href = "/admin";
        }
      }
      setLoading(false);
    };
    
    if (!authLoading && user) {
      checkAccess();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-casino-darker text-gray-300">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="animate-pulse flex flex-col items-center"
        >
          <div className="h-12 w-12 bg-teal-500/20 rounded-full mb-4 flex items-center justify-center">
            <div className="h-6 w-6 bg-teal-500/60 rounded-full animate-ping"></div>
          </div>
          <p>Wird geladen...</p>
        </motion.div>
      </div>
    );
  }

  return isAuthorized ? <WithdrawalManager /> : null;
};

export default AdminWithdrawals;
