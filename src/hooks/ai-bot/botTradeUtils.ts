
import { supabase } from "@/integrations/supabase/client";
import { BotSettings } from "./types";

export const rankTiers = [
  {
    rankNumber: 1,
    minBalance: 0,
    maxBalance: 100,
    maxTradesPerDay: 3,
    label: "Anfänger"
  },
  {
    rankNumber: 2,
    minBalance: 101,
    maxBalance: 500,
    maxTradesPerDay: 5,
    label: "Fortgeschrittener"
  },
  {
    rankNumber: 3,
    minBalance: 501,
    maxBalance: 1000,
    maxTradesPerDay: 7,
    label: "Experte"
  },
  {
    rankNumber: 4,
    minBalance: 1001,
    maxBalance: 5000,
    maxTradesPerDay: 10,
    label: "Profi"
  },
  {
    rankNumber: 5,
    minBalance: 5001,
    maxBalance: null,
    maxTradesPerDay: 15,
    label: "Elite"
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
    .select('id')
    .eq('user_id', userId)
    .gte('created_at', today.toISOString());
  
  if (error) {
    console.error("Error fetching trades for today:", error);
    return 0;
  }
  
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
