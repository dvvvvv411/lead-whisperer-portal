
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLogo from "@/components/auth/AuthLogo";
import SecurityVisual from "@/components/auth/SecurityVisual";
import BoxConnector from "@/components/auth/BoxConnector";
import LoginForm from "@/components/auth/LoginForm";
import PasswordResetDialog from "@/components/auth/PasswordResetDialog";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const navigate = useNavigate();

  // Check if user is already authenticated and redirect accordingly
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      
      if (data?.user) {
        // Check if user is admin
        const { data: adminRoleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .eq('role', 'admin')
          .maybeSingle();
        
        const isAdmin = !!adminRoleData;
        
        // Redirect based on user role
        if (isAdmin) {
          navigate('/admin');
        } else {
          navigate('/nutzer');
        }
      }
    };
    
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-casino-darker flex flex-col items-center justify-center p-4">
      {/* Logo at the top with back button */}
      <AuthLogo />
      
      {/* Main content with two connected boxes */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-casino-dark rounded-2xl overflow-hidden shadow-2xl border border-gold/10">
        {/* Left Box - Security Visual */}
        <SecurityVisual />

        {/* Center connector - visual element to connect the boxes */}
        <BoxConnector />

        {/* Right Box - Login/Register Form */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-1/2 flex justify-center items-center p-8 bg-casino-darker"
        >
          <LoginForm onResetPassword={() => setIsResetModalOpen(true)} />
        </motion.div>
      </div>

      {/* Password Reset Dialog */}
      <PasswordResetDialog 
        open={isResetModalOpen} 
        onOpenChange={setIsResetModalOpen} 
      />
    </div>
  );
};

export default Auth;
