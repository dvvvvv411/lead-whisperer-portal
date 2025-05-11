import { useState, useCallback } from "react";
import { BotSettings, BotStatus, RankTier } from "./types";
import { getUserRank, rankTiers } from "./botTradeUtils";

export const useBotState = (userId?: string, userCredit?: number) => {
  // Get user's rank based on credit
  const userRank = userCredit ? getUserRank(userCredit) : rankTiers[0];
  
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
    // Rank-related fields
    currentRank: userRank.rankNumber,
    maxTradesPerDay: userRank.maxTradesPerDay,
    tradesRemaining: userRank.maxTradesPerDay,
    dailyTradesExecuted: 0
  });

  // Update bot status with proper typing
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

  // Update bot settings
  const updateBotSettings = useCallback((newSettings: Partial<BotSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  }, []);

  return {
    settings,
    status,
    setSettings,
    updateStatus,
    updateBotSettings
  };
};
