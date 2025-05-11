
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
  const { botInterval, clearBotInterval, setNewBotInterval } = useBotInterval();
  const { settings, status, updateBotSettings, updateStatus, setSettings } = useBotState(userId, userCredit);
  
  // Track daily trades and update limits based on user rank
  useDailyTradeCounter(userId, userCredit, updateStatus);
  
  // Wrap setSettings to accept Partial<BotSettings>
  const handleSetSettings = useCallback((newSettings: Partial<BotSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, [setSettings]);
  
  // Create an enhanced trade executed callback that ensures data refresh
  const handleTradeExecuted = useCallback(() => {
    console.log("Trade executed callback triggered");
    if (onTradeExecuted) {
      console.log("Calling parent onTradeExecuted callback");
      onTradeExecuted();
    }
  }, [onTradeExecuted]);
  
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
    null, // Remove setBotInterval parameter since it's not needed
    handleSetSettings,
    handleTradeExecuted // Use our enhanced callback
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
