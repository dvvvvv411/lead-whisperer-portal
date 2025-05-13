import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { CheckCircle, ShieldCheck, Lock, Sparkles, Award } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const ContactForm = () => {
  const {
    toast
  } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [errors, setErrors] = useState({
    phone: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear any existing error for the field
    if (name === 'phone' && errors.phone) {
      setErrors(prev => ({ ...prev, phone: "" }));
    }
  };
  
  const validatePhoneNumber = (phone: string): boolean => {
    // Check if phone is empty
    if (!phone.trim()) {
      setErrors(prev => ({ ...prev, phone: "Telefonnummer wird benötigt" }));
      return false;
    }
    
    // Basic validation: phone should be at least 6 characters and contain numbers
    const hasNumbers = /\d/.test(phone);
    if (phone.length < 6 || !hasNumbers) {
      setErrors(prev => ({ ...prev, phone: "Ungültige Telefonnummer" }));
      return false;
    }
    
    // Check if it looks like an email instead of a phone number
    if (phone.includes('@')) {
      setErrors(prev => ({ ...prev, phone: "Bitte geben Sie eine Telefonnummer ein" }));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate phone number
    const isPhoneValid = validatePhoneNumber(formData.phone);
    
    if (!isPhoneValid) {
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Validierung
      if (!formData.name || !formData.email || !formData.phone) {
        toast({
          title: "Fehlerhafte Eingabe",
          description: "Bitte fülle alle Pflichtfelder aus.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Normalize phone number (remove unnecessary spaces, keep only digits, +, -)
      const normalizedPhone = formData.phone.trim().replace(/[^\d+\-\s()]/g, '');

      // Defaultwerte für leere Felder setzen
      const finalData = {
        name: formData.name,
        email: formData.email,
        phone: normalizedPhone,
        status: 'neu',
        company: "Leer",
        message: formData.message || "Leer"
      };

      // In Supabase speichern
      const {
        error
      } = await supabase.from('leads').insert(finalData);
      if (error) {
        console.error("Formular-Fehler:", error);
        throw error;
      }

      // Send confirmation email
      try {
        const emailResponse = await supabase.functions.invoke('send-confirmation-email', {
          body: {
            name: formData.name,
            email: formData.email
          }
        });
        
        if (emailResponse.error) {
          console.error("Email send error:", emailResponse.error);
          // Do not throw here to still show success dialog even if email fails
        } else {
          console.log("Confirmation email sent successfully");
        }
      } catch (emailError) {
        console.error("Error calling email function:", emailError);
        // Continue with form success even if email fails
      }

      // Show success dialog
      setShowSuccessDialog(true);

      // Formular zurücksetzen
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      console.error("Fehler beim Absenden des Formulars:", error);
      toast({
        title: "Etwas ist schiefgelaufen",
        description: "Bitte versuche es später noch einmal.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Dialog Component
  const SuccessDialog = () => {
    const [showConfetti, setShowConfetti] = useState(false);

    // Show confetti effect after dialog opens
    useState(() => {
      const timer = setTimeout(() => setShowConfetti(true), 400);
      return () => clearTimeout(timer);
    });

    // Generate confetti particles
    const renderConfetti = () => {
      if (!showConfetti) return null;
      const particles = Array.from({
        length: 80
      }).map((_, i) => {
        const size = Math.floor(Math.random() * 8) + 5;
        const left = Math.random() * 100;
        const animationDelay = Math.random() * 0.5;
        const color = i % 3 === 0 ? 'bg-gold' : i % 3 === 1 ? 'bg-accent1' : 'bg-white';
        return <div key={i} className={`absolute z-50 rounded-full ${color} animate-confetti`} style={{
          width: size + 'px',
          height: size + 'px',
          left: left + '%',
          animationDelay: animationDelay + 's',
          opacity: Math.random() * 0.8 + 0.2
        }} />;
      });
      return <div className="confetti-container absolute inset-0 overflow-hidden pointer-events-none">{particles}</div>;
    };
    return <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md bg-gradient-to-b from-casino-darker to-casino-card border border-gold/20 shadow-xl overflow-hidden">
          {renderConfetti()}
          
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold via-accent1 to-gold bg-[length:200%_auto] animate-gradient-shift"></div>
          
          <DialogHeader className="relative">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20">
              <div className="absolute inset-0 bg-gradient-to-r from-gold to-accent1 rounded-full opacity-20 animate-pulse"></div>
            </div>
            
            <DialogTitle className="flex items-center justify-center text-xl text-center pt-5">
              <div className="relative bg-gradient-to-r from-gold to-accent1 p-4 rounded-full shadow-glow mb-2">
                <Sparkles className="h-6 w-6 text-black animate-pulse" />
              </div>
            </DialogTitle>
            
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-white">Vielen Dank!</h2>
              <div className="text-3xl font-bold transition-all duration-700 scale-125 text-gold">
                Anfrage erfolgreich
              </div>
            </div>
            
            <DialogDescription className="space-y-5 mt-4">
              <div className="transition-all duration-500 opacity-100 translate-y-0">
                <div className="bg-casino-dark/50 backdrop-blur-sm p-4 rounded-md shadow-inner border border-gold/10">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent1/30 to-gold/30 flex items-center justify-center mr-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <span className="font-medium">Deine Anfrage wurde gesendet</span>
                  </div>
                  
                  <div className="text-sm text-center">
                    <p>Wir werden uns in Kürze bei dir melden, um den nächsten Schritt zu besprechen.</p>
                    <p className="mt-2">Halte dein Telefon bereit für Informationen zu unserer KI-Trading Lösung!</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center transition-all duration-500 delay-300 opacity-100">
                <div className="flex items-center justify-center gap-2">
                  <Award className="h-5 w-5 text-gold animate-pulse" />
                  <span className="text-sm text-gold/90">
                    Du bist nur noch einen Schritt von finanzieller Freiheit entfernt
                  </span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="mt-4">
            <Button onClick={() => setShowSuccessDialog(false)} className="w-full bg-gradient-to-r from-gold to-accent1 hover:from-gold hover:to-gold text-black font-medium transition-all duration-300">
              Schließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>;
  };
  return <div className="w-full max-w-md mx-auto">
      {/* Show success dialog */}
      {showSuccessDialog && <SuccessDialog />}
      
      {/* Logo added above the motivational text */}
      <motion.div initial={{
      opacity: 0,
      y: -10
    }} animate={{
      opacity: 1,
      y: 0
    }} className="flex justify-center mb-4">
        <img alt="KI-Trading Logo" className="h-14 object-contain" src="https://i.imgur.com/Q191f5z.png" />
      </motion.div>
      
      {/* Motivational text section */}
      <motion.div initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.2
    }} className="mb-6 p-4 rounded-lg bg-gradient-to-br from-gold/10 to-accent1/10 border border-gold/20">
        <h3 className="text-xl font-bold text-center bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent mb-2">
          Jetzt mit KI-Trading starten!
        </h3>
        <p className="text-white text-center font-medium mb-1">Bis zu 30% Gewinn monatlich</p>
        <p className="text-gray-300 text-sm text-center">
          Unser KI-Bot analysiert automatisch Marktdaten und führt profitable Trades für dich durch. Einmalig 250€ Aktivierungsgebühr, die als Trading-Guthaben verwendet wird.
        </p>
      </motion.div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div className="space-y-2" initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.1
      }}>
          <Label htmlFor="name" className="text-white">Dein Name *</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Dein vollständiger Name" required className="bg-black/30 border-gold/30 text-white placeholder:text-gray-400 focus:border-gold focus:ring-1 focus:ring-gold/50" />
        </motion.div>
        
        <motion.div className="space-y-2" initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.2
      }}>
          <Label htmlFor="email" className="text-white">E-Mail *</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Deine E-Mail Adresse" required className="bg-black/30 border-gold/30 text-white placeholder:text-gray-400 focus:border-gold focus:ring-1 focus:ring-gold/50" />
        </motion.div>
        
        <motion.div className="space-y-2" initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.3
      }}>
          <Label htmlFor="phone" className="text-white">Telefon *</Label>
          <Input 
            id="phone" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="Deine Telefonnummer" 
            required 
            className={`bg-black/30 border-gold/30 text-white placeholder:text-gray-400 focus:border-gold focus:ring-1 focus:ring-gold/50 ${errors.phone ? 'border-red-500' : ''}`} 
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </motion.div>
        
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.6
      }} whileHover={{
        scale: 1.03
      }} className="pt-4">
          <Button type="submit" className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-black font-medium py-6" disabled={isSubmitting}>
            {isSubmitting ? "Wird gesendet..." : "Jetzt Zugang sichern"}
          </Button>
        </motion.div>
        
        {/* Security reassurance section */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.8
      }} className="mt-6">
          <div className="flex flex-col items-center space-y-3 py-4 border-t border-white/10">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center p-2 bg-white/5 rounded-full">
                <ShieldCheck className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex items-center p-2 bg-white/5 rounded-full">
                <Lock className="w-5 h-5 text-gold" />
              </div>
            </div>
            <p className="text-sm text-center text-gray-300">
              Deine Daten werden sicher verarbeitet und nicht an Dritte weitergegeben
            </p>
            <div className="flex items-center justify-center gap-2 bg-green-500/10 px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-xs text-green-400 font-medium">Risikofrei starten – Keine Vorabkosten</p>
            </div>
          </div>
        </motion.div>
      </form>
    </div>;
};

export default ContactForm;
