
import { CardTitle, CardDescription } from "@/components/ui/card";
import { ZapIcon, Bot, Sparkles } from "lucide-react";
import BotControlsHeader from "./BotControlsHeader";
import { cn } from "@/lib/utils";

interface TradingBotHeaderProps {
  onManualTrade: () => void;
  tradesRemaining: number;
}

const TradingBotHeader = ({ onManualTrade, tradesRemaining }: TradingBotHeaderProps) => {
  return (
    <div className="p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center">
          <div className={cn(
            "p-2 rounded-full bg-gold/10 mr-3",
            "animate-pulse-gold"
          )}>
            <Bot className="h-6 w-6 text-gold" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold flex items-center">
              KI-Trading Bot
              <Sparkles className="h-5 w-5 ml-2 text-gold animate-pulse" />
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Automatisierte Trades mit KI-Optimierung für maximale Gewinne
            </CardDescription>
          </div>
        </div>
      </div>
      <BotControlsHeader 
        onManualTrade={onManualTrade}
        tradesRemaining={tradesRemaining}
      />
    </div>
  );
};

export default TradingBotHeader;
