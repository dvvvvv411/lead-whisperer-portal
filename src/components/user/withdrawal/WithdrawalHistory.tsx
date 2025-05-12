
import { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, History, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { de } from 'date-fns/locale';
import { useWithdrawalHistory } from "@/hooks/useWithdrawalHistory";
import WithdrawalEmptyState from "./WithdrawalEmptyState";
import WithdrawalLoading from "./WithdrawalLoading";

interface WithdrawalHistoryProps {
  userId?: string;
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
  return (amount / 100).toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const WithdrawalHistory = ({ userId }: WithdrawalHistoryProps) => {
  const { withdrawals, loading, fetchWithdrawals } = useWithdrawalHistory(userId);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWithdrawals();
    setTimeout(() => setRefreshing(false), 500); // Show refreshing state for at least 500ms
  };

  if (loading) {
    return <WithdrawalLoading />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <History className="mr-2 h-5 w-5 text-gold" />
          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gold-gradient">Auszahlungsverlauf</h2>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="border-gold/20 hover:bg-gold/10"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      {withdrawals.length === 0 ? (
        <WithdrawalEmptyState />
      ) : (
        <div className="overflow-hidden rounded-lg border border-gold/10">
          <Table>
            <TableCaption className="mt-4">Liste Ihrer Auszahlungen</TableCaption>
            <TableHeader className="bg-casino-darker">
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Betrag</TableHead>
                <TableHead>Kryptowährung</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id} className="hover:bg-gold/5">
                  <TableCell>
                    {format(new Date(withdrawal.created_at), "dd. MMMM yyyy, HH:mm", { locale: de })}
                  </TableCell>
                  <TableCell className="text-accent1-light font-semibold">
                    {formatAmount(withdrawal.amount)}€
                  </TableCell>
                  <TableCell>{withdrawal.wallet_currency}</TableCell>
                  <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default WithdrawalHistory;
