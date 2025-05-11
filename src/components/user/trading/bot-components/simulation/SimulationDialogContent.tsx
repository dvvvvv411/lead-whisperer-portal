
import React from 'react';
import { CryptoComparisonProps } from "./CryptoComparison";
import SimulationProgress from "./SimulationProgress";
import MarketAnalysis from "./MarketAnalysis";
import AlgorithmStepsList from "./AlgorithmStepsList";

interface SimulationDialogContentProps {
  progress: number;
  comparisons: CryptoComparisonProps[];
  steps: string[];
  currentStep: number;
}

const SimulationDialogContent: React.FC<SimulationDialogContentProps> = ({
  progress,
  comparisons,
  steps,
  currentStep
}) => {
  return (
    <div className="space-y-4 py-2">
      {/* Progress bar */}
      <SimulationProgress progress={progress} />
      
      {/* Crypto price comparisons */}
      <MarketAnalysis comparisons={comparisons} />
      
      {/* Algorithm steps */}
      <AlgorithmStepsList steps={steps} currentStep={currentStep} />
    </div>
  );
};

export default SimulationDialogContent;
