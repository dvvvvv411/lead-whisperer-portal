
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TradeParams {
  userId: string;
  userEmail: string;
  cryptoId: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  strategy: string;
  userCredit: number;
}

export const useTrades = () => {
  const { toast } = useToast();
  const [tradingLoading, setTradingLoading] = useState(false);
  
  const executeTradeSimulation = async ({
    userId,
    userEmail,
    cryptoId,
    type,
    quantity,
    price,
    strategy,
    userCredit
  }: TradeParams) => {
    if (!userId || !cryptoId) return null;
    
    try {
      setTradingLoading(true);
      
      const totalAmount = quantity * price;
      
      // Check if user has enough credit for buy operations
      if (type === 'buy' && totalAmount > userCredit) {
        toast({
          title: "Nicht genügend Guthaben",
          description: "Sie haben nicht genügend Guthaben für diese Transaktion.",
          variant: "destructive"
        });
        return null;
      }
      
      // For sell operations, check if user has the asset
      if (type === 'sell') {
        const { data: portfolioAsset } = await supabase
          .from('user_portfolios')
          .select('quantity')
          .eq('user_id', userId)
          .eq('crypto_asset_id', cryptoId)
          .single();
          
        if (!portfolioAsset || portfolioAsset.quantity < quantity) {
          toast({
            title: "Nicht genügend Bestand",
            description: "Sie haben nicht genügend Bestand für diesen Verkauf.",
            variant: "destructive"
          });
          return null;
        }
      }
      
      // Insert trade simulation
      const { data, error } = await supabase
        .from('trade_simulations')
        .insert([
          {
            user_id: userId,
            crypto_asset_id: cryptoId,
            type,
            quantity,
            price,
            total_amount: totalAmount,
            strategy,
            status: 'completed'
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      // Note: We no longer need to manually update credit here,
      // as it's now handled by the database trigger
      
      toast({
        title: `${type === 'buy' ? 'Kauf' : 'Verkauf'} erfolgreich`,
        description: `${quantity} zu einem Preis von ${price.toFixed(2)}€ ${type === 'buy' ? 'gekauft' : 'verkauft'}.`
      });
      
      return data;
      
    } catch (error: any) {
      console.error('Error executing trade:', error.message);
      toast({
        title: "Fehler bei der Transaktion",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setTradingLoading(false);
    }
  };
  
  return {
    executeTradeSimulation,
    tradingLoading
  };
};
