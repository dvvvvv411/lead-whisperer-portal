
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Loader2, AlertCircle, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PaymentRecord {
  id: string;
  amount: number;
  wallet_currency: string;
  status: string;
  created_at: string;
}

interface DepositHistoryProps {
  userId: string | undefined;
}

const getStatusBadge = (status: string) => {
  switch(status) {
    case "completed":
      return <Badge className="bg-green-500">Bestätigt</Badge>;
    case "rejected":
      return <Badge className="bg-red-500">Abgelehnt</Badge>;
    case "pending":
    default:
      return <Badge className="bg-yellow-500">In Bearbeitung</Badge>;
  }
};

const formatAmount = (amount: number) => {
  return (amount / 100).toFixed(2);
};

const DepositHistory = ({ userId }: DepositHistoryProps) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from("payments")
          .select("id, amount, wallet_currency, status, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setPayments(data || []);
      } catch (err: any) {
        console.error("Error fetching payment history:", err.message);
        setError("Fehler beim Laden des Zahlungsverlaufs.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Zahlungsverlauf wird geladen...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
        <div>
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center mb-4">
        <History className="mr-2 h-5 w-5" />
        <h2 className="text-xl font-semibold">Einzahlungsverlauf</h2>
      </div>
      
      {payments.length === 0 ? (
        <p className="text-gray-500 italic">Keine Einzahlungen gefunden.</p>
      ) : (
        <Table>
          <TableCaption>Liste Ihrer Einzahlungen</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Datum</TableHead>
              <TableHead>Betrag (€)</TableHead>
              <TableHead>Kryptowährung</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {format(new Date(payment.created_at), "dd.MM.yyyy HH:mm")}
                </TableCell>
                <TableCell>{formatAmount(payment.amount)}€</TableCell>
                <TableCell>{payment.wallet_currency}</TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default DepositHistory;
