import { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { executeAITrade } from "./executeBotTrade";
import { BotSettings, BotStatus } from "./types";
import { checkCanExecuteTrade } from "./botTradeUtils";

export const useBotOperations = (
  userId?: string, 
  userCredit?: number,
  settings?: BotSettings, 
  status?: BotStatus,
  updateStatus?: (newStatus: Partial<BotStatus>) => void,
  clearBotInterval?: () => void,
  setNewBotInterval?: (callback: () => void, minutes: number) => void,
  setBotInterval?: (minutes: number) => void,
  setSettings?: (newSettings: Partial<BotSettings>) => void,
  onTradeExecuted?: () => void
) => {
  const { toast } = useToast();
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationInProgressRef = useRef(false);
  const lastExecutedRef = useRef<Date | null>(null);
  
  // Start the trading bot
  const startBot = useCallback(() => {
    if (!userId || !status || !updateStatus || !setNewBotInterval || !settings) {
      console.log("Cannot start bot: missing required data");
      return;
    }
    
    // Only allow starting if not already running
    if (status.isRunning) {
      console.log("Bot is already running");
      return;
    }
    
    console.log("Starting trading bot with interval:", settings.tradeInterval, "minutes");
    
    // Update status to running
    updateStatus({
      isRunning: true,
      statusMessage: "Bot ist aktiv und handelt automatisch"
    });
    
    // Set the bot interval based on current settings
    setNewBotInterval(() => {
      executeSingleTrade().then(success => {
        if (success) {
          console.log("Bot executed first trade successfully");
        }
      });
    }, settings.tradeInterval);
    
    toast({
      title: "Trading Bot gestartet",
      description: `Der Bot wird alle ${settings.tradeInterval} Minuten automatisch handeln.`
    });
    
  }, [userId, status, updateStatus, setNewBotInterval, settings, toast]);
  
  // Stop the trading bot
  const stopBot = useCallback(() => {
    if (!status || !updateStatus || !clearBotInterval) {
      console.log("Cannot stop bot: missing required data");
      return;
    }
    
    // Only stop if running
    if (!status.isRunning) {
      console.log("Bot is not running");
      return;
    }
    
    console.log("Stopping trading bot");
    
    // Clear the interval
    clearBotInterval();
    
    // Update status to stopped
    updateStatus({
      isRunning: false,
      statusMessage: "Bot ist gestoppt"
    });
    
    toast({
      title: "Trading Bot gestoppt",
      description: "Der automatische Handel wurde beendet."
    });
    
  }, [status, updateStatus, clearBotInterval, toast]);
  
  // Execute a single trade
  const executeSingleTrade = useCallback(async () => {
    console.log("Checking if trade can be executed...");
    
    if (!userId || !settings || !status || !updateStatus) {
      console.log("Cannot execute trade: missing required data");
      return false;
    }
    
    // Check if we can execute a trade (daily limit, etc.)
    const canExecute = checkCanExecuteTrade(
      status.dailyTradesExecuted,
      status.maxTradesPerDay,
      lastExecutedRef.current
    );
    
    if (!canExecute.canExecute) {
      console.log("Cannot execute trade:", canExecute.reason);
      toast({
        title: "Handel nicht möglich",
        description: canExecute.reason,
        variant: "destructive"
      });
      return false;
    }
    
    // Set simulation in progress
    simulationInProgressRef.current = true;
    setIsSimulating(true);
    
    // Update last executed time
    lastExecutedRef.current = new Date();
    
    // Update status
    updateStatus({
      lastTradeAttempt: new Date(),
      statusMessage: "Trade wird ausgeführt...",
      dailyTradesExecuted: status.dailyTradesExecuted + 1
    });
    
    console.log("Trade can be executed, simulation starting...");
    return true;
    
  }, [userId, settings, status, updateStatus, toast]);
  
  // Complete trade after simulation is done
  const completeTradeAfterSimulation = useCallback(async () => {
    console.log("Completing trade after simulation...");
    
    if (!userId || !userCredit || !settings) {
      console.log("Cannot complete trade: missing required data");
      return { success: false, error: "Missing required data" };
    }
    
    try {
      // Execute the actual trade with the bot's strategy
      const result = await executeAITrade({
        userId,
        userCredit,
        tradeAmount: settings.maxTradeAmount,
        riskLevel: settings.riskLevel,
      });
      
      if (result.success) {
        // Update status with trade info
        if (updateStatus && status) {
          updateStatus({
            statusMessage: "Letzter Trade erfolgreich",
            lastSuccessfulTrade: new Date(),
            totalProfitAmount: (status.totalProfitAmount || 0) + result.profit,
            tradesExecuted: (status.tradesExecuted || 0) + 1
          });
        }
        
        // Call the onTradeExecuted callback if provided
        if (onTradeExecuted) {
          onTradeExecuted();
        }
        
        console.log("Trade completed successfully:", result);
        toast({
          title: "Trade erfolgreich",
          description: `${result.profit.toFixed(2)}€ Gewinn (${result.profitPercentage.toFixed(2)}%)`,
        });
      } else {
        // Update status with failure
        if (updateStatus) {
          updateStatus({
            statusMessage: "Letzter Trade fehlgeschlagen: " + result.error,
          });
        }
        
        console.log("Trade failed:", result.error);
        toast({
          title: "Trade fehlgeschlagen",
          description: result.error,
          variant: "destructive"
        });
      }
      
      // Reset simulation state
      simulationInProgressRef.current = false;
      
      return result;
      
    } catch (error: any) {
      console.error("Error executing trade:", error);
      
      // Update status with error
      if (updateStatus) {
        updateStatus({
          statusMessage: "Fehler beim Ausführen des Trades",
        });
      }
      
      toast({
        title: "Fehler",
        description: "Es ist ein Fehler beim Ausführen des Trades aufgetreten.",
        variant: "destructive"
      });
      
      // Reset simulation state
      simulationInProgressRef.current = false;
      
      return { success: false, error: "Unerwarteter Fehler" };
    }
    
  }, [userId, userCredit, settings, updateStatus, status, onTradeExecuted, toast]);
  
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
