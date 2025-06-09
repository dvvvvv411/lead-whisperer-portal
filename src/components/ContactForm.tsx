
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  invitationCode: string;
}

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    invitationCode: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Check for invite parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get('invite');
    if (inviteCode) {
      setFormData(prev => ({
        ...prev,
        invitationCode: inviteCode
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte füllen Sie mindestens Name und E-Mail aus.",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Ungültige E-Mail",
        description: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          company: formData.company.trim() || null,
          message: formData.message.trim() || null,
          invitation_code: formData.invitationCode.trim() || null,
          source_url: window.location.href,
          status: 'neu'
        }])
        .select('id')
        .single();

      if (error) throw error;

      console.log('Lead created successfully:', data);
      
      setIsSubmitted(true);
      
      toast({
        title: "Vielen Dank!",
        description: "Ihre Anfrage wurde erfolgreich übermittelt. Wir melden uns in Kürze bei Ihnen.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        invitationCode: formData.invitationCode // Keep invitation code if it was pre-filled
      });

    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Fehler",
        description: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <Card className="bg-casino-card border-gold/20 text-center">
          <CardContent className="pt-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Erfolgreich gesendet!</h3>
            <p className="text-gray-300 mb-4">
              Vielen Dank für Ihr Interesse. Unser Team wird sich innerhalb von 24 Stunden bei Ihnen melden.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="bg-gold hover:bg-gold/90 text-casino-darker"
            >
              Weitere Anfrage senden
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="max-w-lg mx-auto bg-casino-card border-gold/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-gold" />
          Jetzt Zugang anfragen
        </CardTitle>
        <CardDescription className="text-gray-300">
          Werden Sie Teil der Zukunft des Krypto-Investments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="bg-casino-darker border-gold/30 text-white"
                placeholder="Ihr vollständiger Name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">E-Mail *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-casino-darker border-gold/30 text-white"
                placeholder="ihre@email.de"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">Telefon</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="bg-casino-darker border-gold/30 text-white"
                placeholder="+49 123 456 789"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-white">Unternehmen</Label>
              <Input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                className="bg-casino-darker border-gold/30 text-white"
                placeholder="Ihr Unternehmen"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invitationCode" className="text-white">
              Einladungscode 
              <span className="text-gold ml-1">(Optional)</span>
            </Label>
            <Input
              id="invitationCode"
              name="invitationCode"
              type="text"
              value={formData.invitationCode}
              onChange={handleChange}
              className="bg-casino-darker border-gold/30 text-white font-mono"
              placeholder="Haben Sie einen Einladungscode?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-white">Nachricht</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="bg-casino-darker border-gold/30 text-white min-h-[100px]"
              placeholder="Erzählen Sie uns von Ihrem Interesse an KI-gesteuerten Krypto-Investments..."
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gold hover:bg-gold/90 text-casino-darker font-semibold py-6 text-lg transition-all duration-200 hover:scale-105"
          >
            {isSubmitting ? (
              "Wird gesendet..."
            ) : (
              <>
                Zugang anfragen
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            * Pflichtfelder. Ihre Daten werden vertraulich behandelt.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
