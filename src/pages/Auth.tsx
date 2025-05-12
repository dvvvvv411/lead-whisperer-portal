
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
    <div className="min-h-screen bg-casino-darker flex">
      <main className="w-full flex flex-row">
        {/* Left Section - Simple secure icon display instead of complex animation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="w-1/2 flex flex-col justify-center items-center p-8 bg-casino-dark border-r border-gold/10"
        >
          <div className="flex flex-col items-center justify-center h-full w-full">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="p-12 rounded-full bg-gradient-to-br from-gold/10 to-accent1/10 flex items-center justify-center"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, 0, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  duration: 8
                }}
              >
                <ShieldCheck className="h-24 w-24 text-gold" />
              </motion.div>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-8 text-2xl font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent"
            >
              Sichere Authentifizierung
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="mt-4 text-gray-400 text-center max-w-sm"
            >
              Deine Daten sind bei uns sicher. Unser Anmeldesystem nutzt modernste Verschlüsselungstechnologie.
            </motion.p>
              
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="mt-8 flex justify-center space-x-6"
            >
              <motion.div whileHover={{ scale: 1.1 }} className="p-3 bg-gold/10 rounded-full">
                <Lock className="h-5 w-5 text-gold" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} className="p-3 bg-accent1/10 rounded-full">
                <ShieldCheck className="h-5 w-5 text-accent1" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} className="p-3 bg-green-500/10 rounded-full">
                <Key className="h-5 w-5 text-green-400" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Section - Login Form */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="w-1/2 flex justify-center items-center p-8 bg-casino-darker"
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

export default Auth;
