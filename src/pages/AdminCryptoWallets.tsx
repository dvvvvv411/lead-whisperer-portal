
import { CryptoWalletManager } from "@/components/admin/crypto-wallets/CryptoWalletManager";
import { motion } from "framer-motion";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const AdminCryptoWallets = () => {
  const { user, authLoading, isAdminUser } = useAdminAuth();
  
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

  if (!user) {
    console.log("AdminCryptoWallets: No user found, redirecting to admin login");
    window.location.href = "/admin";
    return null;
  }

  if (!isAdminUser) {
    console.log("AdminCryptoWallets: Access denied, user is not admin, redirecting to admin dashboard");
    window.location.href = "/admin";
    return null;
  }

  console.log("AdminCryptoWallets: Access granted, rendering crypto wallet manager");

  return <CryptoWalletManager />;
};

export default AdminCryptoWallets;
