
import { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { executeAITrade } from "./executeBotTrade";
import { BotSettings, BotStatus } from "./types";
import { checkCanExecuteTrade, getTotalTradesExecuted } from "./botTradeUtils";
import { useCryptos } from "@/hooks/useCryptos";

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
  const { cryptos, fetchCryptos } = useCryptos();
  
  // Execute a single trade
  const executeSingleTrade = useCallback(async () => {
    console.log("Checking if trade can be executed...");
    
    if (!userId || !settings || !status || !updateStatus) {
      console.log("Cannot execute trade: missing required data", { userId, settings: !!settings, status: !!status });
      toast({
        title: "Fehler",
        description: "Fehlende Daten für Handelsausführung",
        variant: "destructive"
      });
      return false;
    }
    
    if (!userCredit || userCredit <= 0) {
      console.log("Cannot execute trade: insufficient credit", { userCredit });
      toast({
        title: "Fehler",
        description: "Nicht genügend Guthaben für den Handel",
        variant: "destructive"
      });
      return false;
    }
    
    // Check only daily trade limit, removing the cooldown check
    // Use actual daily trades executed (which is already calculated as pairs)
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
    
    // Make sure we have fresh crypto data
    await fetchCryptos();
    
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
  }, [userId, userCredit, settings, status, updateStatus, toast, fetchCryptos]);
  
  // Complete trade after simulation is done
  const completeTradeAfterSimulation = useCallback(async () => {
    console.log("Completing trade after simulation...");
    
    if (!userId || !settings) {
      console.log("Cannot complete trade: missing required user data or settings", { userId: !!userId, settings: !!settings });
      simulationInProgressRef.current = false; // Reset simulation state
      setIsSimulating(false);
      toast({
        title: "Fehler",
        description: "Fehlende Benutzerdaten für die Handelsausführung",
        variant: "destructive"
      });
      return { success: false, error: "Missing required data" };
    }
    
    if (!userCredit || userCredit <= 0) {
      console.log("Cannot complete trade: insufficient credit", { userCredit });
      simulationInProgressRef.current = false; // Reset simulation state
      setIsSimulating(false);
      toast({
        title: "Fehler",
        description: "Nicht genügend Guthaben für den Handel",
        variant: "destructive"
      });
      return { success: false, error: "Insufficient credit" };
    }
    
    try {
      console.log("AITradingBot: Executing trade with:", { userId, userCredit, riskLevel: settings.riskLevel, maxTradeAmount: settings.maxTradeAmount });
      
      // Make sure we have fresh crypto data before executing the trade
      if (cryptos && cryptos.length > 0) {
        console.log(`Using ${cryptos.length} cryptos from cache for trade execution`);
      } else {
        await fetchCryptos();
        console.log("Fetched fresh crypto data for trade execution");
      }
      
      // Execute the actual trade with the bot's strategy
      const result = await executeAITrade({
        userId,
        userCredit,
        tradeAmount: settings.maxTradeAmount,
        riskLevel: settings.riskLevel,
        cryptos: cryptos || []
      });
      
      console.log("Trade execution result:", result);
      
      if (result.success) {
        // Get updated total trades count
        const totalTradesCount = await getTotalTradesExecuted(userId);
        console.log("Updated total trades count:", totalTradesCount);
        
        // Update status with trade info
        if (updateStatus && status) {
          updateStatus({
            statusMessage: "Letzter Trade erfolgreich",
            lastSuccessfulTrade: new Date(),
            totalProfitAmount: (status.totalProfitAmount || 0) + result.profit,
            tradesExecuted: totalTradesCount, // Use count from database
            lastTradeTime: new Date()
          });
        }
        
        // Note: We're not calling onTradeExecuted here anymore
        // This will be done after the user closes the result dialog
        console.log("Trade completed successfully:", result);
      } else {
        // Update status with failure
        if (updateStatus) {
          updateStatus({
            statusMessage: "Letzter Trade fehlgeschlagen: " + result.error,
          });
        }
        
        console.log("Trade failed:", result.error);
      }
      
      return result;
      
    } catch (error: any) {
      console.error("Error executing trade:", error);
      
      // Update status with error
      if (updateStatus) {
        updateStatus({
          statusMessage: "Fehler beim Ausführen des Trades",
        });
      }
      
      return { success: false, error: error.message || "Unerwarteter Fehler" };
    }
  }, [userId, userCredit, settings, updateStatus, status, cryptos, fetchCryptos, toast]);
  
  return {
    executeSingleTrade,
    completeTradeAfterSimulation,
    isSimulating,
    setIsSimulating,
    simulationInProgressRef
  };
};
