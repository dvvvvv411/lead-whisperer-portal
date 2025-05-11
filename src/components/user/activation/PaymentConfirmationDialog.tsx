
import { CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PaymentConfirmationDialogProps {
  showDialog: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedWallet: string | null;
}

const PaymentConfirmationDialog = ({
  showDialog,
  onClose,
  onConfirm,
  selectedWallet
}: PaymentConfirmationDialogProps) => {
  return (
    <Dialog open={showDialog} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zahlung bestätigen</DialogTitle>
          <DialogDescription>
            Haben Sie die Zahlung von 250€ in {selectedWallet} durchgeführt?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Abbrechen</Button>
          <Button onClick={onConfirm}>
            Ja, ich habe bezahlt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentConfirmationDialog;
