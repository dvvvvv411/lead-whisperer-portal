
import { useCallback, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCryptos } from "@/hooks/useCryptos";
import { BotSettings, BotStatus } from "./types";
import { executeAITrade } from "./executeBotTrade";

export const useBotOperations = (
  userId?: string,
  userCredit?: number,
  settings?: BotSettings,
  status?: BotStatus,
  updateStatus?: (update: any) => void,
  clearBotInterval?: () => void,
  setNewBotInterval?: (callback: () => void, intervalTime: number) => NodeJS.Timeout,
  setBotInterval?: (interval: NodeJS.Timeout | null) => void,
  setSettings?: (setter: (prev: BotSettings) => BotSettings) => void,
  onTradeExecuted?: () => void
) => {
  const { toast } = useToast();
  const { cryptos } = useCryptos();
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Use a ref to track dialog closing to prevent race conditions
  const simulationInProgressRef = useRef(false);
  
  // Stop the AI trading bot
  const stopBot = useCallback(() => {
    if (!clearBotInterval || !setSettings || !updateStatus) return;

    clearBotInterval();
    setSettings(prev => ({ ...prev, isActive: false }));
    updateStatus({ isActive: false });
    
    toast({
      title: "KI-Bot deaktiviert",
      description: "Der KI-Trading-Bot wurde erfolgreich deaktiviert.",
    });
  }, [clearBotInterval, toast, setSettings, updateStatus]);
  
  // Start the AI trading bot
  const startBot = useCallback(() => {
    if (!setSettings || !updateStatus || !setNewBotInterval || !userId || !userCredit) return;
    
    // Set bot to active
    setSettings(prev => ({ ...prev, isActive: true }));
    updateStatus({ isActive: true });
    
    toast({
      title: "KI-Bot aktiviert",
      description: "Der KI-Trading-Bot wurde erfolgreich aktiviert.",
    });
    
    // The bot execution is still handled by manual trades only
  }, [userId, userCredit, toast, setSettings, updateStatus, setNewBotInterval]);
  
  // Execute a single trade
  const executeSingleTrade = useCallback(async () => {
    if (!userId || !userCredit || !updateStatus || !status || !settings || !cryptos) {
      console.log("Missing required parameters for executeSingleTrade", { userId, userCredit, status, settings });
      return false;
    }
    
    // Check if already simulating
    if (isSimulating || simulationInProgressRef.current) {
      console.log("Already simulating, ignoring new trade request");
      toast({
        title: "Transaktion in Bearbeitung",
        description: "Der KI-Bot analysiert bereits die Märkte für den optimalen Trade.",
      });
      return false;
    }
    
    // Check if user has reached daily limit
    if (status.tradesRemaining <= 0) {
      console.log("Daily trade limit reached", { 
        dailyTradesExecuted: status.dailyTradesExecuted, 
        maxTradesPerDay: status.maxTradesPerDay 
      });
      toast({
        title: "Tägliches Limit erreicht",
        description: `Sie haben bereits Ihr tägliches Limit von ${status.maxTradesPerDay} Trades erreicht. Erhöhen Sie Ihr Guthaben für mehr Trades.`,
        variant: "destructive"
      });
      return false;
    }
    
    // Set both state and ref to track simulation
    console.log("Starting trade simulation");
    setIsSimulating(true);
    simulationInProgressRef.current = true;
    
    // Return true to indicate that simulation has started
    return true;
  }, [userId, userCredit, cryptos, settings, toast, updateStatus, status, isSimulating]);
  
  // Complete trade after simulation
  const completeTradeAfterSimulation = useCallback(async () => {
    console.log("Completing trade after simulation");
    if (!userId || !userCredit || !updateStatus || !status || !settings || !cryptos) {
      console.log("Missing required parameters for completeTradeAfterSimulation");
      setIsSimulating(false);
      simulationInProgressRef.current = false;
      return { success: false };
    }
    
    try {
      const tradeResult = await executeAITrade(
        userId, 
        userCredit, 
        cryptos, 
        settings, 
        toast, 
        updateStatus, 
        status.dailyTradesExecuted,
        status.maxTradesPerDay
      );
      
      console.log("AI trade execution completed with result:", tradeResult);
      
      // Call the onTradeExecuted callback to update the parent components
      if (tradeResult.success && onTradeExecuted) {
        onTradeExecuted();
      }
      
      return tradeResult;
    } catch (error) {
      console.error("Error in completeTradeAfterSimulation:", error);
      toast({
        title: "Fehler bei der Ausführung des Trades",
        description: "Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      // Always reset simulating state, even on error
      setIsSimulating(false);
      simulationInProgressRef.current = false;
    }
  }, [userId, userCredit, cryptos, settings, toast, updateStatus, onTradeExecuted, status]);

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
