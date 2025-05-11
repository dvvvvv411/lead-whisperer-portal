
import { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { executeAITrade } from "./executeBotTrade";
import { BotSettings, BotStatus } from "./types";
import { checkCanExecuteTrade } from "./botTradeUtils";

export const useBotTradeExecution = (
  userId?: string,
  userCredit?: number,
  settings?: BotSettings,
  status?: BotStatus,
  updateStatus?: (newStatus: Partial<BotStatus>) => void,
  onTradeExecuted?: () => void
) => {
  const { toast } = useToast();
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationInProgressRef = useRef(false);
  
  // Execute a single trade
  const executeSingleTrade = useCallback(async () => {
    console.log("Checking if trade can be executed...");
    
    if (!userId || !settings || !status || !updateStatus) {
      console.log("Cannot execute trade: missing required data");
      return false;
    }
    
    // Check only daily trade limit, removing the cooldown check
    const canExecute = checkCanExecuteTrade(
      status.dailyTradesExecuted,
      status.maxTradesPerDay,
      null // Pass null to ignore cooldown check
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
    
    // If a simulation is already in progress, just return true to continue it
    if (simulationInProgressRef.current) {
      console.log("Simulation already in progress, continuing with it");
      return true;
    }
    
    // Set simulation in progress
    simulationInProgressRef.current = true;
    setIsSimulating(true);
    
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
    executeSingleTrade,
    completeTradeAfterSimulation,
    isSimulating,
    setIsSimulating,
    simulationInProgressRef
  };
};
