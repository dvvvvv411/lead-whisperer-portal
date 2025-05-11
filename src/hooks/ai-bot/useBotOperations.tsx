
import { useCallback, useState } from "react";
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
  
  // Execute a single trade
  const executeSingleTrade = useCallback(async () => {
    if (!userId || !userCredit || !updateStatus || !status || !settings || !cryptos) {
      console.log("Missing required parameters for executeSingleTrade", { userId, userCredit, status, settings });
      return false;
    }
    
    // Check if already simulating
    if (isSimulating) {
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
    
    // Set simulating state to true to show dialog
    console.log("Starting trade simulation");
    setIsSimulating(true);
    
    // Return true to indicate that simulation has started
    return true;
  }, [userId, userCredit, cryptos, settings, toast, updateStatus, status, isSimulating]);
  
  // Complete trade after simulation
  const completeTradeAfterSimulation = useCallback(async () => {
    console.log("Completing trade after simulation");
    if (!userId || !userCredit || !updateStatus || !status || !settings || !cryptos) {
      console.log("Missing required parameters for completeTradeAfterSimulation");
      setIsSimulating(false);
      return false;
    }
    
    try {
      const success = await executeAITrade(
        userId, 
        userCredit, 
        cryptos, 
        settings, 
        toast, 
        updateStatus, 
        status.dailyTradesExecuted,
        status.maxTradesPerDay
      );
      
      console.log("AI trade execution completed with result:", success);
      
      // Call the onTradeExecuted callback to update the parent components
      if (success && onTradeExecuted) {
        onTradeExecuted();
      }
      
      return success;
    } catch (error) {
      console.error("Error in completeTradeAfterSimulation:", error);
      toast({
        title: "Fehler bei der Ausführung des Trades",
        description: "Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
      return false;
    } finally {
      // Always reset simulating state, even on error
      setIsSimulating(false);
    }
  }, [userId, userCredit, cryptos, settings, toast, updateStatus, onTradeExecuted, status]);
  
  // Start the AI trading bot - no longer used but kept for compatibility
  const startBot = useCallback(() => {
    // This function is now empty as the bot activation is removed
    // but we keep it for API compatibility
  }, []);

  return {
    startBot,
    stopBot,
    executeSingleTrade,
    completeTradeAfterSimulation,
    isSimulating,
    setIsSimulating
  };
};
