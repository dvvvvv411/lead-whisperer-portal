
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TradeHistoryItem {
  id: string;
  user_id: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total_amount: number;
  strategy: string;
  status: string;
  simulation_date: string;
  created_at: string;
  crypto_asset?: {
    id: string;
    symbol: string;
    name: string;
    image_url: string | null;
  };
  is_bot_trade?: boolean;
}

export const useTradeHistory = (userId?: string) => {
  const { toast } = useToast();
  const [trades, setTrades] = useState<TradeHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [botTrades, setBotTrades] = useState<TradeHistoryItem[]>([]);
  
  const fetchTradeHistory = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      // Fetch trade history with crypto asset details and joined payment records for notes
      const { data, error } = await supabase
        .from('trade_simulations')
        .select(`
          *,
          crypto_asset:crypto_asset_id (
            id, symbol, name, image_url
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        // Process trades to identify bot trades based on strategy prefix
        const allTrades = data as TradeHistoryItem[];
        setTrades(allTrades);
        
        // Filter bot trades - trades done by the AI trading bot typically use strategies with AI prefix
        // or are executed in rapid succession
        const botTradesFiltered = allTrades.filter(trade => 
          trade.strategy.includes('bot_') || 
          trade.strategy.includes('ai_')
        );
        
        setBotTrades(botTradesFiltered);
      }
    } catch (error: any) {
      console.error('Error fetching trade history:', error.message);
      toast({
        title: "Fehler beim Laden der Handelshistorie",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Set up real-time subscription for new trades (useful for bot activity)
  useEffect(() => {
    if (!userId) return;
    
    fetchTradeHistory();
    
    // Subscribe to changes in trade_simulations table for this user
    const channel = supabase
      .channel('trade_history_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'trade_simulations',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('New trade activity detected:', payload);
          fetchTradeHistory();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
  
  return { 
    trades, 
    botTrades,
    loading,
    fetchTradeHistory
  };
};
