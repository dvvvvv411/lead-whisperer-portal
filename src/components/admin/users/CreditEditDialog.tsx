
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { addCreditToUser } from "@/utils/adminUtils";
import { supabase } from "@/integrations/supabase/client";

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
  currentCredit: initialCredit, 
  onCreditUpdated 
}: CreditEditDialogProps) => {
  const { toast } = useToast();
  const [newCredit, setNewCredit] = useState(initialCredit);
  const [actualCurrentCredit, setActualCurrentCredit] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the most up-to-date credit value directly from the database when the dialog opens
  useEffect(() => {
    if (isOpen && userId) {
      setIsLoading(true);
      const fetchLatestCredit = async () => {
        try {
          console.log(`Fetching latest credit for user ${userId}`);
          const { data, error } = await supabase
            .from('user_credits')
            .select('amount')
            .eq('user_id', userId)
            .single();
          
          if (error) {
            console.error("Error fetching current credit:", error);
            // Fall back to the passed in value if there's an error
            setActualCurrentCredit(initialCredit);
          } else {
            // Convert cents to euros
            const amountInEuros = data ? data.amount / 100 : 0;
            console.log(`Latest credit from DB: ${amountInEuros}€ (${data?.amount || 0} cents)`);
            setActualCurrentCredit(amountInEuros);
            setNewCredit(amountInEuros); // Update the input field with the fresh value
          }
        } catch (error) {
          console.error("Exception fetching current credit:", error);
          setActualCurrentCredit(initialCredit);
        } finally {
          setIsLoading(false);
        }
      };

      fetchLatestCredit();
    }
  }, [isOpen, userId, initialCredit]);

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
      
      // Use the actual fetched current credit for calculation
      const currentCreditForCalc = actualCurrentCredit !== null ? actualCurrentCredit : initialCredit;
      console.log(`Current credit (from DB): ${currentCreditForCalc}€`);
      console.log(`New credit (user input): ${newCredit}€`);
      
      // Calculate the difference to add (can be negative for reductions)
      const creditDifference = newCredit - currentCreditForCalc;
      console.log(`Adding difference of ${creditDifference}€ to user ${userId}`);
      
      const success = creditDifference !== 0 
        ? await addCreditToUser(userId, creditDifference) 
        : true; // If no change, consider it successful
      
      if (success) {
        toast({
          title: "Guthaben aktualisiert",
          description: `Das Guthaben für ${userEmail} wurde aktualisiert.`
        });
        onCreditUpdated(); // Trigger data refresh in parent component
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
              {isLoading ? (
                <div className="h-10 flex items-center">Wird geladen...</div>
              ) : (
                <Input
                  id="credit"
                  type="number"
                  value={newCredit}
                  onChange={(e) => setNewCredit(Number(e.target.value))}
                  min="0"
                  step="0.01"
                />
              )}
            </div>
          </div>
          {actualCurrentCredit !== null && actualCurrentCredit !== initialCredit && (
            <div className="col-span-4 text-sm text-amber-600">
              Hinweis: Das aktuelle Guthaben ({actualCurrentCredit.toFixed(2)}€) 
              weicht vom angezeigten Wert in der Tabelle ({initialCredit.toFixed(2)}€) ab.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting || isLoading}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || isLoading}>
            {isSubmitting ? "Wird gespeichert..." : "Speichern"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
