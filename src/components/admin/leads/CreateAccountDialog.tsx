
import { useState } from "react";
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

interface CreateAccountDialogProps {
  open: boolean;
  onClose: () => void;
  lead: Lead | null;
}

export const CreateAccountDialog = ({ open, onClose, lead }: CreateAccountDialogProps) => {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateAccount = async () => {
    if (!lead || !password || password !== confirmPassword) {
      if (!lead) {
        toast({
          title: "Fehler",
          description: "Kein Lead ausgewählt.",
          variant: "destructive"
        });
      } else if (!password) {
        toast({
          title: "Fehler",
          description: "Bitte geben Sie ein Passwort ein.",
          variant: "destructive"
        });
      } else if (password !== confirmPassword) {
        toast({
          title: "Fehler",
          description: "Die Passwörter stimmen nicht überein.",
          variant: "destructive"
        });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Standardmethode für Registrierung statt Admin API verwenden
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: lead.email,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/nutzer`
        }
      });
      
      if (authError) throw authError;
      
      console.log("User created:", authData);
      
      if (authData?.user) {
        // Update the lead status to "akzeptiert"
        const { error: leadError } = await supabase
          .from('leads')
          .update({ status: 'akzeptiert' })
          .eq('id', lead.id);
        
        if (leadError) throw leadError;
        
        toast({
          title: "Konto erstellt",
          description: `Ein Konto für ${lead.email} wurde erfolgreich erstellt. Eine Bestätigungsmail wurde an den Nutzer gesendet.`
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
            <Label htmlFor="email" className="text-right text-gray-300">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              value={lead?.email || ""}
              readOnly
              className="col-span-3 bg-casino-card border-gold/20 text-gray-200"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right text-gray-300">
              Passwort
            </Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3 bg-casino-card border-gold/20 text-gray-200"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirmPassword" className="text-right text-gray-300">
              Passwort bestätigen
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="col-span-3 bg-casino-card border-gold/20 text-gray-200"
            />
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
