
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

interface ExecuteTradeParams {
  userId: string;
  userCredit: number;
  tradeAmount?: number;
  riskLevel?: 'conservative' | 'balanced' | 'aggressive';
  cryptos?: any[];
}

export const executeAITrade = async ({
  userId,
  userCredit,
  tradeAmount,
  riskLevel = 'balanced',
  cryptos = []
}: ExecuteTradeParams) => {
  if (!userId || !userCredit || userCredit <= 0) {
    console.log("KI-Bot: Kein Benutzer oder kein Guthaben verfügbar", { userId, userCredit });
    return { success: false, error: "Kein Benutzer oder kein Guthaben verfügbar" };
  }
  
  try {
    // Get user's rank and daily trade limits
    const userRank = getUserRank(userCredit);
    const maxTradesPerDay = userRank.maxTradesPerDay;
    
    // Check if user has reached daily trade limit
    const tradesExecutedToday = await getTradesExecutedToday(userId);
    if (tradesExecutedToday >= maxTradesPerDay) {
      console.log(`KI-Bot: Tägliches Handelslimit von ${maxTradesPerDay} Trades erreicht`);
      return { 
        success: false,
        error: `Sie haben bereits Ihr tägliches Limit von ${maxTradesPerDay} Trades erreicht. Erhöhen Sie Ihr Guthaben für mehr Trades.`
      };
    }

    // If no cryptos were provided, fetch them from the database
    let cryptoData = cryptos;
    if (!cryptoData || cryptoData.length === 0) {
      console.log("KI-Bot: Keine Kryptowährungen übergeben, hole sie aus der Datenbank");
      
      const { data, error } = await supabase
        .from('crypto_assets')
        .select('*')
        .order('market_cap', { ascending: false });
        
      if (error) {
        console.error("KI-Bot: Fehler beim Laden der Kryptowährungen:", error);
        return { success: false, error: "Fehler beim Laden der Kryptowährungen" };
      }
      
      cryptoData = data || [];
      console.log(`KI-Bot: ${cryptoData.length} Kryptowährungen aus der Datenbank geladen`);
    }

    // Ensure we have crypto data to work with
    if (!cryptoData || cryptoData.length === 0) {
      console.log("KI-Bot: Keine Kryptowährungen verfügbar");
      return { success: false, error: "Keine Kryptowährungen verfügbar" };
    }
    
    // Filter out stablecoins and any invalid entries
    const validCryptos = cryptoData.filter(crypto => 
      crypto && 
      crypto.id && 
      crypto.symbol && 
      crypto.current_price > 0 && 
      !['usdt', 'usdc', 'busd', 'dai', 'tusd'].includes(crypto.symbol.toLowerCase())
    );
    
    console.log(`KI-Bot: ${validCryptos.length} gültige Kryptowährungen nach Filterung`);
    
    if (validCryptos.length === 0) {
      return { success: false, error: "Keine geeigneten Kryptowährungen nach Filterung verfügbar" };
    }

    // Get random crypto from filtered list
    const crypto = getRandomCrypto(validCryptos);
    if (!crypto) {
      console.log("KI-Bot: Keine geeignete Kryptowährung gefunden, obwohl ${validCryptos.length} verfügbar sind");
      return { success: false, error: "Keine geeignete Kryptowährung gefunden" };
    }

    console.log(`KI-Bot: Kryptowährung für Trade ausgewählt: ${crypto.symbol} (${crypto.name})`);

    // Verwende das gesamte Kontoguthaben für den Trade (mit einer kleinen Sicherheitsreserve)
    const safetyBuffer = 0.01; // 1 Cent Sicherheitsreserve
    const actualTradeAmount = tradeAmount || Math.max(0, userCredit - safetyBuffer);
    
    console.log(`KI-Bot: Verwende ${actualTradeAmount}€ für den Trade (von ${userCredit}€ Gesamtguthaben)`);
    
    // Generate profit percentage between 3-7.5%
    const profitPercentage = generateProfitPercentage();
    const strategy = `ai_${getRandomStrategy()}`;
    
    // Current market price from the real crypto data
    const currentPrice = crypto.current_price;
    
    // Calculate buy price - price needs to be lower than current price to make profit
    const buyPrice = calculateBuyPrice(currentPrice);
    
    // Sell price is the current market price
    const sellPrice = currentPrice;
    
    // Calculate quantity based on buy price
    const quantity = actualTradeAmount / buyPrice;
    
    // Calculate profit
    const profit = calculateProfit(actualTradeAmount, profitPercentage);
    const sellAmount = actualTradeAmount + profit;
    
    // Log trade information
    console.log(`KI-Bot: Starte Trade mit ${crypto.symbol}, Betrag: ${actualTradeAmount}€, Profitziel: ${profitPercentage * 100}%`);
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
          total_amount: actualTradeAmount,
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
    
    return {
      success: true,
      crypto,
      tradeAmount: actualTradeAmount,
      profit,
      profitPercentage,
      buyPrice,
      sellPrice,
      quantity,
      sellAmount
    };
  } catch (error: any) {
    console.error('Error executing AI trade:', error.message);
    return { 
      success: false, 
      error: error.message || "Unbekannter Fehler beim Ausführen des Trades"
    };
  }
};
