
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
      console.log("Fetching withdrawals for user:", userId);
      
      const { data, error } = await supabase
        .from('withdrawals')
        .select('id, amount, wallet_currency, status, created_at, updated_at, notes')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log("Withdrawals fetched:", data);
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
    
    // Subscribe to withdrawals table changes with enhanced logging
    console.log("Setting up realtime subscription for withdrawals with user_id:", userId);
    
    const withdrawalsChannel = supabase
      .channel('withdrawals-channel')
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
          
          // Check the specific type of change
          if (payload.eventType === 'UPDATE') {
            console.log('Withdrawal status updated:', payload.new.status);
            // Immediately refresh withdrawals to show new status
            fetchWithdrawals();
          } else if (payload.eventType === 'INSERT') {
            console.log('New withdrawal created:', payload.new);
            fetchWithdrawals();
          } else if (payload.eventType === 'DELETE') {
            console.log('Withdrawal deleted:', payload.old);
            fetchWithdrawals();
          }
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });
    
    return () => {
      console.log("Cleaning up realtime subscription");
      supabase.removeChannel(withdrawalsChannel);
    };
  }, [userId, toast]);

  return {
    withdrawals,
    loading,
    fetchWithdrawals
  };
};
