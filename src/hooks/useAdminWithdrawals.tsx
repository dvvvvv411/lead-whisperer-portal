
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

export const useAdminWithdrawals = () => {
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
    
    // Subscribe to withdrawals table changes
    const withdrawalsChannel = supabase
      .channel('admin_withdrawal_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'withdrawals'
        },
        (payload) => {
          console.log('Admin: Withdrawal update detected:', payload);
          fetchWithdrawals();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(withdrawalsChannel);
    };
  }, [toast]);

  return {
    withdrawals,
    loading,
    fetchWithdrawals
  };
};
