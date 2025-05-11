
import React from 'react';
import AlgorithmStep from "./AlgorithmStep";
import { CircleCheck } from "lucide-react";

interface AlgorithmStepsListProps {
  steps: { title: string; description: string }[];
  currentStep: number;
}

const AlgorithmStepsList: React.FC<AlgorithmStepsListProps> = ({ steps, currentStep }) => {
  // Calculate overall algorithm progress
  const progressPercentage = Math.round((currentStep / steps.length) * 100);
  const isComplete = currentStep >= steps.length;
  
  return (
    <div className="bg-casino-darker/60 backdrop-blur-sm border border-gold/10 rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-casino-darker to-casino-dark px-3 py-2 border-b border-gold/10">
        <div className="flex justify-between items-center">
          <div className="text-xs font-semibold text-gold flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
            KI-Algorithmus
          </div>
          
          <div className="flex items-center gap-1.5">
            {isComplete ? (
              <CircleCheck className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <span className="text-xs text-gold/80">{progressPercentage}%</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-2.5 max-h-[180px] overflow-y-auto">
        <div className="space-y-0.5">
          {steps.map((step, idx) => (
            <AlgorithmStep 
              key={`step-${idx}`} 
              name={step.title} 
              isComplete={idx < currentStep} 
              current={idx === currentStep} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmStepsList;
