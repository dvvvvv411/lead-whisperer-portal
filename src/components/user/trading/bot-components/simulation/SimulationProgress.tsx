
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface SimulationProgressProps {
  progress: number;
}

const SimulationProgress: React.FC<SimulationProgressProps> = ({ progress }) => {
  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground flex justify-between">
        <span>Fortschritt</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default SimulationProgress;
