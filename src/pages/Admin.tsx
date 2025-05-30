
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { checkUserRole } from "@/services/roleService";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isUser, setIsUser] = useState<boolean | null>(null);
  const [isLeadsOnly, setIsLeadsOnly] = useState<boolean>(false);

  useEffect(() => {
    console.log("Admin page mounting, checking session...");
    
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Fehler beim Abrufen der Session:", error);
          setLoading(false);
          // Redirect to auth page if no session or error
          navigate("/auth");
          return;
        }
        
        console.log("Session check result:", data.session ? "Session found" : "No session");
        setSession(data.session);
        
        // If user is logged in, check if they are admin or user
        if (data.session) {
          console.log("User is logged in, checking roles...");
          
          // Special handling for specific admin users by ID
          if (data.session.user.id === "7eccf781-5911-4d90-a683-1df251069a2f" || 
              data.session.user.id === "054c7ee0-7f82-4e34-a0c0-45552f6a67f8") {
            console.log(`Admin user detected (ID: ${data.session.user.id})`);
            setIsAdmin(true);
            setIsUser(true);
            setLoading(false);
            return;
          }
          
          // Standard role check
          try {
            const adminCheck = await checkUserRole('admin');
            const userCheck = await checkUserRole('user');
            console.log("Role check results - Admin:", adminCheck, "User:", userCheck);
            setIsAdmin(adminCheck);
            setIsUser(userCheck);
          } catch (error) {
            console.error("Error checking user roles:", error);
            setIsAdmin(false);
            setIsUser(false);
          }
          
          // Check if user has leads_only restriction
          try {
            const { data: leadsOnlyData, error: leadsOnlyError } = await supabase.rpc('is_leads_only_user', {
              user_id_param: data.session.user.id
            });
            
            if (leadsOnlyError) {
              console.error("Error checking leads_only role:", leadsOnlyError);
            } else {
              setIsLeadsOnly(!!leadsOnlyData);
              console.log("Leads-only check:", leadsOnlyData ? "Is leads-only" : "Not leads-only");
            }
          } catch (error) {
            console.error("Unexpected error checking leads_only:", error);
          }
        } else {
          // No session found, redirect to auth page
          console.log("No session found, redirecting to auth page");
          navigate("/auth");
          return;
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Unexpected error during session check:", err);
        setLoading(false);
        navigate("/auth");
      }
    };
    
    checkSession();
    
    // Auth state change monitoring
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event);
      setSession(newSession);
      
      if (newSession) {
        console.log("New session detected, checking roles");
        
        // Special handling for specific admin users by ID
        if (newSession.user.id === "7eccf781-5911-4d90-a683-1df251069a2f" || 
            newSession.user.id === "054c7ee0-7f82-4e34-a0c0-45552f6a67f8") {
          console.log(`Admin user detected in auth change (ID: ${newSession.user.id})`);
          setIsAdmin(true);
          setIsUser(true);
          return;
        }
        
        try {
          const adminCheck = await checkUserRole('admin');
          const userCheck = await checkUserRole('user');
          console.log("Updated role check - Admin:", adminCheck, "User:", userCheck);
          setIsAdmin(adminCheck);
          setIsUser(userCheck);
        } catch (error) {
          console.error("Error checking user roles:", error);
          setIsAdmin(false);
          setIsUser(false);
        }
        
        // Check if user has leads_only restriction
        try {
          const { data: leadsOnlyData, error: leadsOnlyError } = await supabase.rpc('is_leads_only_user', {
            user_id_param: newSession.user.id
          });
          
          if (leadsOnlyError) {
            console.error("Error checking leads_only role:", leadsOnlyError);
          } else {
            setIsLeadsOnly(!!leadsOnlyData);
          }
        } catch (error) {
          console.error("Unexpected error checking leads_only:", error);
          setIsLeadsOnly(false);
        }
      } else {
        setIsAdmin(null);
        setIsUser(null);
        setIsLeadsOnly(false);
        // Redirect to auth on signout
        navigate("/auth");
      }
    });
    
    return () => {
      console.log("Admin page unmounting, cleaning up subscription");
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-casino-darker text-gray-300">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="animate-pulse flex flex-col items-center"
        >
          <div className="h-12 w-12 bg-gold/20 rounded-full mb-4 flex items-center justify-center">
            <div className="h-6 w-6 bg-gold rounded-full animate-ping"></div>
          </div>
          <p>Wird geladen...</p>
        </motion.div>
      </div>
    );
  }

  // If the user has leads_only role, redirect directly to leads page
  if (isLeadsOnly) {
    console.log("Leads-only user detected, redirecting to leads page");
    navigate("/admin/leads");
    return null;
  }
  // If the user is an admin, show the admin dashboard
  else if (isAdmin) {
    console.log("Displaying admin dashboard");
    return <AdminDashboard />;
  }
  // If the user is a normal activated user, redirect to user dashboard
  else if (isUser) {
    console.log("Redirecting to user dashboard");
    navigate("/nutzer");
    return null;
  }
  // If the user is logged in but not activated, redirect to activation page
  else if (session) {
    console.log("Redirecting to activation page");
    navigate("/nutzer/aktivierung");
    return null;
  }
  
  // If the user is not logged in, they've been redirected to /auth by now
  // This is just a fallback
  navigate("/auth");
  return null;
};

export default Admin;
