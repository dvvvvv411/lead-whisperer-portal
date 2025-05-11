
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
import { TrendingUpIcon, TrendingDownIcon, ActivityIcon } from "lucide-react";

interface CryptoComparisonProps {
  symbol: string;
  price: number;
  change: number;
}

const CryptoComparison = ({ symbol, price, change }: CryptoComparisonProps) => {
  return (
    <div className="flex items-center justify-between py-2 border-b border-dashed border-slate-200 animate-fade-in">
      <div className="flex items-center gap-2">
        <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs">{symbol}</span>
        <span className="text-sm font-medium">{price.toFixed(2)} €</span>
      </div>
      <div className="flex items-center">
        {change > 0 ? (
          <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <TrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span className={`text-xs ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change.toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

interface AlgorithmStepProps {
  name: string;
  isComplete: boolean;
  current?: boolean;
}

const AlgorithmStep = ({ name, isComplete, current = false }: AlgorithmStepProps) => {
  return (
    <div className={`flex items-center gap-2 py-1.5 ${current ? 'text-blue-600 font-medium' : ''}`}>
      <div className={`h-2 w-2 rounded-full ${isComplete ? 'bg-green-500' : current ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
      <span className="text-xs">{name}</span>
      {current && (
        <div className="ml-auto flex items-center">
          <ActivityIcon className="h-3 w-3 text-blue-500 animate-pulse" />
        </div>
      )}
    </div>
  );
};

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
  
  // Random simulation duration between 30-90 seconds (30000-90000ms)
  // For development speed, we're making it much shorter (5-15 seconds)
  const simulationDuration = Math.floor(Math.random() * 10000) + 5000;
  
  // Algorithm steps
  const steps = [
    "Initialisiere KI-Algorithmus",
    "Analyse historischer Kursdaten",
    "Berechnung optimaler Einstiegspunkte",
    "Sentiment-Analyse der Markttrends",
    "Volumen-Korrelationsanalyse",
    "Prüfung technischer Indikatoren",
    "Bewertung der Handelsvolumina",
    "Erkennung von Marktmustern",
    "Berechnung der Gewinnwahrscheinlichkeit",
    "Finale Handelsempfehlung"
  ];

  useEffect(() => {
    if (!open) return;
    
    // Reset states
    setProgress(0);
    setCurrentStep(0);
    setComparisons([]);
    
    // Start progress animation
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(100, Math.floor((elapsed / simulationDuration) * 100));
      setProgress(newProgress);
      
      // Update current step based on progress
      const newStep = Math.min(steps.length - 1, Math.floor((newProgress / 100) * steps.length));
      setCurrentStep(newStep);
      
      // Add crypto comparisons periodically
      if (elapsed % 1500 < 100 && cryptoData.length > 0) {
        // Take a random crypto from the data
        const randomCrypto = cryptoData[Math.floor(Math.random() * cryptoData.length)];
        if (randomCrypto) {
          const newComparison = {
            symbol: randomCrypto.symbol,
            price: randomCrypto.current_price || Math.random() * 1000,
            change: (Math.random() * 10) - 5 // Random change between -5% and +5%
          };
          setComparisons(prev => [newComparison, ...prev].slice(0, 5));
        }
      }
      
      // End simulation
      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete(true);
        }, 1000);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [open, cryptoData, simulationDuration, steps.length, onComplete]);
  
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
              {steps.map((step, idx) => (
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
