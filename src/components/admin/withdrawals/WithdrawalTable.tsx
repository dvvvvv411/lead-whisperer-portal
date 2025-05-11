import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import WithdrawalStatusBadge from "./WithdrawalStatusBadge";
import WithdrawalActions from "./WithdrawalActions";
import WithdrawalDialogContent from "./WithdrawalDialogContent";
import { processWithdrawal } from "./withdrawalService";

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

interface WithdrawalTableProps {
  withdrawals: Withdrawal[];
  onWithdrawalUpdated: () => void;
}

const WithdrawalTable = ({ withdrawals, onWithdrawalUpdated }: WithdrawalTableProps) => {
  const { toast } = useToast();
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<"approve" | "reject" | null>(null);
  const [notes, setNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [updatedWithdrawals, setUpdatedWithdrawals] = useState<Withdrawal[]>(withdrawals);

  // Update local state when props change
  if (JSON.stringify(withdrawals) !== JSON.stringify(updatedWithdrawals)) {
    setUpdatedWithdrawals(withdrawals);
  }

  const handleApproveClick = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setDialogAction("approve");
    setNotes("");
    setDialogOpen(true);
  };

  const handleRejectClick = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setDialogAction("reject");
    setNotes("");
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedWithdrawal(null);
    setDialogAction(null);
    setNotes("");
  };

  const handleConfirmAction = async () => {
    if (!selectedWithdrawal) return;
    
    try {
      setProcessing(true);
      
      const newStatus = dialogAction === "approve" ? "completed" : "rejected";
      console.log(`Changing withdrawal status to: ${newStatus} for ID: ${selectedWithdrawal.id}`);
      
      const result = await processWithdrawal({
        withdrawal: selectedWithdrawal,
        status: newStatus,
        notes: notes || null,
        isApproved: dialogAction === "approve"
      });
      
      console.log("Withdrawal processing result:", result);
      
      // Update local state to reflect changes immediately
      setUpdatedWithdrawals(prevWithdrawals => 
        prevWithdrawals.map(withdrawal => 
          withdrawal.id === selectedWithdrawal.id 
            ? { 
                ...withdrawal, 
                status: newStatus, 
                notes: notes || null, 
                updated_at: new Date().toISOString()
              } 
            : withdrawal
        )
      );
      
      toast({
        title: dialogAction === "approve" ? "Auszahlung genehmigt" : "Auszahlung abgelehnt",
        description: `Die Auszahlung für ${selectedWithdrawal.user_email} wurde ${dialogAction === "approve" ? "genehmigt" : "abgelehnt"}.`,
      });
      
      // Refresh withdrawals from database
      onWithdrawalUpdated();
    } catch (error: any) {
      console.error("Fehler beim Verarbeiten der Auszahlung:", error.message);
      toast({
        title: "Fehler",
        description: "Die Auszahlung konnte nicht verarbeitet werden.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
      handleDialogClose();
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum</TableHead>
              <TableHead>Benutzer</TableHead>
              <TableHead>Betrag</TableHead>
              <TableHead>Währung</TableHead>
              <TableHead>Wallet-Adresse</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {updatedWithdrawals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center p-4">
                  Keine Auszahlungen vorhanden
                </TableCell>
              </TableRow>
            ) : (
              updatedWithdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell>
                    {new Date(withdrawal.created_at).toLocaleDateString('de-DE')}
                  </TableCell>
                  <TableCell>{withdrawal.user_email}</TableCell>
                  <TableCell>{(withdrawal.amount / 100).toFixed(2)}€</TableCell>
                  <TableCell>{withdrawal.wallet_currency}</TableCell>
                  <TableCell className="font-mono text-xs max-w-[200px] truncate">
                    {withdrawal.wallet_address}
                  </TableCell>
                  <TableCell>
                    <WithdrawalStatusBadge status={withdrawal.status} />
                  </TableCell>
                  <TableCell>
                    <WithdrawalActions 
                      withdrawal={withdrawal}
                      onApprove={handleApproveClick}
                      onReject={handleRejectClick}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "approve" ? "Auszahlung genehmigen" : "Auszahlung ablehnen"}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === "approve" 
                ? "Bitte bestätigen Sie die Genehmigung der Auszahlung."
                : "Bitte geben Sie einen Grund für die Ablehnung an."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedWithdrawal && (
            <WithdrawalDialogContent 
              withdrawal={selectedWithdrawal}
              notes={notes}
              onNotesChange={(e) => setNotes(e.target.value)}
              onConfirm={handleConfirmAction}
              onCancel={handleDialogClose}
              processing={processing}
              action={dialogAction as "approve" | "reject"}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WithdrawalTable;
