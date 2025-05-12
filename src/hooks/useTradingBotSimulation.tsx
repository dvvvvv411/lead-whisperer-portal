
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
  
  // Refs to prevent race conditions and track operation state
  const dialogClosingRef = useRef(false);
  const completionAttemptedRef = useRef(false);
  
  useEffect(() => {
    // Debug log for dialog states
    console.log("Dialog states updated - simulation:", simulationOpen, "result:", resultDialogOpen);
  }, [simulationOpen, resultDialogOpen]);
  
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
    
    // Reset completion flags
    dialogClosingRef.current = false;
    completionAttemptedRef.current = false;
    
    // If simulation is already in progress, just reopen dialog
    if (simulationInProgressRef.current) {
      console.log("Simulation already in progress, reopening dialog");
      setSimulationOpen(true);
      return;
    }
    
    try {
      const canStart = await executeSingleTrade();
      
      if (canStart) {
        console.log("Starting simulation dialog");
        setSimulationOpen(true);
      }
    } catch (error) {
      console.error("Error starting trade:", error);
      toast({
        title: "Fehler",
        description: "Der Trade konnte nicht gestartet werden",
        variant: "destructive"
      });
      simulationInProgressRef.current = false;
    }
  }, [executeSingleTrade, simulationInProgressRef, toast]);
  
  // Handle simulation completion
  const handleSimulationComplete = useCallback(async (success: boolean, selectedCrypto?: any) => {
    console.log("Simulation completed, success:", success, "selected crypto:", selectedCrypto);
    
    // Prevent multiple completions
    if (dialogClosingRef.current || completionAttemptedRef.current) {
      console.log("Dialog already closing or completion attempted, ignoring");
      return;
    }
    
    // Mark as completion attempted
    completionAttemptedRef.current = true;
    dialogClosingRef.current = true;
    
    if (success) {
      // First close simulation dialog
      setSimulationOpen(false);
      
      // Short delay to allow simulation dialog to close properly
      setTimeout(async () => {
        try {
          // Execute trade and get results
          console.log("Completing trade after simulation with selected crypto:", selectedCrypto?.symbol);
          const tradeResult = await completeTradeAfterSimulation();
          console.log("Trade completed with result:", tradeResult);
          
          if (tradeResult && tradeResult.success) {
            // Prepare data for result dialog with detailed information
            const resultData = {
              cryptoSymbol: tradeResult.crypto?.symbol || selectedCrypto?.symbol || "BTC",
              cryptoName: tradeResult.crypto?.name || selectedCrypto?.name || "Bitcoin",
              profitAmount: tradeResult.profit || 0,
              profitPercentage: tradeResult.profitPercentage || 0,
              tradeAmount: tradeResult.tradeAmount || 0,
              buyPrice: tradeResult.buyPrice || 0,
              sellPrice: tradeResult.sellPrice || 0,
              quantity: tradeResult.quantity || 0,
              tradeDate: new Date()
            };
            
            console.log("Setting trade result data:", resultData);
            setTradeResult(resultData);
            
            // Use timeout to ensure state update completes before showing dialog
            setTimeout(() => {
              console.log("Opening result dialog");
              setResultDialogOpen(true);
              simulationInProgressRef.current = false;
              
              // Still show a small toast notification but make it non-intrusive
              toast({
                title: "Trade erfolgreich",
                description: `Gewinn: ${resultData.profitAmount.toFixed(2)}€ (${resultData.profitPercentage.toFixed(2)}%)`,
                variant: "default" // Changed from "success" to "default"
              });
            }, 300);
          } else {
            console.error("Trade completion failed:", tradeResult?.error || "Unknown error");
            simulationInProgressRef.current = false;
            
            // Show more descriptive error message
            let errorMessage = tradeResult?.error || "Der Trade konnte nicht abgeschlossen werden";
            
            if (errorMessage === "Keine geeignete Kryptowährung gefunden") {
              errorMessage = "Keine geeignete Kryptowährung gefunden. Bitte versuchen Sie es später erneut.";
            }
            
            toast({
              title: "Trade fehlgeschlagen",
              description: errorMessage,
              variant: "destructive"
            });
          }
        } catch (error: any) {
          console.error("Error completing trade after simulation:", error);
          simulationInProgressRef.current = false;
          toast({
            title: "Fehler",
            description: error.message || "Es ist ein Fehler beim Abschließen des Trades aufgetreten",
            variant: "destructive"
          });
        } finally {
          setIsSimulating(false);
          completionAttemptedRef.current = false;
        }
      }, 500);
    } else {
      console.log("Simulation cancelled or failed");
      setSimulationOpen(false);
      setIsSimulating(false);
      simulationInProgressRef.current = false;
      completionAttemptedRef.current = false;
    }
  }, [completeTradeAfterSimulation, setIsSimulating, simulationInProgressRef, toast]);
  
  // Handle dialog open state changes
  const handleDialogOpenChange = useCallback((open: boolean) => {
    console.log("Dialog open state changed to:", open);
    
    if (!open && (isSimulating || simulationInProgressRef.current)) {
      // Dialog manually closed while simulating
      console.log("Dialog closed manually while simulating");
      dialogClosingRef.current = true;
      setIsSimulating(false);
      simulationInProgressRef.current = false;
      completionAttemptedRef.current = false;
      
      toast({
        title: "Simulation abgebrochen",
        description: "Die Trading-Simulation wurde abgebrochen",
      });
    }
    
    setSimulationOpen(open);
  }, [isSimulating, setIsSimulating, simulationInProgressRef, toast]);
  
  // Handle result dialog close
  const handleResultDialogClose = useCallback(() => {
    console.log("Closing result dialog");
    setResultDialogOpen(false);
  }, []);
  
  // Debug logs to track dialog states
  useEffect(() => {
    console.log("Current dialog states - simulation:", simulationOpen, "result:", resultDialogOpen, 
                "simulation in progress:", simulationInProgressRef.current, 
                "is simulating:", isSimulating);
  }, [simulationOpen, resultDialogOpen, simulationInProgressRef, isSimulating]);
  
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
