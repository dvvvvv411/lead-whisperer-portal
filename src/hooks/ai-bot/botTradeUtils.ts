
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BotSettings, RankTier } from "./types";

// List of stablecoin symbols that should be excluded from trading
const STABLECOIN_SYMBOLS = ['USDT', 'USDC', 'BUSD', 'DAI', 'UST', 'TUSD', 'USDP', 'GUSD', 'FRAX'];

// Function to generate a random trade amount based on settings and available credit
export const generateTradeAmount = (settings: BotSettings, userCredit?: number) => {
  if (!userCredit) return 10;
  
  const maxAmount = Math.min(settings.maxTradeAmount, userCredit * 0.5);
  let minAmount = 10;
  
  switch(settings.riskLevel) {
    case 'conservative':
      return Math.random() * (maxAmount * 0.5 - minAmount) + minAmount;
    case 'aggressive':
      return Math.random() * (maxAmount - maxAmount * 0.5) + maxAmount * 0.5;
    case 'balanced':
    default:
      return Math.random() * (maxAmount - minAmount) + minAmount;
  }
};

// Function to get a random crypto from the available list, excluding stablecoins
export const getRandomCrypto = (cryptos: any[]) => {
  if (!cryptos || cryptos.length === 0) return null;
  
  // Filter out stablecoins
  const tradableCryptos = cryptos.filter(crypto => 
    !STABLECOIN_SYMBOLS.includes(crypto.symbol.toUpperCase())
  );
  
  if (tradableCryptos.length === 0) return null; // Safety check
  
  return tradableCryptos[Math.floor(Math.random() * tradableCryptos.length)];
};

// Function to generate a random strategy
export const getRandomStrategy = () => {
  const strategies = ['bot_trend_following', 'bot_mean_reversion', 'bot_momentum', 'bot_sentiment', 'ai_deep_learning'];
  return strategies[Math.floor(Math.random() * strategies.length)];
};

// Function to generate a profit percentage based on specified range (3-7.5%)
export const generateProfitPercentage = () => {
  // Changed to return between 3-7.5% profit
  return Math.random() * (7.5 - 3) + 3;
};

// Define rank tiers based on account balance
export const rankTiers: RankTier[] = [
  { 
    rankNumber: 1, 
    minBalance: 250, 
    maxBalance: 999.99, 
    maxTradesPerDay: 2,
    label: "Starter Trader" 
  },
  { 
    rankNumber: 2, 
    minBalance: 1000, 
    maxBalance: 4999.99, 
    maxTradesPerDay: 4,
    label: "Advanced Trader" 
  },
  { 
    rankNumber: 3, 
    minBalance: 5000, 
    maxBalance: 9999.99, 
    maxTradesPerDay: 8,
    label: "Expert Trader" 
  },
  { 
    rankNumber: 4, 
    minBalance: 10000, 
    maxBalance: null, 
    maxTradesPerDay: 10,
    label: "Elite Trader" 
  },
];

// Function to get user's current rank based on account balance
export const getUserRank = (userCredit: number): RankTier => {
  // Default to lowest rank if credit is too low
  if (userCredit < 250) {
    return rankTiers[0];
  }
  
  // Find the appropriate rank tier
  for (let i = rankTiers.length - 1; i >= 0; i--) {
    if (userCredit >= rankTiers[i].minBalance) {
      return rankTiers[i];
    }
  }
  
  // Fallback to lowest rank
  return rankTiers[0];
};

// Modified function to count only buy transactions (treating a buy-sell pair as one trade)
// This effectively counts each complete trade (buy+sell) as a single trade
export const getTradesExecutedToday = async (userId: string): Promise<number> => {
  if (!userId) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data, error } = await supabase
    .from('trade_simulations')
    .select('id')
    .eq('user_id', userId)
    .eq('type', 'buy') // Only count buy operations as trades
    .gte('created_at', today.toISOString())
    .or('strategy.ilike.ai_%,strategy.ilike.bot_%');
  
  if (error) {
    console.error("Error fetching today's trades:", error);
    return 0;
  }
  
  return data ? data.length : 0;
};
