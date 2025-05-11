
import React, { useState, useEffect } from 'react';
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

const TradeSimulationDialog = ({ 
  open, 
  onOpenChange, 
  onComplete,
  cryptoData
}: TradeSimulationDialogProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [comparisons, setComparisons] = useState<CryptoComparisonProps[]>([]);
  
  // Fixed simulation duration of exactly 60 seconds
  const simulationDuration = 60000; // 60 seconds

  useEffect(() => {
    if (!open) return;
    
    // Reset states when dialog opens
    setProgress(0);
    setCurrentStep(0);
    setComparisons([]);
    
    const startTime = Date.now();
    let animationFrameId: number | null = null;
    
    const updateProgress = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const newProgress = Math.min(100, Math.floor((elapsed / simulationDuration) * 100));
      
      setProgress(newProgress);
      
      // Update current step based on progress
      const newStep = Math.min(algorithmSteps.length - 1, Math.floor((newProgress / 100) * algorithmSteps.length));
      setCurrentStep(newStep);
      
      // Generate crypto comparison roughly every second
      if (elapsed % 1000 < 50) {
        const newComparison = generateCryptoComparison();
        setComparisons(prev => [newComparison, ...prev].slice(0, 5));
      }
      
      // Continue animation or complete
      if (newProgress < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        // When complete, wait a second then call onComplete
        setTimeout(() => {
          onComplete(true);
        }, 1000);
      }
    };
    
    // Start the animation immediately
    animationFrameId = requestAnimationFrame(updateProgress);
    
    // Cleanup function to cancel animation when component unmounts or dialog closes
    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [open, simulationDuration, onComplete]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                <CryptoComparison key={idx} {...comp} />
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
                  key={idx} 
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
};

export default TradeSimulationDialog;
