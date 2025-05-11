
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCryptos } from "@/hooks/useCryptos";

interface BotSettings {
  isActive: boolean;
  tradeFrequency: 'low' | 'medium' | 'high';
  riskLevel: 'conservative' | 'balanced' | 'aggressive';
  maxTradeAmount: number;
}

interface BotStatus {
  isActive: boolean;
  lastTradeTime: Date | null;
  totalProfitPercentage: number;
  totalProfitAmount: number;
  tradesExecuted: number;
}

export const useAITradingBot = (userId?: string, userCredit?: number) => {
  const { toast } = useToast();
  const { cryptos } = useCryptos();
  const [settings, setSettings] = useState<BotSettings>({
    isActive: false,
    tradeFrequency: 'medium',
    riskLevel: 'balanced',
    maxTradeAmount: 100, // Default max amount per trade
  });
  const [status, setStatus] = useState<BotStatus>({
    isActive: false,
    lastTradeTime: null,
    totalProfitPercentage: 0,
    totalProfitAmount: 0,
    tradesExecuted: 0,
  });
  const [botInterval, setBotInterval] = useState<NodeJS.Timeout | null>(null);

  // Function to generate a random trade amount based on settings and available credit
  const generateTradeAmount = useCallback(() => {
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
  }, [settings.riskLevel, settings.maxTradeAmount, userCredit]);

  // Function to get a random crypto from the available list
  const getRandomCrypto = useCallback(() => {
    if (!cryptos || cryptos.length === 0) return null;
    return cryptos[Math.floor(Math.random() * cryptos.length)];
  }, [cryptos]);

  // Function to generate a random strategy
  const getRandomStrategy = useCallback(() => {
    // Added prefix to strategies to make it easier to identify bot trades
    const strategies = ['bot_trend_following', 'bot_mean_reversion', 'bot_momentum', 'bot_sentiment', 'ai_deep_learning'];
    return strategies[Math.floor(Math.random() * strategies.length)];
  }, []);

  // Function to generate a random profit percentage (3-20%)
  const generateProfitPercentage = useCallback(() => {
    let range;
    switch(settings.riskLevel) {
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
  }, [settings.riskLevel]);

  // Execute a single AI trade simulation
  const executeAITrade = useCallback(async () => {
    if (!userId || !userCredit || userCredit <= 0) {
      setSettings(prev => ({ ...prev, isActive: false }));
      setStatus(prev => ({ ...prev, isActive: false }));
      clearBotInterval();
      toast({
        title: "Bot deaktiviert",
        description: "Nicht genügend Guthaben für weitere Trades.",
        variant: "destructive"
      });
      return;
    }

    try {
      const crypto = getRandomCrypto();
      if (!crypto) return;

      const tradeAmount = generateTradeAmount();
      const profitPercentage = generateProfitPercentage();
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
      setStatus(prev => ({
        ...prev,
        lastTradeTime: new Date(),
        totalProfitAmount: prev.totalProfitAmount + profit,
        totalProfitPercentage: prev.totalProfitPercentage + profitPercentage,
        tradesExecuted: prev.tradesExecuted + 1
      }));
      
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
  }, [userId, userCredit, cryptos, toast, getRandomCrypto, generateTradeAmount, generateProfitPercentage, getRandomStrategy]);

  // Clear the bot interval
  const clearBotInterval = useCallback(() => {
    if (botInterval) {
      clearInterval(botInterval);
      setBotInterval(null);
    }
  }, [botInterval]);
  
  // Start the AI trading bot
  const startBot = useCallback(() => {
    if (!userId || !userCredit) {
      toast({
        title: "Bot kann nicht aktiviert werden",
        description: "Benutzer nicht angemeldet oder kein Guthaben verfügbar.",
        variant: "destructive"
      });
      return;
    }
    
    // Clear any existing interval
    clearBotInterval();
    
    // Set interval time based on frequency setting
    let intervalTime = 60000; // default 1 minute
    switch(settings.tradeFrequency) {
      case 'low':
        intervalTime = 180000; // 3 minutes
        break;
      case 'high':
        intervalTime = 30000; // 30 seconds
        break;
      case 'medium':
      default:
        intervalTime = 60000; // 1 minute
        break;
    }
    
    // Execute a trade immediately
    executeAITrade();
    
    // Set up interval for recurring trades
    const interval = setInterval(() => {
      executeAITrade();
    }, intervalTime);
    
    setBotInterval(interval);
    setSettings(prev => ({ ...prev, isActive: true }));
    setStatus(prev => ({ ...prev, isActive: true }));
    
    toast({
      title: "KI-Bot aktiviert",
      description: "Der KI-Trading-Bot wurde erfolgreich aktiviert und wird nun automatisch handeln.",
    });
  }, [userId, userCredit, settings.tradeFrequency, toast, executeAITrade, clearBotInterval]);
  
  // Stop the AI trading bot
  const stopBot = useCallback(() => {
    clearBotInterval();
    setSettings(prev => ({ ...prev, isActive: false }));
    setStatus(prev => ({ ...prev, isActive: false }));
    
    toast({
      title: "KI-Bot deaktiviert",
      description: "Der KI-Trading-Bot wurde erfolgreich deaktiviert.",
    });
  }, [clearBotInterval, toast]);
  
  // Update bot settings
  const updateBotSettings = useCallback((newSettings: Partial<BotSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
    
    // If frequency is updated while bot is active, restart the bot
    if ('tradeFrequency' in newSettings && settings.isActive) {
      clearBotInterval();
      startBot();
    }
  }, [settings.isActive, clearBotInterval, startBot]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearBotInterval();
    };
  }, [clearBotInterval]);

  return {
    settings,
    status,
    startBot,
    stopBot,
    updateBotSettings,
  };
};
