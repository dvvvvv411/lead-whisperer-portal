
import { useEffect, useState } from "react";
import { checkUserRole } from "@/services/roleService";
import { supabase } from "@/integrations/supabase/client";
import { CryptoWalletManager } from "@/components/admin/crypto-wallets/CryptoWalletManager";
import { motion } from "framer-motion";

const AdminCryptoWallets = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        window.location.href = "/admin";
        return;
      }
      
      const adminCheck = await checkUserRole('admin');
      setIsAdmin(adminCheck);
      setLoading(false);
      
      // Wenn kein Admin, zum Benutzer-Dashboard weiterleiten
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
          <div className="h-12 w-12 bg-green-500/20 rounded-full mb-4 flex items-center justify-center">
            <div className="h-6 w-6 bg-green-500/60 rounded-full animate-ping"></div>
          </div>
          <p>Wird geladen...</p>
        </motion.div>
      </div>
    );
  }

  return isAdmin ? <CryptoWalletManager /> : null;
};

export default AdminCryptoWallets;
