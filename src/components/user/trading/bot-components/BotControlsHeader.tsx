
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZapIcon, ZapOffIcon, ActivityIcon } from "lucide-react";

interface BotControlsHeaderProps {
  isActive: boolean;
  onToggleBot: () => void;
  onManualTrade: () => void;
  tradesRemaining: number;
}

const BotControlsHeader = ({
  isActive,
  onToggleBot,
  onManualTrade,
  tradesRemaining
}: BotControlsHeaderProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        onClick={onManualTrade}
        variant="outline"
        disabled={isActive || tradesRemaining <= 0}
      >
        <ActivityIcon className="h-4 w-4 mr-2" />
        Trade ausführen
        {tradesRemaining <= 0 && (
          <Badge variant="outline" className="ml-1 bg-red-100 text-red-800">
            Limit
          </Badge>
        )}
      </Button>
      <Button 
        onClick={onToggleBot} 
        variant={isActive ? "destructive" : "default"}
        className="relative overflow-hidden"
        disabled={!isActive && tradesRemaining <= 0}
      >
        {isActive ? (
          <>
            <ZapOffIcon className="h-4 w-4 mr-2" />
            Deaktivieren
          </>
        ) : (
          <>
            <ZapIcon className="h-4 w-4 mr-2" />
            Aktivieren
          </>
        )}
      </Button>
    </div>
  );
};

export default BotControlsHeader;
