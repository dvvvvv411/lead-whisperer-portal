
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import WithdrawalDialogContent from "./WithdrawalDialogContent";

interface Withdrawal {
  id: string;
  user_id: string;
  user_email: string;
  amount: number;
  currency: string;
  wallet_currency: string;
  wallet_address: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface WithdrawalActionDialogProps {
  selectedWithdrawal: Withdrawal | null;
  dialogOpen: boolean;
  dialogAction: "approve" | "reject" | null;
  notes: string;
  processing: boolean;
  onNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onConfirm: () => void;
  onClose: () => void;
}

const WithdrawalActionDialog = ({
  selectedWithdrawal,
  dialogOpen,
  dialogAction,
  notes,
  processing,
  onNotesChange,
  onConfirm,
  onClose,
}: WithdrawalActionDialogProps) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={onClose}>
      <DialogContent className="bg-casino-dark border-gold/20 text-gray-200 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <DialogHeader>
          <DialogTitle className="text-gray-100 border-b border-gold/20 pb-2">
            {dialogAction === "approve" ? "Auszahlung genehmigen" : "Auszahlung ablehnen"}
          </DialogTitle>
          <DialogDescription className="text-gray-400 pt-2">
            {dialogAction === "approve" 
              ? "Bitte bestätigen Sie die Genehmigung der Auszahlung."
              : "Bitte geben Sie einen Grund für die Ablehnung an."}
          </DialogDescription>
        </DialogHeader>
        
        {selectedWithdrawal && (
          <WithdrawalDialogContent 
            withdrawal={selectedWithdrawal}
            notes={notes}
            onNotesChange={onNotesChange}
            onConfirm={onConfirm}
            onCancel={onClose}
            processing={processing}
            action={dialogAction as "approve" | "reject"}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalActionDialog;
