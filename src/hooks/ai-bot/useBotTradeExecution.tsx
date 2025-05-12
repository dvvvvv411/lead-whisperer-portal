import { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { executeAITrade } from "./executeBotTrade";
import { BotSettings, BotStatus } from "./types";
import { checkCanExecuteTrade } from "./botTradeUtils";
import { useCryptos } from "@/hooks/useCryptos";
import { generateTradeSimulationData } from "@/components/user/trading/bot-components/simulation/simulationUtils";

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
  
  // Store the simulated trade data for consistent display throughout the process
  const simulatedTradeDataRef = useRef<any>(null);
  
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
    
    // Pre-generate the trade simulation data to keep it consistent throughout the process
    if (cryptos && cryptos.length > 0 && settings.maxTradeAmount > 0) {
      simulatedTradeDataRef.current = generateTradeSimulationData(
        cryptos,
        settings.maxTradeAmount
      );
      console.log("Pre-generated simulated trade data:", simulatedTradeDataRef.current);
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
  }, [userId, userCredit, settings, status, updateStatus, toast, fetchCryptos, cryptos]);
  
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
      console.log("Executing AI trade with:", { userId, userCredit, riskLevel: settings.riskLevel, maxTradeAmount: settings.maxTradeAmount });
      
      // Use our pre-generated trade data if available
      if (simulatedTradeDataRef.current) {
        console.log("Using pre-generated trade data:", simulatedTradeDataRef.current);
        
        const tradeData = simulatedTradeDataRef.current;
        
        // Simulate a successful API response with our pregenerated data
        const result = {
          success: true,
          crypto: tradeData.crypto,
          strategy: tradeData.strategy,
          tradeAmount: tradeData.tradeDetails.tradeAmount,
          buyPrice: tradeData.tradeDetails.buyPrice,
          sellPrice: tradeData.tradeDetails.sellPrice,
          quantity: tradeData.tradeDetails.quantity,
          profit: tradeData.tradeDetails.profitAmount,
          profitPercentage: tradeData.tradeDetails.profitPercentage
        };
        
        // Log the result before returning
        console.log("Trade execution result (from simulated data):", result);
        
        // Update status with trade info
        if (updateStatus && status) {
          updateStatus({
            statusMessage: "Letzter Trade erfolgreich",
            lastSuccessfulTrade: new Date(),
            totalProfitAmount: (status.totalProfitAmount || 0) + result.profit,
            tradesExecuted: (status.tradesExecuted || 0) + 1
          });
        }
        
        // Note: Don't reset simulation state here - let the dialog handle that
        return result;
      }
      
      // Fallback to the real API call if no pre-generated data is available
      // Make sure we have fresh crypto data before executing the trade
      if (cryptos && cryptos.length === 0) {
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
        // Update status with trade info
        if (updateStatus && status) {
          updateStatus({
            statusMessage: "Letzter Trade erfolgreich",
            lastSuccessfulTrade: new Date(),
            totalProfitAmount: (status.totalProfitAmount || 0) + result.profit,
            tradesExecuted: (status.tradesExecuted || 0) + 1
          });
        }
        
        // Call the onTradeExecuted callback when the result dialog is closed
        // (this is handled in the result dialog close handler)
      } else {
        // Update status with failure
        if (updateStatus) {
          updateStatus({
            statusMessage: "Letzter Trade fehlgeschlagen: " + result.error,
          });
        }
        
        console.log("Trade failed:", result.error);
        
        // Reset simulation state
        simulationInProgressRef.current = false;
        setIsSimulating(false);
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
      
      // Reset simulation state
      simulationInProgressRef.current = false;
      setIsSimulating(false);
      
      return { success: false, error: error.message || "Unerwarteter Fehler" };
    }
  }, [userId, userCredit, settings, updateStatus, status, onTradeExecuted, cryptos, fetchCryptos]);
  
  return {
    executeSingleTrade,
    completeTradeAfterSimulation,
    isSimulating,
    setIsSimulating,
    simulationInProgressRef
  };
};
