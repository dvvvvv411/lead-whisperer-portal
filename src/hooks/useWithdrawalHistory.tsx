
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Withdrawal {
  id: string;
  amount: number;
  wallet_currency: string;
  status: string;
  created_at: string;
  updated_at: string;
  notes: string | null;
}

export const useWithdrawalHistory = (userId?: string) => {
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

  return {
    withdrawals,
    loading,
    fetchWithdrawals
  };
};
