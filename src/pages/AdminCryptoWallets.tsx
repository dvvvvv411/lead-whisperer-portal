
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CryptoWalletManager } from "@/components/admin/crypto-wallets/CryptoWalletManager";
import { motion } from "framer-motion";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const AdminCryptoWallets = () => {
  const { user, authLoading } = useAdminAuth();
  const [isLeadsOnlyUser, setIsLeadsOnlyUser] = useState<boolean>(false);

  // Check if this is a leads-only user
  useEffect(() => {
    if (user) {
      const isLeadsOnly = user.id === "7eccf781-5911-4d90-a683-1df251069a2f";
      setIsLeadsOnlyUser(isLeadsOnly);
      
      // Wenn es ein Leads-Only-Benutzer ist, zur Leads-Seite weiterleiten
      if (isLeadsOnly) {
        window.location.href = "/admin/leads";
      }
    }
  }, [user]);

  if (authLoading) {
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

  return !isLeadsOnlyUser ? <CryptoWalletManager /> : null;
};

export default AdminCryptoWallets;
