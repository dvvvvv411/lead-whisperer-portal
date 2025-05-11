
import React from 'react';
import { ActivityIcon } from "lucide-react";

export interface AlgorithmStepProps {
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

export default AlgorithmStep;
