
import { useState, useRef } from "react";
import { BotSettings, BotStatus } from "./types";
import { useBotTradeExecution } from "./useBotTradeExecution";
import { useBotControls } from "./useBotControls";

export const useBotOperations = (
  userId?: string, 
  userCredit?: number,
  settings?: BotSettings, 
  status?: BotStatus,
  updateStatus?: (newStatus: Partial<BotStatus>) => void,
  clearBotInterval?: () => void,
  setNewBotInterval?: (callback: () => void, minutes: number) => void,
  _unused?: null, // Keep this parameter for now but mark it as unused
  setSettings?: (newSettings: Partial<BotSettings>) => void,
  onTradeExecuted?: () => void
) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationInProgressRef = useRef<boolean>(false);
  
  // Use our new trade execution hook
  const {
    executeSingleTrade,
    completeTradeAfterSimulation,
  } = useBotTradeExecution(
    userId,
    userCredit,
    settings,
    status,
    updateStatus,
    onTradeExecuted
  );
  
  // Use our new bot controls hook
  const { startBot, stopBot } = useBotControls(
    userId,
    status,
    updateStatus,
    clearBotInterval,
    setNewBotInterval,
    executeSingleTrade
  );
  
  return {
    startBot,
    stopBot,
    executeSingleTrade,
    completeTradeAfterSimulation,
    isSimulating,
    setIsSimulating,
    simulationInProgressRef
  };
};
