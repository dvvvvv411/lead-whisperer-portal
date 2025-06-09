
import { useEffect, useState } from "react";
import LeadTable from "@/components/admin/LeadTable";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const AdminLeads = () => {
  const { user, authLoading } = useAdminAuth();
  const [isLeadsOnly, setIsLeadsOnly] = useState<boolean>(false);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Check for access when user data is available
  useEffect(() => {
    const checkAccess = async () => {
      if (user) {
        console.log(`=== AdminLeads Access Check for User ${user.id} ===`);
        console.log('User email:', user.email);
        console.log('User metadata:', user.user_metadata);
        
        let debugMessage = `User ID: ${user.id}\nEmail: ${user.email}\n`;
        
        // Allow access for specific admin users by ID
        if (user.id === "7eccf781-5911-4d90-a683-1df251069a2f" || 
            user.id === "054c7ee0-7f82-4e34-a0c0-45552f6a67f8") {
          console.log(`✅ Access granted to leads for user with ID: ${user.id}`);
          debugMessage += `✅ Special admin access granted for ID: ${user.id}\n`;
          setIsAllowed(true);
          setIsLeadsOnly(false);
          setDebugInfo(debugMessage);
          return;
        }
        
        // Check if user has admin role
        try {
          console.log('Checking admin role with has_role function...');
          const { data: isAdmin, error } = await supabase.rpc('has_role', {
            _user_id: user.id,
            _role: 'admin'
          });
          
          if (error) {
            console.error("❌ Error checking admin role:", error);
            debugMessage += `❌ Role check error: ${error.message}\n`;
            setDebugInfo(debugMessage);
            return;
          }
          
          console.log(`Admin role check result: ${isAdmin ? "✅ Is admin" : "❌ Not admin"}`);
          debugMessage += `Admin role check: ${isAdmin ? "✅ Is admin" : "❌ Not admin"}\n`;
          
          setIsAllowed(isAdmin || false);
          setDebugInfo(debugMessage);
          
        } catch (err) {
          console.error("❌ Exception during role check:", err);
          debugMessage += `❌ Exception: ${err}\n`;
          setDebugInfo(debugMessage);
        }
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
    console.log("❌ Access denied to leads page");
    return (
      <div className="flex justify-center items-center min-h-screen bg-casino-darker text-gray-300">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-8"
        >
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-bold text-red-400 mb-4">Zugriff verweigert</h2>
            <p className="text-gray-300 mb-4">
              Sie haben keine Berechtigung für diese Seite.
            </p>
            <div className="text-left text-sm text-gray-400 bg-casino-card p-4 rounded border">
              <pre className="whitespace-pre-wrap">{debugInfo}</pre>
            </div>
            <button 
              onClick={() => window.location.href = "/admin"}
              className="mt-4 px-4 py-2 bg-gold text-black rounded hover:bg-gold/80 transition-colors"
            >
              Zurück zum Admin-Bereich
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // If user has access, show the lead table
  return <LeadTable />;
};

export default AdminLeads;
