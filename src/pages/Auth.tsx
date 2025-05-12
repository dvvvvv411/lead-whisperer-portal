
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Key, Mail, ArrowRight } from "lucide-react";

const Auth = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

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
      
      // Weiterleitung nach erfolgreichem Login - zum /admin
      // Die Admin.tsx wird die weitere Umleitung basierend auf der Benutzerrolle vornehmen
      window.location.href = "/admin";
      
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

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/password-reset`,
      });

      if (error) throw error;

      setResetSent(true);
      toast({
        title: "E-Mail gesendet",
        description: "Überprüfe deinen Posteingang für weitere Anweisungen.",
      });

    } catch (error: any) {
      toast({
        title: "Fehler beim Zurücksetzen",
        description: error.message || "Bitte überprüfe deine E-Mail-Adresse.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants for motion components
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
    <div className="flex flex-col min-h-screen bg-casino-darker">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 text-center"
      >
        <h1 className="text-3xl font-bold text-white">
          Sicherer <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">Anmeldebereich</span>
        </h1>
      </motion.header>

      {/* Main Content - Two Sections */}
      <main className="flex-grow flex flex-col lg:flex-row w-full px-4 py-6 md:p-8">
        {/* Left Section - Animation */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 lg:p-12"
        >
          <LoginAnimation />
        </motion.div>

        {/* Right Section - Login Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full lg:w-1/2 flex justify-center items-center p-4 lg:p-12"
        >
          <Card className="w-full max-w-md bg-casino-dark border-gold/20">
            <CardContent className="pt-6">
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
                    onClick={() => setIsResetModalOpen(true)}
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
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Password Reset Dialog */}
      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogContent className="bg-casino-dark border border-gold/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Passwort zurücksetzen</DialogTitle>
            <DialogDescription className="text-gray-400">
              Gib deine E-Mail-Adresse ein, um einen Link zum Zurücksetzen deines Passworts zu erhalten.
            </DialogDescription>
          </DialogHeader>

          {resetSent ? (
            <div className="py-4">
              <div className="p-4 rounded-md bg-green-900/30 border border-green-500/20 mb-4">
                <p className="text-green-400 flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  E-Mail zum Zurücksetzen des Passworts wurde gesendet
                </p>
              </div>
              <p className="text-gray-300 text-sm">Überprüfe deinen E-Mail Posteingang und folge den Anweisungen zum Zurücksetzen deines Passworts.</p>
              <Button 
                onClick={() => {
                  setIsResetModalOpen(false);
                  setResetSent(false);
                }}
                className="mt-4 w-full bg-gradient-to-r from-gold/80 to-gold-light/80"
              >
                Schließen
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePasswordReset} className="py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">E-Mail</Label>
                  <div className="relative">
                    <Input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="pl-10 bg-casino-darker border-gold/30 text-white"
                      required
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-black font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Wird versendet..." : "Zurücksetzen Link senden"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Login Animation Component
const LoginAnimation = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-6 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-accent1/5 rounded-xl" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-accent1 to-gold bg-[length:200%_auto] animate-gradient-shift" />
        
        {/* Abstract visualization */}
        <div className="relative w-full aspect-square">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <div className="w-full h-full relative">
              <CybersecurityAnimation />
            </div>
          </motion.div>
        </div>
        
        {/* Text overlay */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-8 text-center"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
            Sichere Authentifizierung
          </h2>
          <p className="mt-4 text-gray-400">
            Deine Daten sind bei uns sicher. Unser Anmeldesystem nutzt modernste Verschlüsselungstechnologie.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-2 bg-gold/10 rounded-full"
            >
              <Lock className="h-5 w-5 text-gold" />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-2 bg-accent1/10 rounded-full"
            >
              <ShieldCheck className="h-5 w-5 text-accent1" />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-2 bg-green-500/10 rounded-full"
            >
              <Key className="h-5 w-5 text-green-400" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Cybersecurity Animation Component
const CybersecurityAnimation = () => {
  // Generate random positions for nodes
  const nodes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
    size: Math.random() * 8 + 4,
    pulseDelay: Math.random() * 3
  }));

  return (
    <div className="w-full h-full relative">
      {/* Background circle */}
      <motion.div
        animate={{ 
          boxShadow: [
            "0 0 0 rgba(255, 215, 0, 0.1)",
            "0 0 20px rgba(255, 215, 0, 0.2)",
            "0 0 0 rgba(255, 215, 0, 0.1)"
          ]
        }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute w-4/5 h-4/5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/20"
      />
      
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#64CCC9" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {nodes.map((node, i) => (
          nodes.slice(i + 1).map((target, j) => (
            <motion.line
              key={`line-${i}-${j}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ 
                repeat: Infinity, 
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2
              }}
              x1={`${node.x}%`}
              y1={`${node.y}%`}
              x2={`${target.x}%`}
              y2={`${target.y}%`}
              stroke="url(#lineGradient)"
              strokeWidth="0.5"
            />
          ))
        ))}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute rounded-full bg-gold"
          style={{ 
            left: `${node.x}%`, 
            top: `${node.y}%`, 
            width: `${node.size}px`, 
            height: `${node.size}px`,
            transform: 'translate(-50%, -50%)'
          }}
          animate={{ 
            scale: [1, 1.3, 1],
            boxShadow: [
              "0 0 0 rgba(255, 215, 0, 0)",
              "0 0 10px rgba(255, 215, 0, 0.5)",
              "0 0 0 rgba(255, 215, 0, 0)"
            ] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3, 
            delay: node.pulseDelay
          }}
        />
      ))}

      {/* Central shield icon */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-accent1/20 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ShieldCheck className="h-8 w-8 text-gold" />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, i) => {
        const size = Math.random() * 3 + 1;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;
        
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-gold/30"
            initial={{ 
              left: `${left}%`, 
              top: `${top}%`, 
              width: `${size}px`, 
              height: `${size}px`,
              opacity: 0
            }}
            animate={{ 
              y: [0, -30, 0],
              opacity: [0, 0.5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: duration, 
              delay: delay
            }}
          />
        );
      })}
    </div>
  );
};

export default Auth;
