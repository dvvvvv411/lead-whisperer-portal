
import React, { useState, useEffect, useRef } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ActivityIcon } from "lucide-react";
import CryptoComparison, { CryptoComparisonProps } from "./simulation/CryptoComparison";
import AlgorithmStep from "./simulation/AlgorithmStep";
import { algorithmSteps, generateCryptoComparison } from "./simulation/simulationUtils";

interface TradeSimulationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (success: boolean) => void;
  cryptoData: any[];
}

const TradeSimulationDialog = React.memo(({ 
  open, 
  onOpenChange, 
  onComplete,
  cryptoData
}: TradeSimulationDialogProps) => {
  // Use refs to track simulation state across re-renders
  const progressRef = useRef(0);
  const simulationActive = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const completedRef = useRef(false);
  
  // Visual state for rendering
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [comparisons, setComparisons] = useState<CryptoComparisonProps[]>([]);
  
  // Fixed simulation duration of exactly 60 seconds
  const simulationDuration = 60000; // 60 seconds

  console.log("Dialog rendering, open:", open, "progress:", progress, "active:", simulationActive.current);

  // Initialize or reset the simulation when dialog opens
  useEffect(() => {
    // Cleanup function to cancel interval when component unmounts or dialog closes
    const cleanup = () => {
      if (intervalIdRef.current) {
        console.log("Cleaning up interval");
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      simulationActive.current = false;
    };

    if (!open) {
      cleanup();
      return;
    }
    
    // Reset states when dialog opens
    console.log("Dialog opened, initializing simulation");
    progressRef.current = 0;
    setProgress(0);
    setCurrentStep(0);
    setComparisons([]);
    completedRef.current = false;
    
    // Mark simulation as active and record start time
    simulationActive.current = true;
    startTimeRef.current = Date.now();
    
    // Use setInterval for more consistent updates
    intervalIdRef.current = setInterval(() => {
      if (!simulationActive.current || startTimeRef.current === null) {
        console.log("Simulation no longer active in interval");
        return;
      }
      
      const currentTime = Date.now();
      const elapsed = currentTime - startTimeRef.current;
      const newProgress = Math.min(100, Math.floor((elapsed / simulationDuration) * 100));
      
      progressRef.current = newProgress;
      setProgress(newProgress);
      
      // Update current step based on progress
      const newStep = Math.min(algorithmSteps.length - 1, Math.floor((newProgress / 100) * algorithmSteps.length));
      setCurrentStep(newStep);
      
      // Generate crypto comparison roughly every second
      if (elapsed % 1000 < 100) {
        const newComparison = generateCryptoComparison();
        setComparisons(prev => [newComparison, ...prev].slice(0, 5));
      }
      
      // Complete simulation when progress reaches 100%
      if (newProgress >= 100 && !completedRef.current) {
        console.log("Simulation completed!");
        simulationActive.current = false;
        completedRef.current = true;
        
        // When complete, wait a second then call onComplete
        setTimeout(() => {
          if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
          }
          onComplete(true);
        }, 1000);
      }
    }, 250); // Update 4 times per second for smoother animation
    
    return cleanup;
  }, [open, simulationDuration, onComplete]);
  
  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpenState) => {
        // If dialog is being closed manually and simulation is still running
        if (!newOpenState && simulationActive.current) {
          console.log("Dialog manually closed, cancelling simulation");
          // Cancel simulation
          simulationActive.current = false;
          if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
          }
        }
        onOpenChange(newOpenState);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ActivityIcon className="h-4 w-4 mr-2 text-blue-600" />
            KI-Trading im Prozess
          </DialogTitle>
          <DialogDescription>
            Der KI-Algorithmus analysiert aktuell die besten Handelsmöglichkeiten.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex justify-between">
              <span>Fortschritt</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Crypto price comparisons */}
          <div className="bg-slate-50 p-3 rounded-md">
            <div className="text-xs font-medium mb-2">Markt-Analyse</div>
            {comparisons.length > 0 ? (
              comparisons.map((comp, idx) => (
                <CryptoComparison key={`comp-${idx}`} {...comp} />
              ))
            ) : (
              <div className="text-xs text-muted-foreground py-2">Warte auf Daten...</div>
            )}
          </div>
          
          {/* Algorithm steps */}
          <div className="bg-slate-50 p-3 rounded-md">
            <div className="text-xs font-medium mb-1">KI-Algorithmus</div>
            <div className="space-y-0.5">
              {algorithmSteps.map((step, idx) => (
                <AlgorithmStep 
                  key={`step-${idx}`} 
                  name={step} 
                  isComplete={idx < currentStep} 
                  current={idx === currentStep} 
                />
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="text-xs text-muted-foreground">
          Trade wird automatisch ausgeführt, sobald die optimale Gelegenheit identifiziert wurde.
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

TradeSimulationDialog.displayName = 'TradeSimulationDialog';
export default TradeSimulationDialog;
