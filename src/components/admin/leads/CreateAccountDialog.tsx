
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

// Define the Lead type here instead of importing from LeadTable
interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  status: 'neu' | 'akzeptiert' | 'abgelehnt';
}

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
    if (!lead || !password || password !== confirmPassword) return;
    
    setIsSubmitting(true);
    
    try {
      // Create the user account in Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: lead.email,
        password: password,
        email_confirm: true
      });
      
      if (authError) throw authError;
      
      console.log("User created:", authData);
      
      if (authData?.user) {
        // REMOVED: No longer automatically assigning 'user' role
        // Instead, users will gain access based on their credit amount
        
        // Update the lead status to "account_created"
        const { error: leadError } = await supabase
          .from('leads')
          .update({ status: 'account_created' })
          .eq('id', lead.id);
        
        if (leadError) throw leadError;
        
        toast({
          title: "Konto erstellt",
          description: `Ein Konto für ${lead.email} wurde erfolgreich erstellt. Der Nutzer muss nun eine Aktivierungszahlung vornehmen.`
        });
        
        onClose();
      }
    } catch (error: any) {
      console.error("Error creating user account:", error);
      toast({
        title: "Fehler beim Erstellen des Kontos",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konto erstellen</DialogTitle>
          <DialogDescription>
            Erstellen Sie ein Benutzerkonto für diesen Lead.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              value={lead?.email || ""}
              readOnly
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Passwort
            </Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirmPassword" className="text-right">
              Passwort bestätigen
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Abbrechen
          </Button>
          <Button type="submit" onClick={handleCreateAccount} disabled={isSubmitting}>
            {isSubmitting ? "Konto wird erstellt..." : "Konto erstellen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
