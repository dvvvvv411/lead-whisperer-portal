
import React from 'react';
import { CryptoComparisonProps } from "./CryptoComparison";
import SimulationProgress from "./SimulationProgress";
import MarketAnalysis from "./MarketAnalysis";
import AlgorithmStepsList from "./AlgorithmStepsList";
import SimulationVisualizer from "./SimulationVisualizer";
import { Badge } from "@/components/ui/badge";
import { Clock, Cpu } from "lucide-react";

interface SimulationDialogContentProps {
  progress: number;
  comparisons: CryptoComparisonProps[];
  steps: string[];
  currentStep: number;
  simulationDuration?: number;
  elapsedTime?: number;
}

const SimulationDialogContent: React.FC<SimulationDialogContentProps> = ({
  progress,
  comparisons,
  steps,
  currentStep,
  simulationDuration = 60,
  elapsedTime = 0
}) => {
  // Calculate remaining time in seconds
  const remainingTime = Math.max(0, Math.round(simulationDuration - elapsedTime / 1000));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
      {/* Left side - Visual elements and animations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="bg-casino-darker/50 text-gold flex items-center gap-1.5 px-2.5 py-1">
            <Clock className="h-3.5 w-3.5 text-gold animate-pulse" />
            <span>{remainingTime}s</span>
          </Badge>
          
          <Badge variant="outline" className="bg-casino-darker/50 text-accent1 flex items-center gap-1.5 px-2.5 py-1">
            <Cpu className="h-3.5 w-3.5 text-accent1 animate-pulse" />
            <span>KI aktiv</span>
          </Badge>
        </div>
        
        {/* Primary visualization */}
        <SimulationVisualizer 
          progress={progress} 
          currentStep={currentStep}
          totalSteps={steps.length}
        />
        
        {/* Progress bar with enhanced styling */}
        <SimulationProgress progress={progress} />
      </div>
      
      {/* Right side - Data and algorithm */}
      <div className="space-y-4">
        {/* Crypto price comparisons with enhanced styling */}
        <MarketAnalysis comparisons={comparisons} />
        
        {/* Algorithm steps with enhanced styling */}
        <AlgorithmStepsList steps={steps} currentStep={currentStep} />
      </div>
    </div>
  );
};

export default SimulationDialogContent;
