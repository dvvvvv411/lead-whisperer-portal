
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCryptos } from "@/hooks/useCryptos";
import { rankTiers } from "./ai-bot/botTradeUtils";
import { useBotInterval } from "./ai-bot/useBotInterval";
import { useBotState } from "./ai-bot/useBotState";
import { useBotOperations } from "./ai-bot/useBotOperations";
import { useDailyTradeCounter } from "./ai-bot/useDailyTradeCounter";

export const useAITradingBot = (userId?: string, userCredit?: number, onTradeExecuted?: () => void) => {
  const { toast } = useToast();
  const { cryptos } = useCryptos();
  
  // Use our modular hooks
  const { botInterval, clearBotInterval, setNewBotInterval, setBotInterval } = useBotInterval();
  const { settings, status, updateBotSettings, updateStatus, setSettings } = useBotState(userId, userCredit);
  
  // Track daily trades and update limits based on user rank
  useDailyTradeCounter(userId, userCredit, updateStatus);
  
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
    // Fix the type mismatch by creating a wrapper function
    (minutes: number) => { 
      setBotInterval(null); // First clear any existing interval by setting to null
    },
    // Fix the type mismatch - create an adapter function
    (newSettings) => {
      setSettings(prevSettings => ({...prevSettings, ...newSettings}));
    },
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
