
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      if (!formData.name || !formData.email || !formData.message) {
        toast({
          title: "Fehlerhafte Eingabe",
          description: "Bitte fülle alle Pflichtfelder aus.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // In Supabase speichern
      const { error } = await supabase
        .from('leads')
        .insert([
          { 
            name: formData.name,
            email: formData.email, 
            phone: formData.phone,
            company: formData.company,
            message: formData.message,
            status: 'neu'
          }
        ]);
        
      if (error) {
        throw error;
      }

      toast({
        title: "Anfrage erhalten!",
        description: "Vielen Dank für deine Nachricht. Wir werden uns bald bei dir melden.",
      });
      
      // Formular zurücksetzen
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
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

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">Kontaktiere uns</h2>
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
          className="space-y-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Label htmlFor="company" className="text-white">Unternehmen</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Dein Unternehmen (optional)"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-gold/70"
          />
        </motion.div>
        
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Label htmlFor="message" className="text-white">Nachricht *</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Wie können wir dir helfen?"
            rows={4}
            required
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
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xs text-center text-gray-400 mt-4"
        >
          Durch Absenden des Formulars stimmst du unserer Datenschutzerklärung zu.
        </motion.p>
      </form>
    </div>
  );
};

export default ContactForm;
