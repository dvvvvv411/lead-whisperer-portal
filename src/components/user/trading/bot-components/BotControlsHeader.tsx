
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActivityIcon } from "lucide-react";

interface BotControlsHeaderProps {
  onManualTrade: () => void;
  tradesRemaining: number;
}

const BotControlsHeader = ({
  onManualTrade,
  tradesRemaining
}: BotControlsHeaderProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        onClick={onManualTrade}
        variant="default"
        disabled={tradesRemaining <= 0}
      >
        <ActivityIcon className="h-4 w-4 mr-2" />
        Trade ausführen
        {tradesRemaining <= 0 && (
          <Badge variant="outline" className="ml-1 bg-red-100 text-red-800">
            Limit
          </Badge>
        )}
      </Button>
    </div>
  );
};

export default BotControlsHeader;
