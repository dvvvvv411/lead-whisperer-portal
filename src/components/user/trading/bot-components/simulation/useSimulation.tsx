
import { useState, useEffect, useRef } from 'react';
import { CryptoComparisonProps } from "./CryptoComparison";
import { algorithmSteps, generateCryptoComparison, selectRandomCrypto } from "./simulationUtils";

interface SimulationHookProps {
  onComplete: (success: boolean, selectedCrypto?: any) => void;
  cryptoData: any[];
  simulationActive: boolean;
  simulationDuration: number;
}

export const useSimulation = ({
  onComplete,
  cryptoData,
  simulationActive,
  simulationDuration
}: SimulationHookProps) => {
  // Use refs for simulation state to prevent reset on rerenders
  const progressRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const completedRef = useRef(false);
  const selectedCryptoRef = useRef<any>(null);
  
  // Visual state for rendering
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [comparisons, setComparisons] = useState<CryptoComparisonProps[]>([]);

  // Setup and manage the simulation interval
  useEffect(() => {
    // Select a crypto to trade at the start of simulation
    if (simulationActive && cryptoData && cryptoData.length > 0 && !selectedCryptoRef.current) {
      selectedCryptoRef.current = selectRandomCrypto(cryptoData);
      console.log("Selected crypto for trade at start of simulation:", selectedCryptoRef.current);
    }
    
    // Cleanup function to cancel interval
    const cleanup = () => {
      if (intervalIdRef.current) {
        console.log("Cleaning up interval");
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };

    if (!simulationActive) {
      cleanup();
      return;
    }
    
    // Mark simulation as active and record start time
    startTimeRef.current = Date.now();
    
    // Use setInterval for more consistent updates
    intervalIdRef.current = setInterval(() => {
      if (!simulationActive || startTimeRef.current === null) {
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
        const newComparison = generateCryptoComparison(cryptoData);
        setComparisons(prev => [newComparison, ...prev].slice(0, 5));
      }
      
      // Complete simulation when progress reaches 100%
      if (newProgress >= 100 && !completedRef.current) {
        console.log("Simulation completed!");
        completedRef.current = true;
        
        // When complete, wait a second then call onComplete with selected crypto
        setTimeout(() => {
          if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
          }
          onComplete(true, selectedCryptoRef.current);
        }, 1000);
      }
    }, 250); // Update 4 times per second for smoother animation
    
    return cleanup;
  }, [simulationActive, simulationDuration, onComplete, cryptoData]);

  return {
    progress,
    currentStep,
    comparisons,
    selectedCrypto: selectedCryptoRef.current
  };
};
