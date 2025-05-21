
import { useState, useEffect } from "react";
import AdminLegalInfo from "./AdminLegalInfo";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AdminRechtstexte = () => {
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
          console.error("Error checking user or no user found:", error);
          navigate("/admin");
          return;
        }
        
        // Allow access for specific admin user by ID (054c7ee0...) or non-restricted users
        const userId = data.user.id;
        const isSpecialAccess = userId === "054c7ee0-7f82-4e34-a0c0-45552f6a67f8";
        const isRestrictedUser = userId === "7eccf781-5911-4d90-a683-1df251069a2f";
        
        if (isSpecialAccess || !isRestrictedUser) {
          console.log(`Access granted to legal texts for user with ID: ${userId}`);
          setIsAllowed(true);
        } else {
          console.log(`Access denied to legal texts for user with ID: ${userId}`);
          navigate("/admin");
        }
      } catch (err) {
        console.error("Unexpected error during access check:", err);
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };
    
    checkAccess();
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

  return isAllowed ? <AdminLegalInfo /> : null;
};

export default AdminRechtstexte;
