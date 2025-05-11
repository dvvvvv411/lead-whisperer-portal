
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BotSettings } from "./types";
import { 
  getRandomCrypto, 
  getRandomStrategy,
  generateProfitPercentage,
  getUserRank,
  getTradesExecutedToday
} from "./botTradeUtils";
import {
  calculateBuyPrice,
  calculateProfit
} from "@/components/user/trading/bot-components/simulation/simulationUtils";

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
    return { success: false };
  }
  
  // Check if user has reached daily trade limit
  if (tradesExecutedToday >= maxTradesPerDay) {
    console.log(`KI-Bot: Tägliches Handelslimit von ${maxTradesPerDay} Trades erreicht`);
    toast({
      title: "Tägliches Limit erreicht",
      description: `Sie haben bereits Ihr tägliches Limit von ${maxTradesPerDay} Trades erreicht. Erhöhen Sie Ihr Guthaben für mehr Trades.`,
      variant: "destructive"
    });
    return { success: false };
  }

  try {
    const crypto = getRandomCrypto(cryptos);
    if (!crypto) {
      console.log("KI-Bot: Keine Kryptowährung gefunden");
      return { success: false };
    }

    // Use entire account balance for the trade (minus a small safety buffer)
    const safetyBuffer = 0.5; // 50 cents buffer
    const tradeAmount = Math.max(0, userCredit - safetyBuffer);
    
    // Generate profit percentage between 5-10%
    const profitPercentage = generateProfitPercentage();
    const strategy = `ai_${getRandomStrategy()}`;
    
    // Current market price from the real crypto data
    const currentPrice = crypto.current_price;
    
    // Calculate buy price - price needs to be lower than current price to make profit
    const buyPrice = calculateBuyPrice(currentPrice, profitPercentage);
    
    // Sell price is the current market price
    const sellPrice = currentPrice;
    
    // Calculate quantity based on buy price
    const quantity = tradeAmount / buyPrice;
    
    // Calculate profit
    const profit = calculateProfit(tradeAmount, profitPercentage);
    const sellAmount = tradeAmount + profit;
    
    // Log trade information
    console.log(`KI-Bot: Starte Trade mit ${crypto.symbol}, Betrag: ${tradeAmount}€, Profitziel: ${profitPercentage}%`);
    console.log(`KI-Bot: Kaufpreis: ${buyPrice}€, Verkaufspreis: ${sellPrice}€, Gewinn: ${profit}€`);
    
    // First simulate a "buy" trade
    const buyResult = await supabase
      .from('trade_simulations')
      .insert([
        {
          user_id: userId,
          crypto_asset_id: crypto.id,
          type: 'buy',
          quantity,
          price: buyPrice,
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
    // Note: We now consider a buy-sell pair as a single trade
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
    
    // Return trade details for the result dialog
    return {
      success: true,
      crypto,
      tradeAmount,
      profit,
      profitPercentage,
      buyPrice,
      sellPrice,
      quantity,
      sellAmount
    };
  } catch (error: any) {
    console.error('Error executing AI trade:', error.message);
    toast({
      title: "KI-Bot Fehler",
      description: error.message,
      variant: "destructive"
    });
    return { success: false };
  }
};
