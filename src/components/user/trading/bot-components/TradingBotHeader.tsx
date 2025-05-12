
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TradingBotHeaderProps {
  onManualTrade: () => void;
  tradesRemaining: number;
  userName?: string;
}

const TradingBotHeader = ({
  onManualTrade,
  tradesRemaining,
  userName
}: TradingBotHeaderProps) => {
  return (
    <div className="p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-gradient-to-r from-black/80 to-casino-dark/80 backdrop-blur-xl border-b border-accent1/10">
      <div className="flex items-center">
        <div className={cn("mr-3", "shadow-lg shadow-accent1/10")}>
          
        </div>
        <div>
          <CardTitle className="text-2xl font-bold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-accent1-light">
            KI-Trading Bot
            <Sparkles className="h-5 w-5 ml-2 text-accent1-light animate-pulse" />
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {userName ? `Hallo ${userName}, a` : "A"}utomatisierte Trades mit KI-Optimierung für maximale Gewinne
          </CardDescription>
        </div>
      </div>
    </div>
  );
};

export default TradingBotHeader;
