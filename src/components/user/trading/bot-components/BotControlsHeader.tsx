
import { Button } from "@/components/ui/button";
import { BotIcon } from "lucide-react";

interface BotControlsHeaderProps {
  onManualTrade: () => void;
  tradesRemaining: number;
}

const BotControlsHeader = ({ onManualTrade, tradesRemaining }: BotControlsHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
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
