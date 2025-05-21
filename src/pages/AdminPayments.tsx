
import { useState, useEffect } from "react";
import { PaymentManager } from "@/components/admin/payments/PaymentManager";
import { motion } from "framer-motion";
import { PaymentNotifier } from "@/components/admin/payments/PaymentNotifier";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";

const AdminPayments = () => {
  const { user, authLoading } = useAdminAuth();
  const [isAllowed, setIsAllowed] = useState(false);
  
  useEffect(() => {
    const checkAccess = async () => {
      if (user) {
        // Allow access for specific admin users by ID
        if (user.id === "7eccf781-5911-4d90-a683-1df251069a2f" || 
            user.id === "054c7ee0-7f82-4e34-a0c0-45552f6a67f8") {
          console.log(`Access granted to payments for user with ID: ${user.id}`);
          setIsAllowed(true);
        } else {
          // For other users, check if they're admins
          const { data: isAdmin, error } = await supabase.rpc('has_role', {
            _user_id: user.id,
            _role: 'admin'
          });
          
          if (error) {
            console.error("Error checking admin role:", error);
          }
          
          setIsAllowed(isAdmin || false);
          console.log(`Admin role check for user ${user.id}: ${isAdmin ? "Is admin" : "Not admin"}`);
        }
      }
    };
    
    if (user) {
      checkAccess();
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
          <div className="h-12 w-12 bg-purple-500/20 rounded-full mb-4 flex items-center justify-center">
            <div className="h-6 w-6 bg-purple-500/60 rounded-full animate-ping"></div>
          </div>
          <p>Wird geladen...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAllowed && !authLoading) {
    console.log("Access denied to payments page, redirecting to admin");
    window.location.href = "/admin";
    return null;
  }

  return (
    <>
      <PaymentNotifier />
      <PaymentManager />
    </>
  );
};

export default AdminPayments;
