
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
}

export const useTradeHistory = (userId?: string) => {
  const { toast } = useToast();
  const [trades, setTrades] = useState<TradeHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchTradeHistory = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      // Fetch trade history with crypto asset details
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
        setTrades(data as TradeHistoryItem[]);
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
  
  useEffect(() => {
    if (userId) {
      fetchTradeHistory();
    }
  }, [userId]);
  
  return { 
    trades, 
    loading,
    fetchTradeHistory
  };
};
