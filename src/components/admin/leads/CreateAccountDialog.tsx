
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lead } from "@/types/leads";
import { generatePassword } from "@/lib/utils";

interface CreateAccountDialogProps {
  open: boolean;
  onClose: () => void;
  lead: Lead | null;
}

export const CreateAccountDialog = ({ open, onClose, lead }: CreateAccountDialogProps) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form fields with lead data when the dialog opens
  useEffect(() => {
    if (lead && open) {
      setName(lead.name || "");
      setEmail(lead.email || "");
      setPhone(lead.phone || "");
    }
  }, [lead, open]);

  const handleCreateAccount = async () => {
    if (!lead) {
      toast({
        title: "Fehler",
        description: "Kein Lead ausgewählt.",
        variant: "destructive"
      });
      return;
    }
    
    if (!name || !email) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a random password automatically
      const generatedPassword = generatePassword(10);
      
      // Standardmethode für Registrierung statt Admin API verwenden
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: generatedPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/nutzer`
        }
      });
      
      if (authError) throw authError;
      
      console.log("User created:", authData);
      
      if (authData?.user) {
        // Update the lead with any modified data
        const { error: leadUpdateError } = await supabase
          .from('leads')
          .update({ 
            name: name,
            email: email,
            phone: phone,
            status: 'akzeptiert' 
          })
          .eq('id', lead.id);
        
        if (leadUpdateError) throw leadUpdateError;

        // Send welcome email with account details
        try {
          const emailResponse = await supabase.functions.invoke('send-welcome-email', {
            body: {
              name: name,
              email: email,
              password: generatedPassword,
              phone: phone
            }
          });
          
          if (emailResponse.error) {
            console.error("Welcome email error:", emailResponse.error);
            // Continue even if email sending fails
          } else {
            console.log("Welcome email sent successfully");
          }
        } catch (emailError) {
          console.error("Error calling welcome email function:", emailError);
          // Continue even if email sending fails
        }
        
        toast({
          title: "Konto erstellt",
          description: `Ein Konto für ${email} wurde erfolgreich erstellt. Zugangsdaten wurden per E-Mail gesendet.`
        });
        
        onClose();
      }
    } catch (error: any) {
      console.error("Error creating user account:", error);
      toast({
        title: "Fehler beim Erstellen des Kontos",
        description: error.message || "Ein unbekannter Fehler ist aufgetreten.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-casino-dark border-gold/20 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Konto erstellen</DialogTitle>
          <DialogDescription className="text-gray-400">
            Erstellen Sie ein Benutzerkonto für diesen Lead.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-gray-300">
              Name
            </Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3 bg-casino-card border-gold/20 text-gray-200"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right text-gray-300">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3 bg-casino-card border-gold/20 text-gray-200"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right text-gray-300">
              Telefon
            </Label>
            <Input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Optional"
              className="col-span-3 bg-casino-card border-gold/20 text-gray-200"
            />
          </div>
          
          <div className="col-span-4 text-sm text-gray-400 mt-2 bg-casino-darker p-3 rounded-md">
            <p>Ein zufälliges Passwort wird automatisch generiert und per E-Mail an den Benutzer gesendet.</p>
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="border-gold/30 text-gray-300 hover:bg-casino-card hover:text-gray-100"
          >
            Abbrechen
          </Button>
          <Button 
            type="submit" 
            onClick={handleCreateAccount} 
            disabled={isSubmitting}
            className="bg-gold hover:bg-gold/90 text-black"
          >
            {isSubmitting ? "Konto wird erstellt..." : "Konto erstellen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
