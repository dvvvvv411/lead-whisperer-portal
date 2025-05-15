
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  
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
        
        // Check if there are new trades since our last update
        let hasNewTrades = false;
        if (lastUpdateTime && data.length > 0) {
          const newestTradeDate = new Date(data[0].created_at);
          hasNewTrades = newestTradeDate > lastUpdateTime;
          
          if (hasNewTrades) {
            // Notify with toast that new trades arrived
            toast({
              title: "Neue Trades!",
              description: "Es wurden neue Handelsdaten empfangen.",
              variant: "default"
            });
          }
        }
        
        // Update trades and last update time
        setTrades(data as PublicTrade[]);
        setLastUpdateTime(new Date());
      }
    } catch (error: any) {
      console.error('Error fetching public trades:', error.message);
    } finally {
      setLoading(false);
    }
  }, [lastUpdateTime]);
  
  // Run the update trade function to generate new trades
  const updateTrades = useCallback(async () => {
    try {
      console.log("Updating public trades...");
      const response = await fetch(
        "https://evtlahgiyytcvfeiqwaz.functions.supabase.co/update-public-trades",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to update trades: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Trades update result:", result);
      
      // Fetch the updated trades
      fetchPublicTrades();
    } catch (error: any) {
      console.error("Error updating public trades:", error.message);
    }
  }, [fetchPublicTrades]);
  
  // Fetch trades when the component mounts and periodically after
  useEffect(() => {
    // Initial fetch
    fetchPublicTrades();
    
    // For simulation purposes, update trades every 30 seconds
    const updateInterval = setInterval(() => {
      updateTrades();
    }, 30000); // 30 seconds
    
    // Refresh display more frequently to catch any trades added by other means
    const refreshInterval = setInterval(() => {
      fetchPublicTrades();
    }, 10000); // 10 seconds
    
    return () => {
      clearInterval(updateInterval);
      clearInterval(refreshInterval);
    };
  }, [fetchPublicTrades, updateTrades]);
  
  return { 
    trades, 
    loading,
    fetchPublicTrades,
    updateTrades
  };
};
