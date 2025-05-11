
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BotSettings } from "./types";
import { 
  generateTradeAmount, 
  getRandomCrypto, 
  getRandomStrategy,
  generateProfitPercentage,
  getUserRank,
  getTradesExecutedToday
} from "./botTradeUtils";

export const executeAITrade = async (
  userId: string | undefined,
  userCredit: number | undefined,
  cryptos: any[],
  settings: BotSettings,
  toast: ReturnType<typeof useToast>["toast"],
  updateStatus: (update: any) => void,
  tradesExecutedToday: number,
  maxTradesPerDay: number
) => {
  if (!userId || !userCredit || userCredit <= 0) {
    console.log("KI-Bot: Kein Benutzer oder kein Guthaben verfügbar", { userId, userCredit });
    return false;
  }
  
  // Check if user has reached daily trade limit
  if (tradesExecutedToday >= maxTradesPerDay) {
    console.log(`KI-Bot: Tägliches Handelslimit von ${maxTradesPerDay} Trades erreicht`);
    toast({
      title: "Tägliches Limit erreicht",
      description: `Sie haben bereits Ihr tägliches Limit von ${maxTradesPerDay} Trades erreicht. Erhöhen Sie Ihr Guthaben für mehr Trades.`,
      variant: "destructive"
    });
    return false;
  }

  try {
    const crypto = getRandomCrypto(cryptos);
    if (!crypto) {
      console.log("KI-Bot: Keine Kryptowährung gefunden");
      return false;
    }

    const tradeAmount = generateTradeAmount(settings, userCredit);
    // Updated to use fixed 5-10% profit range
    const profitPercentage = generateProfitPercentage();
    const strategy = `ai_${getRandomStrategy()}`;
    
    // Log trade information
    console.log(`KI-Bot: Starte Trade mit ${crypto.symbol}, Betrag: ${tradeAmount}€, Profitziel: ${profitPercentage}%`);
    
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
    
    if (buyResult.error) {
      console.error("KI-Bot: Fehler beim Erstellen des Kauf-Trades:", buyResult.error);
      throw buyResult.error;
    }
    
    console.log(`KI-Bot: Kauf-Trade erstellt, ID: ${buyResult.data?.id}`);
    
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
      
    if (sellResult.error) {
      console.error("KI-Bot: Fehler beim Erstellen des Verkauf-Trades:", sellResult.error);
      throw sellResult.error;
    }
    
    console.log(`KI-Bot: Verkauf-Trade erstellt, ID: ${sellResult.data?.id}`);
    
    // Update bot status
    updateStatus({
      lastTradeTime: new Date(),
      totalProfitAmount: (prevAmount: number) => prevAmount + profit,
      totalProfitPercentage: (prevPercentage: number) => prevPercentage + profitPercentage,
      tradesExecuted: (prevTrades: number) => prevTrades + 1,
      dailyTradesExecuted: (prevDailyTrades: number) => prevDailyTrades + 1,
      tradesRemaining: (prevRemaining: number) => prevRemaining - 1
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
