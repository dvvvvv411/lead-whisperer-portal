
import { Button } from "@/components/ui/button";
import { BotIcon, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface BotControlsHeaderProps {
  onManualTrade: () => void;
  tradesRemaining: number;
}

const BotControlsHeader = ({ onManualTrade, tradesRemaining }: BotControlsHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="text-sm text-muted-foreground mr-1">
        <span className="font-medium">{tradesRemaining}</span> Trades verfügbar
      </div>
      <Button
        className={cn(
          "flex items-center gap-2 relative overflow-hidden",
          "bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold",
          "text-gold-foreground",
          "border-0",
          "shadow-lg",
          "transition-all duration-300",
          "after:content-[''] after:absolute after:h-full after:w-full after:top-0 after:left-0",
          "after:bg-white/20 after:opacity-0 hover:after:opacity-100 after:transition-opacity",
          tradesRemaining <= 0 && "opacity-50 cursor-not-allowed"
        )}
        onClick={onManualTrade}
        disabled={tradesRemaining <= 0}
      >
        <Zap className="h-5 w-5 animate-pulse" />
        <span className="font-bold">Trade ausführen</span>
      </Button>
    </div>
  );
};

export default BotControlsHeader;
