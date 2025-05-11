import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogContent, 
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction 
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

export interface Payment {
  id: string;
  user_id: string;
  user_email: string;
  amount: number;
  currency: string;
  wallet_currency: string;
  wallet_id: string | null;
  status: string;
  transaction_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface PaymentTableProps {
  payments: Payment[];
  onPaymentUpdated: () => void;
}

export const PaymentTable = ({ payments, onPaymentUpdated }: PaymentTableProps) => {
  const { toast } = useToast();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('de-DE');
  };
  
  const handleVerifyPayment = async () => {
    if (!selectedPayment) return;
    
    setIsProcessing(true);
    
    try {
      // Update payment status and transaction ID
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'completed',
          transaction_id: transactionId,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedPayment.id);
      
      if (error) throw error;
      
      console.log(`Payment ${selectedPayment.id} marked as completed. Now updating user credit...`);
      
      // Get the current session to include the auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      // Use the add-credit edge function to add the payment amount to the user's credit
      const response = await fetch(`https://evtlahgiyytcvfeiqwaz.supabase.co/functions/v1/add-credit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          userId: selectedPayment.user_id,
          amount: selectedPayment.amount / 100, // Convert cents to euros for the function
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error adding credit: ${errorData.error || response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Add credit result:", result);
      
      // No longer automatically adding user role - access is now credit-based
      
      toast({
        title: "Zahlung bestätigt",
        description: `Die Zahlung von ${(selectedPayment.amount / 100).toFixed(2)}€ wurde erfolgreich bestätigt und dem Konto gutgeschrieben.`
      });
      
      // Close dialog and refresh payments
      setIsVerifyDialogOpen(false);
      setSelectedPayment(null);
      setTransactionId("");
      onPaymentUpdated();
    } catch (error: any) {
      console.error("Fehler beim Bestätigen der Zahlung:", error);
      toast({
        title: "Fehler",
        description: "Die Zahlung konnte nicht bestätigt werden: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRejectPayment = async () => {
    if (!selectedPayment) return;
    
    setIsProcessing(true);
    
    try {
      // Update payment status and rejection notes
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'rejected',
          notes: rejectionNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedPayment.id);
      
      if (error) throw error;
      
      toast({
        title: "Zahlung abgelehnt",
        description: `Die Zahlung von ${(selectedPayment.amount / 100).toFixed(2)}€ wurde abgelehnt.`
      });
      
      // Close dialog and refresh payments
      setIsRejectDialogOpen(false);
      setSelectedPayment(null);
      setRejectionNotes("");
      onPaymentUpdated();
    } catch (error: any) {
      console.error("Fehler beim Ablehnen der Zahlung:", error);
      toast({
        title: "Fehler",
        description: "Die Zahlung konnte nicht abgelehnt werden: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Bestätigt</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">Abgelehnt</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">Ausstehend</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">{status}</span>;
    }
  };
  
  return (
    <>
      <Table className="border rounded-md">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Benutzer</TableHead>
            <TableHead>Betrag</TableHead>
            <TableHead>Währung</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Erstellt am</TableHead>
            <TableHead>Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Keine Zahlungen gefunden
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.user_email}</TableCell>
                <TableCell>{(payment.amount / 100).toFixed(2)}€</TableCell>
                <TableCell>{payment.wallet_currency}</TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell>{formatDate(payment.created_at)}</TableCell>
                <TableCell>
                  {payment.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setIsVerifyDialogOpen(true);
                        }}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Bestätigen
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setIsRejectDialogOpen(true);
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Ablehnen
                      </Button>
                    </div>
                  )}
                  {payment.status !== 'pending' && (
                    <span className="text-gray-500 text-sm italic">
                      {payment.status === 'completed' ? 'Bestätigt' : 'Abgelehnt'}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Verify Payment Dialog */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zahlung bestätigen</DialogTitle>
            <DialogDescription>
              Sind Sie sicher, dass Sie diese Zahlung bestätigen möchten?
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Benutzer</p>
                  <p>{selectedPayment.user_email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Betrag</p>
                  <p>{(selectedPayment.amount / 100).toFixed(2)}€</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Wallet-Währung</p>
                  <p>{selectedPayment.wallet_currency}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Erstellt am</p>
                  <p>{formatDate(selectedPayment.created_at)}</p>
                </div>
              </div>
              
              <div>
                <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-1">
                  Transaktions-ID (optional)
                </label>
                <input
                  id="transactionId"
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Blockchain Transaktions-ID"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsVerifyDialogOpen(false);
                setSelectedPayment(null);
                setTransactionId("");
              }}
              disabled={isProcessing}
            >
              Abbrechen
            </Button>
            <Button 
              onClick={handleVerifyPayment} 
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin inline-block h-4 w-4 mr-2 border-2 border-white border-r-transparent rounded-full"></span>
                  Verarbeitung...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Zahlung bestätigen
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Payment Dialog */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Zahlung ablehnen</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Die Zahlung wird als abgelehnt markiert.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {selectedPayment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Benutzer</p>
                  <p>{selectedPayment.user_email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Betrag</p>
                  <p>{(selectedPayment.amount / 100).toFixed(2)}€</p>
                </div>
              </div>
              
              <div>
                <label htmlFor="rejectionNotes" className="block text-sm font-medium text-gray-700 mb-1">
                  Ablehnungsgrund (optional)
                </label>
                <Textarea
                  id="rejectionNotes"
                  value={rejectionNotes}
                  onChange={(e) => setRejectionNotes(e.target.value)}
                  className="w-full"
                  placeholder="Geben Sie einen Grund für die Ablehnung an"
                />
              </div>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isProcessing}
              onClick={() => {
                setIsRejectDialogOpen(false);
                setSelectedPayment(null);
                setRejectionNotes("");
              }}
            >
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectPayment}
              disabled={isProcessing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin inline-block h-4 w-4 mr-2 border-2 border-white border-r-transparent rounded-full"></span>
                  Verarbeitung...
                </>
              ) : (
                "Zahlung ablehnen"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
