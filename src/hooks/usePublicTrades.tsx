
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PublicTrade {
  id: string;
  crypto_asset_id: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total_amount: number;
  change_percentage: number | null;
  is_profit: boolean | null;
  created_at: string;
  updated_at: string;
  crypto_asset?: {
    id: string;
    symbol: string;
    name: string;
    image_url: string | null;
  };
}

export const usePublicTrades = () => {
  const [trades, setTrades] = useState<PublicTrade[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchPublicTrades = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching public trades at", new Date().toISOString());
      
      // Fetch trades with crypto asset details
      const { data, error } = await supabase
        .from('public_trades')
        .select(`
          *,
          crypto_asset:crypto_asset_id (
            id, symbol, name, image_url
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        console.log("Public trades fetched successfully, count:", data.length);
        
        // Simulate 90% success rate with profits 1-7% and losses -1 to -3%
        const enhancedData = data.map(trade => {
          // Determine if this is a profit (90% chance) or loss (10% chance)
          const isProfit = Math.random() <= 0.9;
          
          // Calculate change percentage based on profit/loss
          let changePercentage;
          if (isProfit) {
            // Profit between 1% and 7%
            changePercentage = 1 + Math.random() * 6;
          } else {
            // Loss between -1% and -3%
            changePercentage = -(1 + Math.random() * 2);
          }
          
          return {
            ...trade,
            is_profit: isProfit,
            change_percentage: changePercentage
          };
        });
        
        setTrades(enhancedData as PublicTrade[]);
      }
    } catch (error: any) {
      console.error('Error fetching public trades:', error.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch trades when the component mounts
  useEffect(() => {
    fetchPublicTrades();
    
    // Refresh trades every minute
    const interval = setInterval(() => {
      fetchPublicTrades();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [fetchPublicTrades]);
  
  return { 
    trades, 
    loading,
    fetchPublicTrades
  };
};
