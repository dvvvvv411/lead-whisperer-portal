
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Kontaktiere uns</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Dein Name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="deine@email.de"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Deine Telefonnummer"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Unternehmen</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Dein Unternehmen"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Nachricht *</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Wie können wir dir helfen?"
            rows={4}
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Wird gesendet..." : "Absenden"}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
