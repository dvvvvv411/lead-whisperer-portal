
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
import { motion } from "framer-motion";

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
        return <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30 shadow-sm shadow-green-500/20">Bestätigt</span>;
      case 'rejected':
        return <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/30 shadow-sm shadow-red-500/20">Abgelehnt</span>;
      case 'pending':
        return <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium border border-yellow-500/30 shadow-sm shadow-yellow-500/20">Ausstehend</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs font-medium border border-gray-500/30">{status}</span>;
    }
  };
  
  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gold/30 backdrop-blur-sm shadow-lg">
        <Table className="w-full">
          <TableHeader className="bg-gradient-to-r from-casino-dark via-casino-card to-casino-dark border-b border-gold/20">
            <TableRow>
              <TableHead className="text-gray-300 font-medium py-4">Benutzer</TableHead>
              <TableHead className="text-gray-300 font-medium">Betrag</TableHead>
              <TableHead className="text-gray-300 font-medium">Währung</TableHead>
              <TableHead className="text-gray-300 font-medium">Status</TableHead>
              <TableHead className="text-gray-300 font-medium">Erstellt am</TableHead>
              <TableHead className="text-gray-300 font-medium">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                  Keine Zahlungen gefunden
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment, index) => (
                <motion.tr
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-t border-gold/10 hover:bg-casino-card/40"
                >
                  <TableCell className="font-medium text-gray-300">{payment.user_email}</TableCell>
                  <TableCell className="text-gray-100 font-medium">{(payment.amount / 100).toFixed(2)}€</TableCell>
                  <TableCell className="text-green-400 font-medium">{payment.wallet_currency}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-gray-400 text-sm">{formatDate(payment.created_at)}</TableCell>
                  <TableCell>
                    {payment.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700 shadow-sm hover:shadow-green-700/20"
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
                          className="shadow-sm hover:shadow-red-700/20"
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
                      <span className="text-gray-400 text-sm italic">
                        {payment.status === 'completed' ? 'Bestätigt' : 'Abgelehnt'}
                      </span>
                    )}
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Verify Payment Dialog */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent className="bg-casino-dark border-gold/20 text-gray-200 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-100 border-b border-gold/20 pb-2">Zahlung bestätigen</DialogTitle>
            <DialogDescription className="text-gray-400 pt-2">
              Sind Sie sicher, dass Sie diese Zahlung bestätigen möchten?
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-400">Benutzer</p>
                  <p className="text-gray-200">{selectedPayment.user_email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Betrag</p>
                  <p className="text-gray-200">{(selectedPayment.amount / 100).toFixed(2)}€</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Wallet-Währung</p>
                  <p className="text-green-400 font-medium">{selectedPayment.wallet_currency}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Erstellt am</p>
                  <p className="text-gray-200">{formatDate(selectedPayment.created_at)}</p>
                </div>
              </div>
              
              <div>
                <label htmlFor="transactionId" className="block text-sm font-medium text-gray-400 mb-1">
                  Transaktions-ID (optional)
                </label>
                <input
                  id="transactionId"
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full bg-casino-card border border-gold/20 rounded-md px-3 py-2 text-gray-200"
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
              className="border-gold/30 text-gray-300 hover:bg-casino-card"
            >
              Abbrechen
            </Button>
            <Button 
              onClick={handleVerifyPayment} 
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 shadow-sm hover:shadow-green-600/30"
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
        <AlertDialogContent className="bg-casino-dark border-gold/20 text-gray-200 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-100 border-b border-gold/20 pb-2">Zahlung ablehnen</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400 pt-2">
              Diese Aktion kann nicht rückgängig gemacht werden. Die Zahlung wird als abgelehnt markiert.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {selectedPayment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-400">Benutzer</p>
                  <p className="text-gray-200">{selectedPayment.user_email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Betrag</p>
                  <p className="text-gray-200">{(selectedPayment.amount / 100).toFixed(2)}€</p>
                </div>
              </div>
              
              <div>
                <label htmlFor="rejectionNotes" className="block text-sm font-medium text-gray-400 mb-1">
                  Ablehnungsgrund (optional)
                </label>
                <Textarea
                  id="rejectionNotes"
                  value={rejectionNotes}
                  onChange={(e) => setRejectionNotes(e.target.value)}
                  className="bg-casino-card border-gold/20 text-gray-200 placeholder:text-gray-500 w-full"
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
              className="border-gold/30 text-gray-300 hover:bg-casino-card bg-transparent"
            >
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectPayment}
              disabled={isProcessing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-red-600/30"
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
