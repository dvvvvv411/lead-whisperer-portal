
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
      
      // Create a non-linear progress curve that starts slower and speeds up
      // This creates a more dramatic effect towards the end
      let progressCurve;
      const normalizedTime = elapsed / simulationDuration;
      
      if (normalizedTime < 0.2) {
        // Start slower (0-15%)
        progressCurve = normalizedTime * 0.75 * 100;
      } else if (normalizedTime < 0.7) {
        // Middle section (15-75%)
        progressCurve = (0.15 + (normalizedTime - 0.2) * 0.85) * 100;
      } else {
        // End section - accelerate to completion (75-100%)
        const remaining = 1 - normalizedTime;
        const accelerationFactor = 1 - Math.pow(remaining / 0.3, 2);
        progressCurve = Math.min(100, 75 + accelerationFactor * 25);
      }
      
      const newProgress = Math.min(100, Math.floor(progressCurve));
      
      progressRef.current = newProgress;
      setProgress(newProgress);
      
      // Update current step based on progress
      // We'll use a slightly different curve for the steps to create interesting visuals
      // Some steps will appear to take longer than others
      const stepsCurve = [0, 10, 25, 40, 60, 75, 85, 92, 97, 100];
      let newStep = 0;
      
      for (let i = 0; i < stepsCurve.length; i++) {
        if (newProgress >= stepsCurve[i]) {
          newStep = i;
        } else {
          break;
        }
      }
      
      setCurrentStep(Math.min(algorithmSteps.length - 1, newStep));
      
      // Generate crypto comparison more frequently with richer data
      if (elapsed % 800 < 100) {  // Generate roughly every 800ms
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
