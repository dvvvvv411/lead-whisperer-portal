
import React, { useRef } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { ActivityIcon } from "lucide-react";
import { algorithmSteps } from "./simulation/simulationUtils";
import SimulationDialogContent from "./simulation/SimulationDialogContent";
import { useSimulation } from "./simulation/useSimulation";

interface TradeSimulationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (success: boolean, selectedCrypto?: any) => void;
  cryptoData: any[];
}

const TradeSimulationDialog = React.memo(({ 
  open, 
  onOpenChange, 
  onComplete,
  cryptoData
}: TradeSimulationDialogProps) => {
  // Use refs for simulation state tracking
  const simulationActive = useRef(false);
  
  // Fixed simulation duration of exactly 60 seconds
  const simulationDuration = 60000; // 60 seconds

  // Use our custom hook for simulation logic
  const { progress, currentStep, comparisons } = useSimulation({
    onComplete,
    cryptoData,
    simulationActive: simulationActive.current,
    simulationDuration
  });

  // Initialize or reset the simulation when dialog opens
  React.useEffect(() => {
    if (open) {
      console.log("Dialog opened, initializing simulation");
      simulationActive.current = true;
    } else {
      simulationActive.current = false;
    }
  }, [open]);
  
  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpenState) => {
        // If dialog is being closed manually and simulation is still running
        if (!newOpenState && simulationActive.current) {
          console.log("Dialog manually closed, cancelling simulation");
          simulationActive.current = false;
        }
        onOpenChange(newOpenState);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ActivityIcon className="h-4 w-4 mr-2 text-blue-600" />
            KI-Trading im Prozess
          </DialogTitle>
          <DialogDescription>
            Der KI-Algorithmus analysiert aktuell die besten Handelsmöglichkeiten.
          </DialogDescription>
        </DialogHeader>
        
        <SimulationDialogContent 
          progress={progress}
          comparisons={comparisons}
          steps={algorithmSteps}
          currentStep={currentStep}
        />
        
        <DialogFooter className="text-xs text-muted-foreground">
          Trade wird automatisch ausgeführt, sobald die optimale Gelegenheit identifiziert wurde.
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

TradeSimulationDialog.displayName = 'TradeSimulationDialog';
export default TradeSimulationDialog;
