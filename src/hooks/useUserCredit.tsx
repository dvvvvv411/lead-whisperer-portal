
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useUserCredit = (userId?: string) => {
  const { toast } = useToast();
  const [userCredit, setUserCredit] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  const fetchUserCredit = useCallback(async () => {
    if (!userId) {
      setUserCredit(null);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // First, ensure the user has a credit entry
      await supabase.rpc('initialize_user_credit', { user_id_param: userId });
      
      // Then fetch the credit
      const { data, error } = await supabase
        .from('user_credits')
        .select('amount')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching user credit:", error);
        if (error.code !== 'PGRST116') { // Don't show toast for "no rows" error
          toast({
            title: "Fehler beim Abrufen des Guthabens",
            description: "Bitte versuchen Sie es erneut",
            variant: "destructive"
          });
        }
        setUserCredit(0); // Default to 0 if there's an error
      } else {
        // Convert from cents to euros
        setUserCredit(data ? data.amount / 100 : 0);
      }
    } catch (error: any) {
      console.error("Error fetching user credit:", error.message);
      toast({
        title: "Fehler beim Abrufen des Guthabens",
        description: error.message,
        variant: "destructive"
      });
      setUserCredit(0); // Default to 0 if there's an error
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);
  
  // Initial fetch
  useEffect(() => {
    fetchUserCredit();
  }, [fetchUserCredit]);
  
  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return;
    
    const channel = supabase
      .channel('user_credit_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_credits',
          filter: `user_id=eq.${userId}`
        },
        () => {
          console.log('Credit change detected, refreshing...');
          fetchUserCredit();
        }
      )
      .subscribe();
    
    // Also listen for new trades that might affect credit through triggers
    const tradesChannel = supabase
      .channel('trade_changes')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'trade_simulations',
          filter: `user_id=eq.${userId}`
        },
        () => {
          console.log('New trade detected, refreshing credit...');
          fetchUserCredit();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(tradesChannel);
    };
  }, [userId, fetchUserCredit]);
  
  return { 
    userCredit, 
    loading,
    fetchUserCredit 
  };
};
