
import React, { useRef, useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { ActivityIcon } from "lucide-react";
import { algorithmSteps } from "./simulation/simulationUtils";
import SimulationDialogContent from "./simulation/SimulationDialogContent";
import { useSimulation } from "./simulation/useSimulation";
import { cn } from "@/lib/utils";

interface TradeSimulationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (success: boolean, selectedCrypto?: any) => void;
  cryptoData: any[];
}

const TradeSimulationDialog = React.memo(({ 
  open, 
  onOpenChange, 
  onComplete,
  cryptoData
}: TradeSimulationDialogProps) => {
  // Use refs for simulation state tracking
  const simulationActive = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  
  // Track elapsed time for countdown display
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Fixed simulation duration of exactly 60 seconds
  const simulationDuration = 60000; // 60 seconds

  // Use our custom hook for simulation logic
  const { progress, currentStep, comparisons } = useSimulation({
    onComplete,
    cryptoData,
    simulationActive: simulationActive.current,
    simulationDuration
  });

  // Update elapsed time
  useEffect(() => {
    if (!open || !simulationActive.current) return;
    
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }
    
    const timer = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        setElapsedTime(elapsed);
        
        // Stop the timer when we reach the end
        if (elapsed >= simulationDuration) {
          clearInterval(timer);
        }
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, [open, simulationDuration]);

  // Initialize or reset the simulation when dialog opens
  useEffect(() => {
    if (open) {
      console.log("Dialog opened, initializing simulation");
      simulationActive.current = true;
      startTimeRef.current = Date.now();
      setElapsedTime(0);
    } else {
      simulationActive.current = false;
      startTimeRef.current = null;
    }
  }, [open]);
  
  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpenState) => {
        // If dialog is being closed manually and simulation is still running
        if (!newOpenState && simulationActive.current) {
          console.log("Dialog manually closed, cancelling simulation");
          simulationActive.current = false;
        }
        onOpenChange(newOpenState);
      }}
    >
      <DialogContent className={cn(
        "sm:max-w-3xl bg-gradient-to-br from-casino-dark/95 to-casino-darker border border-gold/10",
        "backdrop-blur-xl shadow-xl overflow-hidden"
      )}>
        <DialogHeader className="border-b border-gold/10 pb-3">
          <div className="flex items-center">
            <div className="h-7 w-7 rounded-full bg-accent1/10 flex items-center justify-center mr-2.5">
              <ActivityIcon className="h-4 w-4 text-accent1" />
            </div>
            <div>
              <DialogTitle className="text-white">
                KI-Trading Analyse
              </DialogTitle>
              <DialogDescription>
                Der Algorithmus findet die optimale Handelsstrategie für maximalen Profit
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <SimulationDialogContent 
          progress={progress}
          comparisons={comparisons}
          steps={algorithmSteps}
          currentStep={currentStep}
          simulationDuration={simulationDuration / 1000} // Convert to seconds
          elapsedTime={elapsedTime}
        />
        
        <DialogFooter className="text-xs text-muted-foreground border-t border-gold/10 pt-3">
          <div className="w-full flex justify-between items-center">
            <span className="text-gold/70">
              {progress < 100 ? "Trading wird analysiert..." : "Analyse abgeschlossen!"}
            </span>
            <span>
              {progress < 100 ? "Bitte warten..." : "Trade wird ausgeführt..."}
            </span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

TradeSimulationDialog.displayName = 'TradeSimulationDialog';
export default TradeSimulationDialog;
