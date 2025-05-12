
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Key, Mail, ArrowRight } from "lucide-react";

interface LoginFormProps {
  onResetPassword: () => void;
}

const LoginForm = ({ onResetPassword }: LoginFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Erfolgreich angemeldet",
        description: "Du wirst weitergeleitet...",
      });
      
      // Use React Router's navigate instead of window.location for smoother transitions
      navigate("/admin");
      
    } catch (error: any) {
      console.error("Login-Fehler:", error);
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: error.message || "Ungültige Anmeldedaten.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-casino-dark border border-gold/20 rounded-xl shadow-lg p-6">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gold/20 to-accent1/20 flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-gold" />
            </div>
          </div>

          <motion.h2 
            custom={0}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-2xl font-bold text-center text-white mb-6"
          >
            Anmelden
          </motion.h2>

          <motion.div 
            custom={1}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            <Label htmlFor="email" className="text-gray-300">E-Mail</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-casino-darker border-gold/30 text-white"
                required
              />
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeIn}
            initial="hidden"
            animate="visible" 
            className="space-y-2"
          >
            <Label htmlFor="password" className="text-gray-300">Passwort</Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-casino-darker border-gold/30 text-white"
                required
              />
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-black font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⟳</span> Anmelden...
                </span>
              ) : (
                <span className="flex items-center">
                  Anmelden <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </motion.div>

          <motion.div
            custom={4}
            variants={fadeIn}
            initial="hidden"
            animate="visible" 
            className="text-center"
          >
            <button
              type="button"
              onClick={onResetPassword}
              className="text-gold/80 hover:text-gold text-sm"
            >
              Passwort vergessen?
            </button>
          </motion.div>

          <motion.div
            custom={5}
            variants={fadeIn}
            initial="hidden"
            animate="visible" 
            className="mt-8 pt-6 border-t border-gold/10"
          >
            <div className="flex items-center justify-center gap-2 p-3 bg-casino-darker/50 rounded-lg">
              <Key className="h-4 w-4 text-green-400" />
              <span className="text-xs text-gray-400">
                Gesicherte Verbindung mit 256-bit Verschlüsselung
              </span>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
