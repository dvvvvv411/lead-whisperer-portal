
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCryptos } from "@/hooks/useCryptos";
import { rankTiers } from "./ai-bot/botTradeUtils";
import { useBotInterval } from "./ai-bot/useBotInterval";
import { useBotState } from "./ai-bot/useBotState";
import { useBotOperations } from "./ai-bot/useBotOperations";
import { useDailyTradeCounter } from "./ai-bot/useDailyTradeCounter";
import { BotSettings } from "./ai-bot/types";

export const useAITradingBot = (userId?: string, userCredit?: number, onTradeExecuted?: () => void) => {
  const { toast } = useToast();
  const { cryptos } = useCryptos();
  
  // Use our modular hooks
  const { botInterval, clearBotInterval, setNewBotInterval, setBotInterval } = useBotInterval();
  const { settings, status, updateBotSettings, updateStatus, setSettings } = useBotState(userId, userCredit);
  
  // Track daily trades and update limits based on user rank
  useDailyTradeCounter(userId, userCredit, updateStatus);
  
  // Create a wrapper function for setSettings to match the expected type
  const handleSetSettings = useCallback((newSettings: Partial<BotSettings>) => {
    setSettings(prev => ({...prev, ...newSettings}));
  }, [setSettings]);
  
  // Bot operations (start, stop, execute trade)
  const { 
    startBot, 
    stopBot, 
    executeSingleTrade, 
    completeTradeAfterSimulation,
    isSimulating,
    setIsSimulating,
    simulationInProgressRef
  } = useBotOperations(
    userId,
    userCredit,
    settings,
    status,
    updateStatus,
    clearBotInterval,
    setNewBotInterval,
    setBotInterval,
    handleSetSettings,  // Use the wrapper function instead of setSettings directly
    onTradeExecuted
  );
  
  return {
    settings,
    status,
    startBot,
    stopBot,
    updateBotSettings,
    executeSingleTrade,
    completeTradeAfterSimulation,
    isSimulating,
    setIsSimulating,
    simulationInProgressRef,
    rankTiers,
  };
};
