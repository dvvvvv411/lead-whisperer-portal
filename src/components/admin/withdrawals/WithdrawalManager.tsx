
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WithdrawalTable from "./WithdrawalTable";

interface Withdrawal {
  id: string;
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

const WithdrawalManager = () => {
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('get_all_withdrawals');
      
      if (error) throw error;
      
      setWithdrawals(data || []);
    } catch (error: any) {
      console.error("Fehler beim Laden der Auszahlungen:", error.message);
      toast({
        title: "Fehler",
        description: "Die Auszahlungen konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auszahlungen verwalten</CardTitle>
        <CardDescription>Bearbeiten Sie Auszahlungsanfragen von Nutzern</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <p>Wird geladen...</p>
          </div>
        ) : (
          <WithdrawalTable
            withdrawals={withdrawals}
            onWithdrawalUpdated={fetchWithdrawals}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default WithdrawalManager;
