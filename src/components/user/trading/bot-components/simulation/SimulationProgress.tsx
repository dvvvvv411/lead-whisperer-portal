
import React from 'react';
import { CircleCheck } from "lucide-react";

interface SimulationProgressProps {
  progress: number;
  duration?: number;
  elapsed?: number;
}

const SimulationProgress: React.FC<SimulationProgressProps> = ({ 
  progress,
  duration,
  elapsed
}) => {
  // Animation classes based on progress
  const getProgressClasses = () => {
    if (progress >= 100) return "bg-gradient-to-r from-green-500 to-green-400";
    if (progress >= 75) return "bg-gradient-to-r from-gold to-yellow-500 animate-pulse";
    if (progress >= 50) return "bg-gradient-to-r from-accent1 to-violet-500 animate-pulse";
    return "bg-gradient-to-r from-blue-600 to-accent1";
  };

  return (
    <div className="space-y-1.5">
      <div className="text-xs text-muted-foreground flex justify-between items-center">
        <span className="font-medium">KI-Trading Fortschritt</span>
        <div className="flex items-center gap-1">
          {progress >= 100 && 
            <CircleCheck className="h-4 w-4 text-green-500 mr-0.5 animate-fade-in" />
          }
          <span className="text-sm font-semibold text-white">
            {progress}%
          </span>
        </div>
      </div>
      
      <div className="h-2.5 bg-casino-darker rounded-full overflow-hidden relative border border-casino-highlight/20">
        {/* Shimmer effect */}
        <div className="absolute inset-0 w-full h-full opacity-20 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-gradient-shift bg-[length:200%_100%]"></div>
        
        {/* Actual progress bar */}
        <div 
          className={`h-full rounded-full ${getProgressClasses()} transition-all duration-300`} 
          style={{ width: `${progress}%` }}
        >
          {/* Additional shimmer for the filled part */}
          <div className="absolute inset-0 w-full h-full opacity-30 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-gradient-shift bg-[length:200%_100%]"></div>
        </div>
      </div>
    </div>
  );
};

export default SimulationProgress;
