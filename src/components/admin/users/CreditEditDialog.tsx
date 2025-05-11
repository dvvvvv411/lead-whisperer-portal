
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { addCreditToUser } from "@/utils/adminUtils";

interface CreditEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userEmail: string;
  currentCredit: number;
  onCreditUpdated: () => void;
}

export const CreditEditDialog = ({ 
  isOpen, 
  onClose, 
  userId, 
  userEmail, 
  currentCredit, 
  onCreditUpdated 
}: CreditEditDialogProps) => {
  const { toast } = useToast();
  const [newCredit, setNewCredit] = useState(currentCredit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (newCredit < 0) {
      toast({
        title: "Ungültiger Wert",
        description: "Das Guthaben kann nicht negativ sein.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      console.log(`Current credit: ${currentCredit}, New credit: ${newCredit}`);
      
      // Calculate the difference to add (can be negative for reductions)
      const creditDifference = newCredit - currentCredit;
      console.log(`Adding difference of ${creditDifference}€ to user ${userId}`);
      
      const success = creditDifference !== 0 
        ? await addCreditToUser(userId, creditDifference) 
        : true; // If no change, consider it successful
      
      if (success) {
        toast({
          title: "Guthaben aktualisiert",
          description: `Das Guthaben für ${userEmail} wurde aktualisiert.`
        });
        onCreditUpdated();
        onClose();
      } else {
        throw new Error("Fehler beim Aktualisieren des Guthabens");
      }
    } catch (error: any) {
      console.error("Error setting credit:", error);
      toast({
        title: "Fehler",
        description: `Das Guthaben konnte nicht aktualisiert werden: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Guthaben bearbeiten</DialogTitle>
          <DialogDescription>
            Aktualisieren Sie das Guthaben für den Benutzer {userEmail}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user" className="text-right">
              Benutzer
            </Label>
            <div className="col-span-3">
              <Input id="user" value={userEmail} readOnly disabled />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="credit" className="text-right">
              Guthaben (€)
            </Label>
            <div className="col-span-3">
              <Input
                id="credit"
                type="number"
                value={newCredit}
                onChange={(e) => setNewCredit(Number(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Wird gespeichert..." : "Speichern"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
