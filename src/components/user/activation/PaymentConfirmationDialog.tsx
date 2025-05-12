
import { CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
      <DialogContent className="bg-slate-900 border-gold/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center gradient-text text-xl">Zahlung bestätigen</DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Haben Sie die Zahlung von 250€ in {selectedWallet} durchgeführt?
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700/50">
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-gold/10 rounded-full">
                <CreditCard className="h-8 w-8 text-gold" />
              </div>
              <p className="text-center text-sm text-gray-300">
                Bitte bestätigen Sie nur, wenn Sie die Zahlung bereits durchgeführt haben. 
                Die Überprüfung kann bis zu 15 Minuten dauern.
              </p>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <div className="p-2 border border-green-600/30 bg-green-900/20 rounded text-green-500 text-sm">
                <CheckCircle2 className="h-5 w-5 mx-auto mb-1" />
                <p>Zahlung erfolgt</p>
              </div>
              <div className="p-2 border border-red-600/30 bg-red-900/20 rounded text-red-500 text-sm">
                <AlertCircle className="h-5 w-5 mx-auto mb-1" />
                <p>Noch nicht bezahlt</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex gap-3 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="border-slate-700 text-white hover:bg-slate-800 hover:text-white">
            Abbrechen
          </Button>
          <Button onClick={onConfirm} className="bg-green-600 hover:bg-green-700 text-white">
            Ja, ich habe bezahlt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentConfirmationDialog;
