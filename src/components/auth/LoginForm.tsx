
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Key, Mail, ArrowRight, UserPlus, Gift } from "lucide-react";

interface LoginFormProps {
  onResetPassword: () => void;
}

const LoginForm = ({ onResetPassword }: LoginFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [affiliateCode, setAffiliateCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isRegisterMode) {
        // Registration flow
        if (password !== confirmPassword) {
          throw new Error("Passwörter stimmen nicht überein");
        }

        if (password.length < 6) {
          throw new Error("Passwort muss mindestens 6 Zeichen lang sein");
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/nutzer`
          }
        });
        
        if (error) throw error;
        
        if (data.user) {
          // Add user role after successful registration
          try {
            const { error: roleError } = await supabase.rpc('add_user_role', {
              _user_id: data.user.id,
              _role: 'user'
            });
            
            if (roleError) {
              console.error("Error adding user role:", roleError);
              // Don't throw here as the user is already created
            }
          } catch (roleError) {
            console.error("Error adding user role:", roleError);
          }

          // Process affiliate code if provided
          if (affiliateCode.trim()) {
            try {
              console.log("Processing affiliate invitation with code:", affiliateCode.trim());
              const { data: affiliateResult, error: affiliateError } = await supabase.rpc('process_affiliate_invitation', {
                invited_user_id_param: data.user.id,
                affiliate_code_param: affiliateCode.trim().toUpperCase()
              });

              if (affiliateError) {
                console.error("Affiliate processing error:", affiliateError);
                // Don't fail registration, just show a warning
                toast({
                  title: "Registrierung erfolgreich",
                  description: "Ihr Konto wurde erstellt, aber der Affiliate-Code konnte nicht verarbeitet werden. Bitte überprüfen Sie Ihre E-Mail für die Bestätigung.",
                  variant: "default"
                });
              } else if (affiliateResult?.success) {
                toast({
                  title: "Registrierung erfolgreich",
                  description: "Herzlichen Glückwunsch! Sie haben 50€ Bonus erhalten. Bitte überprüfen Sie Ihre E-Mail für die Bestätigung.",
                });
              } else {
                toast({
                  title: "Registrierung erfolgreich", 
                  description: `Ihr Konto wurde erstellt, aber: ${affiliateResult?.message || 'Affiliate-Code ungültig'}. Bitte überprüfen Sie Ihre E-Mail für die Bestätigung.`,
                  variant: "default"
                });
              }
            } catch (affiliateError) {
              console.error("Error processing affiliate code:", affiliateError);
              toast({
                title: "Registrierung erfolgreich",
                description: "Ihr Konto wurde erstellt. Bitte überprüfen Sie Ihre E-Mail für die Bestätigung.",
              });
            }
          } else {
            toast({
              title: "Registrierung erfolgreich",
              description: "Bitte überprüfen Sie Ihre E-Mail für die Bestätigung.",
            });
          }
        }
        
        // Reset form
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAffiliateCode("");
        setIsRegisterMode(false);
        
      } else {
        // Login flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        if (data.user) {
          // Check if user is admin
          const { data: adminRoleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.user.id)
            .eq('role', 'admin')
            .maybeSingle();
          
          const isAdmin = !!adminRoleData;
          
          toast({
            title: "Erfolgreich angemeldet",
            description: "Du wirst weitergeleitet...",
          });
          
          // Navigate based on user role
          if (isAdmin) {
            navigate("/admin");
          } else {
            navigate("/nutzer");
          }
        }
      }
      
    } catch (error: any) {
      console.error(isRegisterMode ? "Registration error:" : "Login error:", error);
      toast({
        title: isRegisterMode ? "Registrierung fehlgeschlagen" : "Anmeldung fehlgeschlagen",
        description: error.message || "Ein Fehler ist aufgetreten.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAffiliateCode("");
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gold/20 to-accent1/20 flex items-center justify-center">
              {isRegisterMode ? (
                <UserPlus className="h-8 w-8 text-gold" />
              ) : (
                <ShieldCheck className="h-8 w-8 text-gold" />
              )}
            </div>
          </div>

          <motion.h2 
            key={isRegisterMode ? "register" : "login"}
            custom={0}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-2xl font-bold text-center text-white mb-6"
          >
            {isRegisterMode ? "Registrieren" : "Anmelden"}
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
                minLength={6}
              />
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </motion.div>

          {isRegisterMode && (
            <>
              <motion.div
                custom={3}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                <Label htmlFor="confirmPassword" className="text-gray-300">Passwort bestätigen</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 bg-casino-darker border-gold/30 text-white"
                    required
                    minLength={6}
                  />
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </motion.div>

              <motion.div
                custom={4}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                <Label htmlFor="affiliateCode" className="text-gray-300">
                  Einladungscode (optional)
                </Label>
                <div className="relative">
                  <Input
                    id="affiliateCode"
                    type="text"
                    value={affiliateCode}
                    onChange={(e) => setAffiliateCode(e.target.value.toUpperCase())}
                    className="pl-10 bg-casino-darker border-gold/30 text-white placeholder:text-gray-500"
                    placeholder="Z.B. ABC12345"
                    maxLength={8}
                  />
                  <Gift className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  Mit einem Einladungscode erhalten Sie 50€ Startbonus!
                </p>
              </motion.div>
            </>
          )}

          <motion.div
            custom={isRegisterMode ? 5 : 3}
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
                  <span className="animate-spin mr-2">⟳</span> 
                  {isRegisterMode ? "Registrierung läuft..." : "Anmelden..."}
                </span>
              ) : (
                <span className="flex items-center">
                  {isRegisterMode ? "Registrieren" : "Anmelden"} 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </motion.div>

          <motion.div
            custom={isRegisterMode ? 6 : 4}
            variants={fadeIn}
            initial="hidden"
            animate="visible" 
            className="text-center space-y-2"
          >
            <button
              type="button"
              onClick={toggleMode}
              className="text-gold/80 hover:text-gold text-sm block w-full"
            >
              {isRegisterMode ? "Bereits ein Konto? Jetzt anmelden" : "Noch kein Konto? Jetzt registrieren"}
            </button>
            
            {!isRegisterMode && (
              <button
                type="button"
                onClick={onResetPassword}
                className="text-gold/60 hover:text-gold/80 text-xs"
              >
                Passwort vergessen?
              </button>
            )}
          </motion.div>

          <motion.div
            custom={isRegisterMode ? 7 : 5}
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
