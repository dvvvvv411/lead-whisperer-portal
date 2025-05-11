
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle } from "lucide-react";

interface Withdrawal {
  id: string;
  user_id: string; // Wichtig: user_id ist jetzt explizit definiert
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
      
      if (dialogAction === "approve") {
        // Update the withdrawal status to completed
        const { error: updateError } = await supabase
          .from('withdrawals')
          .update({ 
            status: 'completed',
            notes: notes || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedWithdrawal.id);
        
        if (updateError) throw updateError;
        
        // Update user credit by subtracting the withdrawal amount
        // KORRIGIERT: Verwendung der richtigen user_id statt der withdrawal ID
        const { error: creditError } = await supabase.rpc(
          'initialize_user_credit',
          { user_id_param: selectedWithdrawal.user_id }
        );
        
        if (creditError) throw creditError;
        
        toast({
          title: "Auszahlung genehmigt",
          description: `Die Auszahlung für ${selectedWithdrawal.user_email} wurde genehmigt.`,
        });
      } else if (dialogAction === "reject") {
        // Update the withdrawal status to rejected
        const { error } = await supabase
          .from('withdrawals')
          .update({ 
            status: 'rejected',
            notes: notes || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedWithdrawal.id);
        
        if (error) throw error;
        
        toast({
          title: "Auszahlung abgelehnt",
          description: `Die Auszahlung für ${selectedWithdrawal.user_email} wurde abgelehnt.`,
        });
      }
      
      // Refresh withdrawals
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">Ausstehend</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Abgeschlossen</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Abgelehnt</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
            {withdrawals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center p-4">
                  Keine Auszahlungen vorhanden
                </TableCell>
              </TableRow>
            ) : (
              withdrawals.map((withdrawal) => (
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
                  <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                  <TableCell>
                    {withdrawal.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-700 border-green-300 hover:bg-green-50"
                          onClick={() => handleApproveClick(withdrawal)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Genehmigen
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-700 border-red-300 hover:bg-red-50"
                          onClick={() => handleRejectClick(withdrawal)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Ablehnen
                        </Button>
                      </div>
                    )}
                    {withdrawal.status !== "pending" && (
                      <span className="text-sm text-gray-500">
                        {withdrawal.notes || "Keine Anmerkung"}
                      </span>
                    )}
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
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Benutzer</p>
                  <p>{selectedWithdrawal.user_email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Betrag</p>
                  <p>{(selectedWithdrawal.amount / 100).toFixed(2)}€</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Krypto-Währung</p>
                  <p>{selectedWithdrawal.wallet_currency}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Datum</p>
                  <p>{new Date(selectedWithdrawal.created_at).toLocaleDateString('de-DE')}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Wallet-Adresse</p>
                <p className="font-mono text-xs break-all bg-gray-50 p-2 rounded">{selectedWithdrawal.wallet_address}</p>
              </div>
              
              <div className="pt-2">
                <label htmlFor="notes" className="text-sm font-medium text-gray-500">
                  Anmerkungen
                </label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optionale Anmerkungen zur Auszahlung"
                  className="mt-1"
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleDialogClose}>
              Abbrechen
            </Button>
            <Button 
              type="submit" 
              onClick={handleConfirmAction}
              disabled={processing}
              variant={dialogAction === "approve" ? "default" : "destructive"}
            >
              {dialogAction === "approve" ? "Genehmigen" : "Ablehnen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WithdrawalTable;
