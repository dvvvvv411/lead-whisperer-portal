
import React from 'react';
import { ActivityIcon, CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AlgorithmStepProps {
  name: string;
  isComplete: boolean;
  current?: boolean;
}

const AlgorithmStep = ({ name, isComplete, current = false }: AlgorithmStepProps) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-2.5 py-1.5 px-2 rounded-md transition-all duration-300",
        current ? "bg-accent1/10 text-accent1 font-medium" : 
        isComplete ? "text-gold/90" : "text-muted-foreground",
        isComplete && "animate-fade-in"
      )}
    >
      {isComplete ? (
        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
      ) : current ? (
        <ActivityIcon className="h-4 w-4 text-accent1 animate-pulse shrink-0" />
      ) : (
        <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
      )}
      
      <span className="text-xs">{name}</span>
      
      {current && (
        <div className="ml-auto flex items-center">
          <div className="h-1.5 w-1.5 rounded-full bg-accent1 animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmStep;
