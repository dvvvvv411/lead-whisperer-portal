
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
    console.log("KI-Bot: Kein Benutzer oder kein Guthaben verfügbar", { userId, userCredit });
    return false;
  }

  try {
    const crypto = getRandomCrypto(cryptos);
    if (!crypto) {
      console.log("KI-Bot: Keine Kryptowährung gefunden");
      return false;
    }

    const tradeAmount = generateTradeAmount(settings, userCredit);
    const profitPercentage = generateProfitPercentage(settings.riskLevel);
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
    
    // Deduct funds for buy operations
    const buyPaymentResult = await supabase
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
      ])
      .select()
      .single();
      
    if (buyPaymentResult.error) {
      console.error("KI-Bot: Fehler beim Erstellen der Kauf-Zahlung:", buyPaymentResult.error);
      throw buyPaymentResult.error;
    }
    
    console.log(`KI-Bot: Kauf-Zahlung erstellt, ID: ${buyPaymentResult.data?.id}`);
    
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
    
    // Add funds for sell operations (with profit)
    const sellPaymentResult = await supabase
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
      ])
      .select()
      .single();
      
    if (sellPaymentResult.error) {
      console.error("KI-Bot: Fehler beim Erstellen der Verkauf-Zahlung:", sellPaymentResult.error);
      throw sellPaymentResult.error;
    }
    
    console.log(`KI-Bot: Verkauf-Zahlung erstellt, ID: ${sellPaymentResult.data?.id}, Gewinn: ${profit.toFixed(2)}€`);
    
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
    
    // Call the callback to update the parent component
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
