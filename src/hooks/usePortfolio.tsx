
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PortfolioItem {
  id: string;
  user_id: string;
  crypto_asset_id: string;
  quantity: number;
  average_buy_price: number;
  created_at: string;
  updated_at: string;
  crypto_asset?: {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    image_url: string | null;
  };
}

interface PortfolioSummary {
  totalValue: number;
  totalProfit: number;
  profitPercentage: number;
}

export const usePortfolio = (userId?: string) => {
  const { toast } = useToast();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<PortfolioSummary>({
    totalValue: 0,
    totalProfit: 0,
    profitPercentage: 0
  });
  
  const fetchPortfolio = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      // Fetch user portfolio with crypto asset details
      const { data, error } = await supabase
        .from('user_portfolios')
        .select(`
          *,
          crypto_asset:crypto_asset_id (
            id, symbol, name, current_price, image_url
          )
        `)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      if (data) {
        setPortfolio(data as PortfolioItem[]);
        
        // Calculate portfolio summary
        let totalInvestment = 0;
        let totalCurrentValue = 0;
        
        data.forEach(item => {
          const investment = item.quantity * item.average_buy_price;
          const currentValue = item.quantity * item.crypto_asset?.current_price;
          
          totalInvestment += investment;
          totalCurrentValue += currentValue;
        });
        
        const totalProfit = totalCurrentValue - totalInvestment;
        const profitPercentage = totalInvestment > 0 
          ? (totalProfit / totalInvestment) * 100 
          : 0;
        
        setSummary({
          totalValue: totalCurrentValue,
          totalProfit: totalProfit,
          profitPercentage: profitPercentage
        });
      }
    } catch (error: any) {
      console.error('Error fetching portfolio:', error.message);
      toast({
        title: "Fehler beim Laden des Portfolios",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (userId) {
      fetchPortfolio();
      
      // Refresh portfolio every 2 minutes
      const interval = setInterval(() => {
        fetchPortfolio();
      }, 2 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [userId]);
  
  return { 
    portfolio, 
    summary, 
    loading,
    fetchPortfolio
  };
};
