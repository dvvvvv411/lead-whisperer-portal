
import { useState, useEffect } from "react";
import { PaymentManager } from "@/components/admin/payments/PaymentManager";
import { motion } from "framer-motion";
import { PaymentNotifier } from "@/components/admin/payments/PaymentNotifier";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const AdminPayments = () => {
  const { user, authLoading, isAdminUser } = useAdminAuth();
  
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-casino-darker text-gray-300">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="animate-pulse flex flex-col items-center"
        >
          <div className="h-12 w-12 bg-purple-500/20 rounded-full mb-4 flex items-center justify-center">
            <div className="h-6 w-6 bg-purple-500/60 rounded-full animate-ping"></div>
          </div>
          <p>Überprüfe Zugriffsberechtigung...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    console.log("AdminPayments: No user found, redirecting to admin login");
    window.location.href = "/admin";
    return null;
  }

  if (!isAdminUser) {
    console.log("AdminPayments: Access denied, user is not admin, redirecting to admin dashboard");
    window.location.href = "/admin";
    return null;
  }

  console.log("AdminPayments: Access granted, rendering payment manager");

  return (
    <>
      <PaymentNotifier />
      <PaymentManager />
    </>
  );
};

export default AdminPayments;
