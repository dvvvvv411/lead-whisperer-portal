
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import AdminAffiliateOverview from "@/components/admin/affiliate/AdminAffiliateOverview";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { motion } from "framer-motion";

const AdminAffiliate = () => {
  const { user, authLoading } = useAdminAuth();

  if (authLoading) {
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-casino-darker text-gray-300">
      <AdminNavbar />
      
      <div className="container mx-auto p-4">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 via-teal-300 to-teal-400 bg-clip-text text-transparent">
            Affiliate System
          </h1>
          <p className="text-gray-400">Übersicht über das Affiliate-Programm</p>
        </motion.div>
        
        <AdminAffiliateOverview />
      </div>
    </div>
  );
};

export default AdminAffiliate;
