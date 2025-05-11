
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export interface Payment {
  id: string;
  user_id: string;
  user_email: string;
  amount: number;
  currency: string;
  wallet_currency: string;
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
  const [processing, setProcessing] = useState<string | null>(null);

  const updatePaymentStatus = async (paymentId: string, newStatus: string) => {
    try {
      setProcessing(paymentId);
      
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId);
      
      if (error) throw error;
      
      toast({
        title: "Zahlungsstatus aktualisiert",
        description: `Der Status wurde zu "${newStatus}" geändert.`,
      });
      
      onPaymentUpdated();
    } catch (error: any) {
      console.error("Fehler beim Ändern des Zahlungsstatus:", error);
      toast({
        title: "Fehler",
        description: "Der Zahlungsstatus konnte nicht aktualisiert werden: " + error.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(null);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    // Konvertiere Cent in Euro
    const amountInEuro = amount / 100;
    return `${amountInEuro.toFixed(2)} ${currency}`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Benutzer</TableHead>
            <TableHead>Betrag</TableHead>
            <TableHead>Wallet</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Transaktion</TableHead>
            <TableHead>Erstellt am</TableHead>
            <TableHead className="text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                Keine Zahlungen gefunden
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.user_email}</TableCell>
                <TableCell>{formatCurrency(payment.amount, payment.currency)}</TableCell>
                <TableCell>{payment.wallet_currency}</TableCell>
                <TableCell>
                  <Badge variant={
                    payment.status === "completed" ? "default" : 
                    payment.status === "pending" ? "outline" : 
                    "destructive"
                  }>
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {payment.transaction_id || '-'}
                </TableCell>
                <TableCell>
                  {format(new Date(payment.created_at), 'dd.MM.yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  {payment.status === "pending" && (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={processing === payment.id}
                        onClick={() => updatePaymentStatus(payment.id, "completed")}
                        className="flex items-center"
                      >
                        <Check className="mr-1 h-4 w-4 text-green-500" />
                        Bestätigen
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={processing === payment.id}
                        onClick={() => updatePaymentStatus(payment.id, "rejected")}
                        className="flex items-center"
                      >
                        <X className="mr-1 h-4 w-4 text-red-500" />
                        Ablehnen
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
