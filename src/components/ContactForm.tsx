
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Send, User, Mail, Phone, Building, MessageSquare } from "lucide-react";
import AffiliateCodeInput from "@/components/affiliate/AffiliateCodeInput";

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    affiliateCode: ""
  });

  // Get affiliate code from URL on component mount
  useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setFormData(prev => ({ ...prev, affiliateCode: refCode }));
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAffiliateCodeChange = (value: string) => {
    setFormData({
      ...formData,
      affiliateCode: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('leads')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            company: formData.company || null,
            message: formData.message || null,
            affiliate_code: formData.affiliateCode || null,
            source_url: window.location.href
          }
        ]);

      if (error) throw error;

      toast({
        title: "Nachricht gesendet!",
        description: "Vielen Dank für Ihre Nachricht. Wir melden uns schnellstmöglich bei Ihnen.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        affiliateCode: formData.affiliateCode // Keep affiliate code if it came from URL
      });

    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Fehler beim Senden",
        description: "Es gab einen Fehler beim Senden Ihrer Nachricht. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial="hidden"
      animate="visible"
    >
      <motion.div custom={0} variants={fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">Name *</Label>
          <div className="relative">
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="pl-10 bg-casino-dark border-gold/30 text-white"
              placeholder="Ihr vollständiger Name"
            />
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">E-Mail *</Label>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="pl-10 bg-casino-dark border-gold/30 text-white"
              placeholder="ihre@email.de"
            />
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </motion.div>

      <motion.div custom={1} variants={fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-white">Telefon</Label>
          <div className="relative">
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="pl-10 bg-casino-dark border-gold/30 text-white"
              placeholder="+49 123 456789"
            />
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-white">Unternehmen</Label>
          <div className="relative">
            <Input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              className="pl-10 bg-casino-dark border-gold/30 text-white"
              placeholder="Ihr Unternehmen"
            />
            <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </motion.div>

      <motion.div custom={2} variants={fadeIn}>
        <AffiliateCodeInput
          value={formData.affiliateCode}
          onChange={handleAffiliateCodeChange}
        />
      </motion.div>

      <motion.div custom={3} variants={fadeIn} className="space-y-2">
        <Label htmlFor="message" className="text-white">Nachricht</Label>
        <div className="relative">
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="pl-10 pt-10 bg-casino-dark border-gold/30 text-white resize-none"
            placeholder="Beschreiben Sie Ihr Anliegen..."
          />
          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
      </motion.div>

      <motion.div custom={4} variants={fadeIn}>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-black font-medium"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2">⟳</span>
              Wird gesendet...
            </span>
          ) : (
            <span className="flex items-center">
              Nachricht senden
              <Send className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default ContactForm;
