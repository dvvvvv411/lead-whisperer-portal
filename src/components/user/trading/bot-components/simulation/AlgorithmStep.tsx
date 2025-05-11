
import React from 'react';
import { CheckIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlgorithmStepProps {
  name: string;
  isComplete: boolean;
  current: boolean;
}

const AlgorithmStep: React.FC<AlgorithmStepProps> = ({ name, isComplete, current }) => {
  return (
    <div className={cn(
      "py-1.5 px-2 rounded-md flex items-center justify-between text-sm transition-all duration-200",
      isComplete && "bg-green-500/10 text-white",
      current && !isComplete && "bg-accent1/10 text-white",
      !current && !isComplete && "text-muted-foreground"
    )}>
      <span className="truncate">{name}</span>
      
      <div className="ml-2 flex-shrink-0">
        {isComplete ? (
          <CheckIcon className="h-4 w-4 text-green-500" />
        ) : (
          current && (
            <Loader2 className="h-4 w-4 text-accent1 animate-spin" />
          )
        )}
      </div>
    </div>
  );
};

export default AlgorithmStep;
