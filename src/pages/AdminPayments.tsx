
import { useState, useEffect } from "react";
import { PaymentManager } from "@/components/admin/payments/PaymentManager";
import { motion } from "framer-motion";
import { PaymentNotifier } from "@/components/admin/payments/PaymentNotifier";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";

const AdminPayments = () => {
  const { user, authLoading } = useAdminAuth();
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
        
        // For all other users, check admin role using the has_role function
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });
        
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
          <div className="h-12 w-12 bg-purple-500/20 rounded-full mb-4 flex items-center justify-center">
            <div className="h-6 w-6 bg-purple-500/60 rounded-full animate-ping"></div>
          </div>
          <p>Wird geladen...</p>
        </motion.div>
      </div>
    );
  }

  return isAuthorized ? (
    <>
      <PaymentNotifier />
      <PaymentManager />
    </>
  ) : null;
};

export default AdminPayments;
