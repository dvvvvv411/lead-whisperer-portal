
import { Button } from "@/components/ui/button";
import { BotIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface BotControlsHeaderProps {
  onManualTrade: () => void;
  tradesRemaining: number;
  isActive?: boolean;
  onBotToggle?: () => void;
}

const BotControlsHeader = ({ onManualTrade, tradesRemaining, isActive = false, onBotToggle }: BotControlsHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      {onBotToggle && (
        <div className="flex items-center gap-2">
          <Switch 
            id="bot-active" 
            checked={isActive} 
            onCheckedChange={onBotToggle} 
          />
          <Label htmlFor="bot-active" className="text-sm">
            {isActive ? 'Aktiviert' : 'Deaktiviert'}
          </Label>
        </div>
      )}
      
      <Button
        className="flex items-center"
        onClick={onManualTrade}
        disabled={tradesRemaining <= 0}
      >
        <BotIcon className="mr-2 h-4 w-4" />
        Trade ausführen
      </Button>
    </div>
  );
};

export default BotControlsHeader;
