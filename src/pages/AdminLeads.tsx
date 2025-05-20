
import { useEffect, useState } from "react";
import LeadTable from "@/components/admin/LeadTable";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const AdminLeads = () => {
  const { user, authLoading } = useAdminAuth();
  const [isLeadsOnly, setIsLeadsOnly] = useState<boolean>(false);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  // Check for access when user data is available
  useEffect(() => {
    const checkAccess = async () => {
      if (user) {
        // Allow access for the specific user ID
        if (user.id === "7eccf781-5911-4d90-a683-1df251069a2f") {
          setIsAllowed(true);
          setIsLeadsOnly(false); // Now this user has expanded access
          return;
        }
        
        // Check if user has admin role
        const { data: isAdmin } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });
        
        setIsAllowed(isAdmin || false);
      }
    };
    
    checkAccess();
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-casino-darker text-gray-300">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="animate-pulse flex flex-col items-center"
        >
          <div className="h-12 w-12 bg-blue-500/20 rounded-full mb-4 flex items-center justify-center">
            <div className="h-6 w-6 bg-blue-500/60 rounded-full animate-ping"></div>
          </div>
          <p>Wird geladen...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAllowed && !authLoading) {
    window.location.href = "/admin";
    return null;
  }

  // If user has access, show the lead table
  return <LeadTable />;
};

export default AdminLeads;
