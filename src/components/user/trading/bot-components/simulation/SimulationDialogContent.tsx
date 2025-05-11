
import React from 'react';
import SimulationVisualizer from './SimulationVisualizer';
import SimulationProgress from './SimulationProgress';
import AlgorithmStepsList from './AlgorithmStepsList';
import { CryptoComparisonProps } from './CryptoComparison';
import MarketAnalysis from './MarketAnalysis';

interface SimulationDialogContentProps {
  progress: number;
  steps: { title: string; description: string }[];
  currentStep: number;
  comparisons: CryptoComparisonProps[];
  simulationDuration: number;
  elapsedTime: number;
}

const SimulationDialogContent: React.FC<SimulationDialogContentProps> = ({
  progress,
  steps,
  currentStep,
  comparisons,
  simulationDuration,
  elapsedTime
}) => {
  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Progress bar */}
      <SimulationProgress 
        percent={progress} 
        duration={simulationDuration} 
        elapsed={elapsedTime / 1000} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chart visualization - takes full width on mobile, 1/3 on desktop */}
        <div className="md:col-span-1 h-[200px] md:h-auto">
          <SimulationVisualizer 
            progress={progress} 
            currentStep={currentStep} 
            totalSteps={steps.length} 
          />
        </div>
        
        {/* Algorithm steps - takes full width on mobile, 2/3 on desktop */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <AlgorithmStepsList 
            steps={steps} 
            currentStep={currentStep} 
          />
          
          {/* Market analysis section */}
          <MarketAnalysis comparisons={comparisons} />
        </div>
      </div>
    </div>
  );
};

export default SimulationDialogContent;
