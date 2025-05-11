
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WithdrawalHistoryProps {
  userId?: string;
}

interface Withdrawal {
  id: string;
  amount: number;
  wallet_currency: string;
  status: string;
  created_at: string;
  updated_at: string;
  notes: string | null;
}

const WithdrawalHistory = ({ userId }: WithdrawalHistoryProps) => {
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('withdrawals')
        .select('id, amount, wallet_currency, status, created_at, updated_at, notes')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setWithdrawals(data || []);
    } catch (error: any) {
      console.error("Fehler beim Laden der Auszahlungen:", error.message);
      toast({
        title: "Fehler",
        description: "Auszahlungsverlauf konnte nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    
    fetchWithdrawals();
    
    // Subscribe to withdrawals table changes
    const withdrawalsChannel = supabase
      .channel('withdrawal_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'withdrawals',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Withdrawal update detected:', payload);
          fetchWithdrawals();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(withdrawalsChannel);
    };
  }, [userId, toast]);

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

  if (loading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Auszahlungsverlauf</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-4">
            <p>Wird geladen...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Auszahlungsverlauf</CardTitle>
      </CardHeader>
      <CardContent>
        {withdrawals.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Betrag</TableHead>
                <TableHead>Währung</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Anmerkungen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell>
                    {new Date(withdrawal.created_at).toLocaleDateString('de-DE')}
                  </TableCell>
                  <TableCell>{(withdrawal.amount / 100).toFixed(2)}€</TableCell>
                  <TableCell>{withdrawal.wallet_currency}</TableCell>
                  <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                  <TableCell>
                    {withdrawal.notes || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center p-4 text-gray-500">
            Keine Auszahlungen gefunden.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WithdrawalHistory;
