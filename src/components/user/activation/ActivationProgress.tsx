
import React from 'react';
import { motion } from "framer-motion";
import { CheckCircle, CircleDot, Circle } from "lucide-react";

interface ActivationStep {
  title: string;
  completed: boolean;
  active: boolean;
}

const ActivationProgress = ({ currentStep }: { currentStep: number }) => {
  const steps: ActivationStep[] = [
    {
      title: "Wallet auswählen",
      completed: currentStep > 0,
      active: currentStep === 0,
    },
    {
      title: "Zahlung bestätigen",
      completed: currentStep > 1,
      active: currentStep === 1,
    },
    {
      title: "Aktivierung",
      completed: currentStep > 2,
      active: currentStep === 2,
    }
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step circle */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ 
                scale: step.active || step.completed ? 1 : 0.8, 
                opacity: step.active || step.completed ? 1 : 0.7 
              }}
              className="relative flex-shrink-0"
            >
              <div className={`flex items-center justify-center w-9 h-9 rounded-full border-2 ${
                step.active 
                  ? 'border-gold bg-gold/10 text-gold' 
                  : step.completed 
                    ? 'border-green-500 bg-green-500/10 text-green-500' 
                    : 'border-gray-600 bg-gray-800/50 text-gray-500'
              }`}>
                {step.completed ? (
                  <CheckCircle className="h-5 w-5" />
                ) : step.active ? (
                  <CircleDot className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </div>
              
              {/* Step label */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className={`text-xs font-medium ${
                  step.active ? 'text-gold' : step.completed ? 'text-green-500' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            </motion.div>
            
            {/* Connecting line between steps */}
            {index < steps.length - 1 && (
              <div className="flex-grow mx-1">
                <div className={`h-0.5 ${
                  index < currentStep ? 'bg-green-500' : 'bg-gray-700'
                }`}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ActivationProgress;
