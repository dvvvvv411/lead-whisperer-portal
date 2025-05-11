
import { useState, useRef, useCallback, useEffect } from "react";

export const useTradingBotSimulation = (
  startBot: () => void,
  stopBot: () => void,
  executeSingleTrade: () => Promise<boolean>,
  completeTradeAfterSimulation: () => Promise<any>,
  isSimulating: boolean,
  setIsSimulating: (simulating: boolean) => void,
  simulationInProgressRef: React.MutableRefObject<boolean>
) => {
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
    const canStart = await executeSingleTrade();
    
    if (canStart) {
      console.log("Starting simulation dialog");
      setSimulationOpen(true);
      // Reset the dialog closing state
      dialogClosingRef.current = false;
    }
  }, [executeSingleTrade]);
  
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
      // Complete the trade with a slight delay to ensure dialog animation completes
      setTimeout(async () => {
        // Close simulation dialog first
        setSimulationOpen(false);
        
        try {
          // Execute the trade and get results
          console.log("Completing trade after simulation...");
          const tradeResult = await completeTradeAfterSimulation();
          console.log("Trade completed with result:", tradeResult);
          
          if (tradeResult && typeof tradeResult === 'object' && 'success' in tradeResult && tradeResult.success) {
            // Prepare data for result dialog with new detailed information
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
            console.log("Opening result dialog");
            setTimeout(() => {
              setResultDialogOpen(true);
            }, 300);
          } else {
            console.error("Trade completion failed or returned unexpected result:", tradeResult);
          }
        } catch (error) {
          console.error("Error completing trade:", error);
        } finally {
          // Set simulating to false regardless of success or failure
          setIsSimulating(false);
        }
      }, 500);
    } else {
      setSimulationOpen(false);
      setIsSimulating(false);
    }
  }, [completeTradeAfterSimulation, setIsSimulating]);
  
  // Handle dialog open state changes
  const handleDialogOpenChange = useCallback((open: boolean) => {
    console.log("Dialog open state changed to:", open);
    
    if (!open && (isSimulating || simulationInProgressRef.current)) {
      // Dialog closed manually during simulation
      console.log("Dialog closed manually while simulating");
      dialogClosingRef.current = true;
      setIsSimulating(false);
    }
    
    setSimulationOpen(open);
  }, [isSimulating, setIsSimulating, simulationInProgressRef]);
  
  // Handle closing the result dialog
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
      }
    };
  }, [isSimulating, setIsSimulating, simulationInProgressRef]);
  
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
