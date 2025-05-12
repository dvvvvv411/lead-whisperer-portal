
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

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
      if (!formData.name || !formData.email) {
        toast({
          title: "Fehlerhafte Eingabe",
          description: "Bitte fülle alle Pflichtfelder aus.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // In Supabase speichern - fixed to match the required schema
      const { error } = await supabase
        .from('leads')
        .insert({
          name: formData.name,
          email: formData.email, 
          phone: formData.phone,
          status: 'neu',
          message: '' // Adding required message field with empty string
        });
        
      if (error) {
        throw error;
      }

      toast({
        title: "Anfrage erhalten!",
        description: "Vielen Dank für deine Nachricht. Wir werden uns bald bei dir melden.",
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
      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">Starte jetzt mit KI-Trading</h2>
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
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-gold/70"
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
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-gold/70"
          />
        </motion.div>
        
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label htmlFor="phone" className="text-white">Telefon</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Deine Telefonnummer"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-gold/70"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.03 }}
        >
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-black font-medium py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Wird gesendet..." : "Jetzt starten"}
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2 mt-4"
        >
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <p className="text-xs text-gray-400">Alle Daten werden sicher verarbeitet</p>
        </motion.div>
      </form>
    </div>
  );
};

export default ContactForm;
