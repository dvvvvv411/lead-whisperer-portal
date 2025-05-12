
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { CheckCircle, ShieldCheck, Lock } from "lucide-react";

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
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
      
      // In Supabase speichern - message ist jetzt optional in der Datenbank
      const { error } = await supabase
        .from('leads')
        .insert({
          name: formData.name,
          email: formData.email, 
          phone: formData.phone,
          status: 'neu',
          message: null // Nachricht wird als null gesendet
        });
        
      if (error) {
        console.error("Formular-Fehler:", error);
        throw error;
      }

      toast({
        title: "Anfrage erhalten!",
        description: "Vielen Dank für deine Anfrage. Wir werden uns bald bei dir melden.",
      });
      
      setIsSuccess(true);
      
      // Formular zurücksetzen
      setFormData({
        name: "",
        email: "",
        phone: ""
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

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-full text-center p-6"
      >
        <div className="mb-6 bg-green-500/20 rounded-full p-4">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">Anfrage erfolgreich gesendet!</h3>
        <p className="text-gray-300 mb-6">Wir werden uns in Kürze bei dir melden.</p>
        <Button 
          onClick={() => setIsSuccess(false)}
          className="bg-gradient-to-r from-gold to-gold-light text-black font-medium"
        >
          Zurück zum Formular
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo added above the motivational text */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mb-4"
      >
        <img 
          src="/logo.png" 
          alt="KI-Trading Logo" 
          className="h-16 object-contain"
        />
      </motion.div>
      
      {/* Motivational text section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 p-4 rounded-lg bg-gradient-to-br from-gold/10 to-accent1/10 border border-gold/20"
      >
        <h3 className="text-xl font-bold text-center bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent mb-2">
          Jetzt mit KI-Trading starten!
        </h3>
        <p className="text-white text-center font-medium mb-1">Bis zu 20% Gewinn täglich</p>
        <p className="text-gray-300 text-sm text-center">
          Unser KI-Bot analysiert automatisch Marktdaten und führt profitable Trades für dich durch.
        </p>
      </motion.div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label htmlFor="name" className="text-white">Dein Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Dein vollständiger Name"
            required
            className="bg-black/30 border-gold/30 text-white placeholder:text-gray-400 focus:border-gold focus:ring-1 focus:ring-gold/50"
          />
        </motion.div>
        
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label htmlFor="email" className="text-white">E-Mail *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="deine@email.de"
            required
            className="bg-black/30 border-gold/30 text-white placeholder:text-gray-400 focus:border-gold focus:ring-1 focus:ring-gold/50"
          />
        </motion.div>
        
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label htmlFor="phone" className="text-white">Telefon *</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Deine Telefonnummer"
            required
            className="bg-black/30 border-gold/30 text-white placeholder:text-gray-400 focus:border-gold focus:ring-1 focus:ring-gold/50"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.03 }}
          className="pt-4" 
        >
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-black font-medium py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Wird gesendet..." : "Jetzt Zugang sichern"}
          </Button>
        </motion.div>
        
        {/* Security reassurance section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6"
        >
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
    </div>
  );
};

export default ContactForm;
