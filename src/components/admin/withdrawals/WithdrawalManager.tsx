
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WithdrawalManagerContent from "./WithdrawalManagerContent";
import { WithdrawalNotifier } from "./WithdrawalNotifier";
import { useAdminWithdrawals } from "@/hooks/useAdminWithdrawals";
import { AdminNavbar } from "../AdminNavbar";
import { motion } from "framer-motion";

const WithdrawalManager = () => {
  const { withdrawals, loading, fetchWithdrawals, user } = useAdminWithdrawals();

  return (
    <div className="min-h-screen bg-casino-darker text-gray-300">
      <WithdrawalNotifier />
      <AdminNavbar />
      
      <div className="container mx-auto p-4">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 via-teal-300 to-teal-400 bg-clip-text text-transparent">
            Auszahlungsverwaltung
          </h1>
          {user && <p className="text-gray-400">Eingeloggt als: {user.email}</p>}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border-gold/10 bg-casino-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-200">Auszahlungen verwalten</CardTitle>
              <CardDescription className="text-gray-400">Bearbeiten Sie Auszahlungsanfragen von Nutzern</CardDescription>
            </CardHeader>
            <CardContent>
              <WithdrawalManagerContent
                withdrawals={withdrawals}
                loading={loading}
                onWithdrawalUpdated={fetchWithdrawals}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default WithdrawalManager;
