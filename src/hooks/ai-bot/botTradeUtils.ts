
import { supabase } from "@/integrations/supabase/client";
import { BotSettings } from "./types";

export const rankTiers = [
  {
    rankNumber: 1,
    minBalance: 250,
    maxBalance: 1000,
    maxTradesPerDay: 2,
    label: "Anfänger"
  },
  {
    rankNumber: 2,
    minBalance: 1000,
    maxBalance: 5000,
    maxTradesPerDay: 4,
    label: "Profi"
  },
  {
    rankNumber: 3,
    minBalance: 5000,
    maxBalance: 10000,
    maxTradesPerDay: 6,
    label: "Experte"
  },
  {
    rankNumber: 4,
    minBalance: 10000,
    maxBalance: 100000,
    maxTradesPerDay: 8,
    label: "Platin"
  },
  {
    rankNumber: 5,
    minBalance: 100000,
    maxBalance: null,
    maxTradesPerDay: 10,
    label: "Diamant"
  }
];

export const getUserRank = (userCredit: number) => {
  for (const rank of rankTiers) {
    if (userCredit >= rank.minBalance && (rank.maxBalance === null || userCredit <= rank.maxBalance)) {
      return rank;
    }
  }
  return rankTiers[0]; // Default to the first rank if no match is found
};

export const getRandomCrypto = (cryptos: any[]) => {
  // Filter out stablecoins
  const filteredCryptos = cryptos.filter(crypto =>
    crypto.symbol !== 'usdt' && crypto.symbol !== 'usdc' && crypto.symbol !== 'busd'
  );
  
  if (!filteredCryptos || filteredCryptos.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * filteredCryptos.length);
  return filteredCryptos[randomIndex];
};

export const getRandomStrategy = () => {
  const strategies = ['momentum', 'mean_reversion', 'breakout'];
  const randomIndex = Math.floor(Math.random() * strategies.length);
  return strategies[randomIndex];
};

export const generateProfitPercentage = () => {
  // Generate a random profit percentage between 3% and 7.5%
  return Math.random() * (0.075 - 0.03) + 0.03;
};

export const getTradesExecutedToday = async (userId: string): Promise<number> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data, error } = await supabase
    .from('trade_simulations')
    .select('id, type')
    .eq('user_id', userId)
    .gte('created_at', today.toISOString());
  
  if (error) {
    console.error("Error fetching trades for today:", error);
    return 0;
  }
  
  // Count both buy and sell trades, each type counts as 0.5 trades
  // This way a buy-sell pair will count as 1 complete trade
  return data.length;
};

// Modified to make the cooldown check optional
export const checkCanExecuteTrade = (
  dailyTradesExecuted: number,
  maxTradesPerDay: number,
  lastExecutedTimeRef: Date | null
) => {
  // Check if user has reached daily trade limit
  if (dailyTradesExecuted >= maxTradesPerDay) {
    return {
      canExecute: false,
      reason: `Sie haben bereits Ihr tägliches Limit von ${maxTradesPerDay} Trades erreicht. Erhöhen Sie Ihr Guthaben für mehr Trades.`
    };
  }
  
  // Skip cooldown check if lastExecutedTimeRef is null
  if (lastExecutedTimeRef) {
    // Check if we need to wait before executing the next trade (only if lastExecutedTimeRef is provided)
    const now = new Date();
    const diff = now.getTime() - lastExecutedTimeRef.getTime();
    const cooldownPeriod = 20 * 1000; // 20 seconds in milliseconds
    
    if (diff < cooldownPeriod) {
      const remainingSeconds = Math.ceil((cooldownPeriod - diff) / 1000);
      return {
        canExecute: false,
        reason: `Bitte warten Sie ${remainingSeconds} Sekunden vor dem nächsten Trade.`
      };
    }
  }
  
  // All checks passed
  return {
    canExecute: true,
    reason: ""
  };
};
