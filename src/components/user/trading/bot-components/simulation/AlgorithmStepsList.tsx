
import React from 'react';
import AlgorithmStep from "./AlgorithmStep";

interface AlgorithmStepsListProps {
  steps: string[];
  currentStep: number;
}

const AlgorithmStepsList: React.FC<AlgorithmStepsListProps> = ({ steps, currentStep }) => {
  return (
    <div className="bg-slate-50 p-3 rounded-md">
      <div className="text-xs font-medium mb-1">KI-Algorithmus</div>
      <div className="space-y-0.5">
        {steps.map((step, idx) => (
          <AlgorithmStep 
            key={`step-${idx}`} 
            name={step} 
            isComplete={idx < currentStep} 
            current={idx === currentStep} 
          />
        ))}
      </div>
    </div>
  );
};

export default AlgorithmStepsList;
