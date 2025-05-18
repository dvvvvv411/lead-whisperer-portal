
import { useEffect, useState } from "react";
import LeadTable from "@/components/admin/LeadTable";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const AdminLeads = () => {
  const { user, authLoading } = useAdminAuth();
  const [isLeadsOnly, setIsLeadsOnly] = useState<boolean>(false);

  // Check for leads_only role when user data is available
  useEffect(() => {
    const checkRole = async () => {
      if (user) {
        // Check if user has leads_only restriction
        const { data: leadsOnlyData, error } = await supabase.rpc('is_leads_only_user', {
          user_id_param: user.id
        });
        
        if (!error && leadsOnlyData) {
          setIsLeadsOnly(leadsOnlyData);
        }
      }
    };
    
    checkRole();
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

  // If user is admin or isLeadsOnly, show the lead table
  return <LeadTable />;
};

export default AdminLeads;
