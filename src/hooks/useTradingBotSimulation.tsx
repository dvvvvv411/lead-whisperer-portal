
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
  // State für Dialoge
  const [simulationOpen, setSimulationOpen] = useState(false);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  
  // Trade-Ergebnis-State
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
  
  // Ref um Race-Conditions zu verhindern
  const dialogClosingRef = useRef(false);
  
  // Bot als aktiv setzen während der Simulation
  useEffect(() => {
    if (simulationOpen) {
      startBot();
    } else if (!simulationOpen && !simulationInProgressRef.current) {
      stopBot();
    }
  }, [simulationOpen, startBot, stopBot, simulationInProgressRef]);
  
  // Manuellen Trade-Button-Click behandeln
  const handleManualTrade = useCallback(async () => {
    console.log("Manual trade button clicked");
    
    // Wenn die Simulation bereits läuft, Dialog nur erneut öffnen
    if (simulationInProgressRef.current) {
      console.log("Simulation already in progress, reopening dialog");
      setSimulationOpen(true);
      return;
    }
    
    const canStart = await executeSingleTrade();
    
    if (canStart) {
      console.log("Starting simulation dialog");
      setSimulationOpen(true);
      // Zurücksetzen des Dialog-Schließ-Zustands
      dialogClosingRef.current = false;
    }
  }, [executeSingleTrade, simulationInProgressRef]);
  
  // Abschluss der Simulation behandeln
  const handleSimulationComplete = useCallback(async (success: boolean, selectedCrypto?: any) => {
    console.log("Simulation completed, success:", success, "selected crypto:", selectedCrypto);
    
    // Mehrfache Abschlüsse verhindern
    if (dialogClosingRef.current) {
      console.log("Dialog already closing, ignoring completion");
      return;
    }
    
    // Dialog als schließend markieren
    dialogClosingRef.current = true;
    
    if (success) {
      // Trade mit leichter Verzögerung abschließen, um sicherzustellen, dass die Dialog-Animation abgeschlossen ist
      setTimeout(async () => {
        // Zuerst den Simulations-Dialog schließen
        setSimulationOpen(false);
        
        try {
          // Trade ausführen und Ergebnisse erhalten
          console.log("Completing trade after simulation...");
          const tradeResult = await completeTradeAfterSimulation();
          console.log("Trade completed with result:", tradeResult);
          
          if (tradeResult && typeof tradeResult === 'object' && 'success' in tradeResult && tradeResult.success) {
            // Daten für den Ergebnisdialog mit neuen detaillierten Informationen vorbereiten
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
            
            // Sicherstellen, dass wir den Ergebnisdialog anzeigen
            console.log("Opening result dialog");
            setTimeout(() => {
              setResultDialogOpen(true);
              simulationInProgressRef.current = false; // Simulation als beendet markieren
            }, 300);
          } else {
            console.error("Trade completion failed or returned unexpected result:", tradeResult);
            simulationInProgressRef.current = false; // Simulation als beendet markieren bei Fehler
          }
        } catch (error) {
          console.error("Error completing trade:", error);
          simulationInProgressRef.current = false; // Simulation als beendet markieren bei Fehler
        } finally {
          // Simulating auf false setzen, unabhängig von Erfolg oder Misserfolg
          setIsSimulating(false);
        }
      }, 500);
    } else {
      setSimulationOpen(false);
      setIsSimulating(false);
      simulationInProgressRef.current = false; // Simulation als beendet markieren bei Abbruch
    }
  }, [completeTradeAfterSimulation, setIsSimulating, simulationInProgressRef]);
  
  // Änderungen des Dialog-Öffnungszustands behandeln
  const handleDialogOpenChange = useCallback((open: boolean) => {
    console.log("Dialog open state changed to:", open);
    
    if (!open && (isSimulating || simulationInProgressRef.current)) {
      // Dialog während der Simulation manuell geschlossen
      console.log("Dialog closed manually while simulating");
      dialogClosingRef.current = true;
      setIsSimulating(false);
      simulationInProgressRef.current = false; // Simulation als beendet markieren
    }
    
    setSimulationOpen(open);
  }, [isSimulating, setIsSimulating, simulationInProgressRef]);
  
  // Schließen des Ergebnisdialogs behandeln
  const handleResultDialogClose = useCallback(() => {
    console.log("Closing result dialog");
    setResultDialogOpen(false);
  }, []);
  
  // Aufräumen beim Unmount
  useEffect(() => {
    return () => {
      if (isSimulating || simulationInProgressRef.current) {
        console.log("Component unmounting, cleaning up simulation");
        setIsSimulating(false);
        simulationInProgressRef.current = false; // Simulation als beendet markieren
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
