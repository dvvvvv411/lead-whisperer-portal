
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
        // Allow access for specific admin users by ID
        if (user.id === "7eccf781-5911-4d90-a683-1df251069a2f" || 
            user.id === "054c7ee0-7f82-4e34-a0c0-45552f6a67f8") {
          console.log(`Access granted to leads for user with ID: ${user.id}`);
          setIsAllowed(true);
          setIsLeadsOnly(false);
          return;
        }
        
        // Check if user has admin role
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
    console.log("Access denied to leads page, redirecting to admin");
    window.location.href = "/admin";
    return null;
  }

  // If user has access, show the lead table
  return <LeadTable />;
};

export default AdminLeads;
