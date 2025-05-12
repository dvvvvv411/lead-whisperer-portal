
import { useState } from "react";
import AuthLogo from "@/components/auth/AuthLogo";
import SecurityVisual from "@/components/auth/SecurityVisual";
import BoxConnector from "@/components/auth/BoxConnector";
import LoginForm from "@/components/auth/LoginForm";
import PasswordResetDialog from "@/components/auth/PasswordResetDialog";
import { motion } from "framer-motion";

const Auth = () => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-casino-darker flex flex-col items-center justify-center p-4">
      {/* Logo at the top */}
      <AuthLogo />
      
      {/* Main content with two connected boxes */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-casino-dark rounded-2xl overflow-hidden shadow-2xl border border-gold/10">
        {/* Left Box - Security Visual */}
        <SecurityVisual />

        {/* Center connector - visual element to connect the boxes */}
        <BoxConnector />

        {/* Right Box - Login Form */}
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
