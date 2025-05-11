
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

interface WithdrawalDialogContentProps {
  withdrawal: Withdrawal;
  notes: string;
  onNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onConfirm: () => void;
  onCancel: () => void;
  processing: boolean;
  action: "approve" | "reject";
}

const WithdrawalDialogContent = ({
  withdrawal,
  notes,
  onNotesChange,
  onConfirm,
  onCancel,
  processing,
  action
}: WithdrawalDialogContentProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Benutzer</p>
          <p>{withdrawal.user_email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Betrag</p>
          <p>{(withdrawal.amount / 100).toFixed(2)}€</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Krypto-Währung</p>
          <p>{withdrawal.wallet_currency}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Datum</p>
          <p>{new Date(withdrawal.created_at).toLocaleDateString('de-DE')}</p>
        </div>
      </div>
      
      <div>
        <p className="text-sm font-medium text-gray-500">Wallet-Adresse</p>
        <p className="font-mono text-xs break-all bg-gray-50 p-2 rounded">{withdrawal.wallet_address}</p>
      </div>
      
      <div className="pt-2">
        <label htmlFor="notes" className="text-sm font-medium text-gray-500">
          Anmerkungen
        </label>
        <Textarea
          id="notes"
          value={notes}
          onChange={onNotesChange}
          placeholder="Optionale Anmerkungen zur Auszahlung"
          className="mt-1"
        />
      </div>

      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button 
          type="submit" 
          onClick={onConfirm}
          disabled={processing}
          variant={action === "approve" ? "default" : "destructive"}
        >
          {action === "approve" ? "Genehmigen" : "Ablehnen"}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default WithdrawalDialogContent;
