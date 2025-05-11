
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { processWithdrawal } from "@/components/admin/withdrawals/withdrawalService";

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

export const useWithdrawalActions = (onWithdrawalUpdated: () => void) => {
  const { toast } = useToast();
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<"approve" | "reject" | null>(null);
  const [notes, setNotes] = useState("");
  const [processing, setProcessing] = useState(false);

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
      console.log(`Processing withdrawal: changing status to ${newStatus} for ID: ${selectedWithdrawal.id}`);
      
      await processWithdrawal({
        withdrawal: selectedWithdrawal,
        status: newStatus,
        notes: notes || null,
        isApproved: dialogAction === "approve"
      });
      
      toast({
        title: dialogAction === "approve" ? "Auszahlung genehmigt" : "Auszahlung abgelehnt",
        description: `Die Auszahlung für ${selectedWithdrawal.user_email} wurde ${dialogAction === "approve" ? "genehmigt" : "abgelehnt"}.`,
      });
      
      // Force refresh withdrawals from database
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
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  return {
    selectedWithdrawal,
    dialogOpen,
    dialogAction,
    notes,
    processing,
    handleApproveClick,
    handleRejectClick,
    handleDialogClose,
    handleConfirmAction,
    handleNotesChange
  };
};
