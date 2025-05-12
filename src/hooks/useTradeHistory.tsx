
import { useState, useEffect, useCallback } from "react";
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
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  const fetchTradeHistory = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      console.log("Fetching trade history for user:", userId, "at", new Date().toISOString());
      
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
        console.log("Trade history fetched successfully, count:", data.length);
        
        // Process trades to identify bot trades based on strategy prefix
        const allTrades = data as TradeHistoryItem[];
        setTrades(allTrades);
        
        // Filter bot trades - trades done by the AI trading bot typically use strategies with AI prefix
        // or are executed in rapid succession
        const botTradesFiltered = allTrades.filter(trade => 
          trade.strategy.includes('bot_') || 
          trade.strategy.includes('ai_')
        );
        
        console.log("Bot trades filtered, count:", botTradesFiltered.length);
        setBotTrades(botTradesFiltered);
        setLastRefresh(new Date());
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
  }, [userId, toast]);
  
  // Set up real-time subscription for new trades (useful for bot activity)
  useEffect(() => {
    if (!userId) return;
    
    // Initial fetch
    fetchTradeHistory();
    
    // Enable realtime for trade_simulations table on Supabase
    const enableRealtimeQuery = async () => {
      try {
        // This is just a dummy query to ensure we have access
        const { data, error } = await supabase
          .from('trade_simulations')
          .select('id')
          .limit(1);
          
        if (error) {
          console.error("Error checking trade_simulations access:", error);
        } else {
          console.log("Successfully connected to trade_simulations table for realtime updates");
        }
      } catch (e) {
        console.error("Error enabling realtime:", e);
      }
    };
    
    enableRealtimeQuery();
    
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
      .subscribe((status) => {
        console.log("Supabase real-time subscription status:", status);
      });
    
    console.log("Supabase real-time channel subscribed for trade history");
    
    // Set up manual refresh interval as a backup
    const refreshInterval = setInterval(() => {
      console.log("Performing scheduled trade history refresh");
      fetchTradeHistory();
    }, 30000); // Refresh every 30 seconds as a backup
    
    return () => {
      console.log("Cleaning up real-time subscription and refresh interval");
      supabase.removeChannel(channel);
      clearInterval(refreshInterval);
    };
  }, [userId, fetchTradeHistory]);
  
  return { 
    trades, 
    botTrades,
    loading,
    fetchTradeHistory,
    lastRefresh
  };
};
