
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCryptos } from "@/hooks/useCryptos";
import { BotSettings, BotStatus } from "./ai-bot/types";
import { executeAITrade } from "./ai-bot/executeBotTrade";

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

  // Update bot status - explicitly type the update parameter with proper function typing
  const updateStatus = useCallback((update: Partial<BotStatus> | ((prev: BotStatus) => Partial<BotStatus>)) => {
    setStatus((prev) => {
      const newStatus = { ...prev };
      
      // Process each key in the update object
      if (typeof update === 'function') {
        // If update is a function, call it with previous status
        const updateResult = update(prev);
        return { ...prev, ...updateResult };
      } else {
        // If update is an object, directly apply updates
        Object.keys(update).forEach((key) => {
          const typedKey = key as keyof BotStatus;
          const updateValue = update[typedKey];
          
          if (typeof updateValue === 'function') {
            // Properly type the function to avoid "not callable" error
            type UpdateFunction = (prevValue: any) => any;
            const typedUpdateFn = updateValue as UpdateFunction;
            (newStatus[typedKey] as any) = typedUpdateFn(prev[typedKey]);
          } else {
            // Otherwise just update the value
            (newStatus[typedKey] as any) = updateValue;
          }
        });
      }
      
      return newStatus;
    });
  }, []);

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
    executeAITrade(userId, userCredit, cryptos, settings, toast, updateStatus);
    
    // Set up interval for recurring trades
    const interval = setInterval(() => {
      executeAITrade(userId, userCredit, cryptos, settings, toast, updateStatus);
    }, intervalTime);
    
    setBotInterval(interval);
    setSettings(prev => ({ ...prev, isActive: true }));
    setStatus(prev => ({ ...prev, isActive: true }));
    
    toast({
      title: "KI-Bot aktiviert",
      description: "Der KI-Trading-Bot wurde erfolgreich aktiviert und wird nun automatisch handeln.",
    });
  }, [userId, userCredit, cryptos, settings, toast, clearBotInterval, updateStatus]);
  
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
