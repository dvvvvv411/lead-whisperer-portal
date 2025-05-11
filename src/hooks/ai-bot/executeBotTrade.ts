
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BotSettings } from "./types";
import { 
  generateTradeAmount, 
  getRandomCrypto, 
  getRandomStrategy,
  generateProfitPercentage
} from "./botTradeUtils";

export const executeAITrade = async (
  userId: string | undefined,
  userCredit: number | undefined,
  cryptos: any[],
  settings: BotSettings,
  toast: ReturnType<typeof useToast>["toast"],
  updateStatus: (update: any) => void
) => {
  if (!userId || !userCredit || userCredit <= 0) {
    return false;
  }

  try {
    const crypto = getRandomCrypto(cryptos);
    if (!crypto) return false;

    const tradeAmount = generateTradeAmount(settings, userCredit);
    const profitPercentage = generateProfitPercentage(settings.riskLevel);
    const strategy = getRandomStrategy();
    
    // Calculate quantity based on current price
    const quantity = tradeAmount / crypto.current_price;
    
    // First simulate a "buy" trade
    const buyResult = await supabase
      .from('trade_simulations')
      .insert([
        {
          user_id: userId,
          crypto_asset_id: crypto.id,
          type: 'buy',
          quantity,
          price: crypto.current_price,
          total_amount: tradeAmount,
          strategy,
          status: 'completed'
        }
      ])
      .select()
      .single();
    
    if (buyResult.error) throw buyResult.error;
    
    // Deduct funds for buy operations
    await supabase
      .from('payments')
      .insert([
        {
          user_id: userId,
          user_email: '', // We don't need email for simulation
          amount: -tradeAmount * 100, // Store in cents
          status: 'completed',
          currency: 'EUR',
          wallet_currency: 'SIMULATION',
          notes: `KI-Bot: KAUF ${quantity.toFixed(6)} ${crypto.symbol} @ ${crypto.current_price.toFixed(2)}€ mit ${strategy}`
        }
      ]);
    
    // Calculate sell price with profit
    const sellPrice = crypto.current_price * (1 + (profitPercentage / 100));
    const sellAmount = quantity * sellPrice;
    const profit = sellAmount - tradeAmount;
    
    // Then simulate a "sell" trade with profit
    const sellResult = await supabase
      .from('trade_simulations')
      .insert([
        {
          user_id: userId,
          crypto_asset_id: crypto.id,
          type: 'sell',
          quantity,
          price: sellPrice,
          total_amount: sellAmount,
          strategy,
          status: 'completed'
        }
      ])
      .select()
      .single();
      
    if (sellResult.error) throw sellResult.error;
    
    // Add funds for sell operations (with profit)
    await supabase
      .from('payments')
      .insert([
        {
          user_id: userId,
          user_email: '', // We don't need email for simulation
          amount: sellAmount * 100, // Store in cents
          status: 'completed',
          currency: 'EUR',
          wallet_currency: 'SIMULATION',
          notes: `KI-Bot: VERKAUF ${quantity.toFixed(6)} ${crypto.symbol} @ ${sellPrice.toFixed(2)}€ mit ${strategy} (Gewinn: ${profit.toFixed(2)}€)`
        }
      ]);
    
    // Update bot status
    updateStatus({
      lastTradeTime: new Date(),
      totalProfitAmount: (prevAmount: number) => prevAmount + profit,
      totalProfitPercentage: (prevPercentage: number) => prevPercentage + profitPercentage,
      tradesExecuted: (prevTrades: number) => prevTrades + 1
    });
    
    toast({
      title: "KI-Bot Trade erfolgreich",
      description: `${profitPercentage.toFixed(2)}% Gewinn mit ${crypto.symbol} (${profit.toFixed(2)}€)`,
      variant: "default"
    });
    
    return true;
  } catch (error: any) {
    console.error('Error executing AI trade:', error.message);
    toast({
      title: "KI-Bot Fehler",
      description: error.message,
      variant: "destructive"
    });
    return false;
  }
};
