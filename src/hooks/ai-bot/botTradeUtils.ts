
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BotSettings } from "./types";

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

// Function to get a random crypto from the available list
export const getRandomCrypto = (cryptos: any[]) => {
  if (!cryptos || cryptos.length === 0) return null;
  return cryptos[Math.floor(Math.random() * cryptos.length)];
};

// Function to generate a random strategy
export const getRandomStrategy = () => {
  // Added prefix to strategies to make it easier to identify bot trades
  const strategies = ['bot_trend_following', 'bot_mean_reversion', 'bot_momentum', 'bot_sentiment', 'ai_deep_learning'];
  return strategies[Math.floor(Math.random() * strategies.length)];
};

// Function to generate a random profit percentage based on risk level
export const generateProfitPercentage = (riskLevel: BotSettings['riskLevel']) => {
  let range;
  switch(riskLevel) {
    case 'conservative':
      range = { min: 3, max: 8 };
      break;
    case 'aggressive':
      range = { min: 10, max: 20 };
      break;
    case 'balanced':
    default:
      range = { min: 5, max: 15 };
      break;
  }
  return Math.random() * (range.max - range.min) + range.min;
};
