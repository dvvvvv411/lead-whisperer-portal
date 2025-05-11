import { useState, useRef, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useTradingBotSimulation = (
  startBot: () => void,
  stopBot: () => void,
  executeSingleTrade: () => Promise<boolean>,
  completeTradeAfterSimulation: () => Promise<any>,
  isSimulating: boolean,
  setIsSimulating: (simulating: boolean) => void,
  simulationInProgressRef: React.MutableRefObject<boolean>
) => {
  const { toast } = useToast();

  // State for dialogs
  const [simulationOpen, setSimulationOpen] = useState(false);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  
  // Trade result state
  const [tradeResult, setTradeResult] = useState({
    cryptoSymbol: "",
    cryptoName: "",
    profitAmount: 0,
    profitPercentage: 0,
    tradeAmount: 0,
    buyPrice: 0,
    sellPrice: 0,
    quantity: 0,
    tradeDate: new Date()
  });
  
  // Ref to prevent race conditions
  const dialogClosingRef = useRef(false);
  
  // Set bot as active during simulation
  useEffect(() => {
    if (simulationOpen) {
      startBot();
    } else if (!simulationOpen && !simulationInProgressRef.current) {
      stopBot();
    }
  }, [simulationOpen, startBot, stopBot, simulationInProgressRef]);
  
  // Handle manual trade button click
  const handleManualTrade = useCallback(async () => {
    console.log("Manual trade button clicked");
    
    // If simulation is already in progress, just reopen dialog
    if (simulationInProgressRef.current) {
      console.log("Simulation already in progress, reopening dialog");
      setSimulationOpen(true);
      return;
    }
    
    const canStart = await executeSingleTrade();
    
    if (canStart) {
      console.log("Starting simulation dialog");
      setSimulationOpen(true);
      // Reset dialog closing state
      dialogClosingRef.current = false;
    }
  }, [executeSingleTrade, simulationInProgressRef]);
  
  // Handle simulation completion
  const handleSimulationComplete = useCallback(async (success: boolean, selectedCrypto?: any) => {
    console.log("Simulation completed, success:", success, "selected crypto:", selectedCrypto);
    
    // Prevent multiple completions
    if (dialogClosingRef.current) {
      console.log("Dialog already closing, ignoring completion");
      return;
    }
    
    // Mark dialog as closing
    dialogClosingRef.current = true;
    
    if (success) {
      // Complete trade with slight delay to ensure dialog animation is complete
      setTimeout(async () => {
        // First close simulation dialog
        setSimulationOpen(false);
        
        try {
          // Execute trade and get results
          console.log("Completing trade after simulation...");
          const tradeResult = await completeTradeAfterSimulation();
          console.log("Trade completed with result:", tradeResult);
          
          if (tradeResult && typeof tradeResult === 'object' && 'success' in tradeResult && tradeResult.success) {
            // Prepare data for result dialog with detailed information
            setTradeResult({
              cryptoSymbol: tradeResult.crypto?.symbol || selectedCrypto?.symbol || "BTC",
              cryptoName: tradeResult.crypto?.name || selectedCrypto?.name || "Bitcoin",
              profitAmount: tradeResult.profit || 0,
              profitPercentage: tradeResult.profitPercentage || 0,
              tradeAmount: tradeResult.tradeAmount || 0,
              buyPrice: tradeResult.buyPrice || 0,
              sellPrice: tradeResult.sellPrice || 0,
              quantity: tradeResult.quantity || 0,
              tradeDate: new Date()
            });
            
            // Ensure we show the result dialog
            console.log("Opening result dialog with data:", {
              cryptoSymbol: tradeResult.crypto?.symbol || selectedCrypto?.symbol || "BTC",
              profitAmount: tradeResult.profit || 0,
              profitPercentage: tradeResult.profitPercentage || 0
            });
            
            setTimeout(() => {
              setResultDialogOpen(true);
              simulationInProgressRef.current = false; // Mark simulation as complete
              console.log("Result dialog should now be open, dialogOpen state:", resultDialogOpen);
            }, 300);
          } else {
            console.error("Trade completion failed or returned unexpected result:", tradeResult);
            simulationInProgressRef.current = false; // Mark simulation as complete on error
            toast({
              title: "Trade fehlgeschlagen",
              description: "Der Trade konnte nicht abgeschlossen werden.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error("Error completing trade:", error);
          simulationInProgressRef.current = false; // Mark simulation as complete on error
          toast({
            title: "Fehler",
            description: "Es ist ein Fehler beim Ausführen des Trades aufgetreten.",
            variant: "destructive"
          });
        } finally {
          // Set simulating to false regardless of success or failure
          setIsSimulating(false);
        }
      }, 500);
    } else {
      setSimulationOpen(false);
      setIsSimulating(false);
      simulationInProgressRef.current = false; // Mark simulation as complete on cancel
    }
  }, [completeTradeAfterSimulation, setIsSimulating, simulationInProgressRef, resultDialogOpen, toast]);
  
  // Handle dialog open state changes
  const handleDialogOpenChange = useCallback((open: boolean) => {
    console.log("Dialog open state changed to:", open);
    
    if (!open && (isSimulating || simulationInProgressRef.current)) {
      // Dialog manually closed while simulating
      console.log("Dialog closed manually while simulating");
      dialogClosingRef.current = true;
      setIsSimulating(false);
      simulationInProgressRef.current = false; // Mark simulation as complete
    }
    
    setSimulationOpen(open);
  }, [isSimulating, setIsSimulating, simulationInProgressRef]);
  
  // Handle result dialog close
  const handleResultDialogClose = useCallback(() => {
    console.log("Closing result dialog");
    setResultDialogOpen(false);
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSimulating || simulationInProgressRef.current) {
        console.log("Component unmounting, cleaning up simulation");
        setIsSimulating(false);
        simulationInProgressRef.current = false; // Mark simulation as complete
      }
    };
  }, [isSimulating, setIsSimulating, simulationInProgressRef]);
  
  // Debug logs to track dialog states
  useEffect(() => {
    console.log("Current dialog states - simulation:", simulationOpen, "result:", resultDialogOpen);
  }, [simulationOpen, resultDialogOpen]);
  
  return {
    simulationOpen,
    resultDialogOpen,
    tradeResult,
    handleManualTrade,
    handleSimulationComplete,
    handleDialogOpenChange,
    handleResultDialogClose
  };
};
