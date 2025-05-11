
import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";

interface TradingBotHeaderProps {
  tradesRemaining: number;
}

const TradingBotHeader = ({ 
  tradesRemaining 
}: TradingBotHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-casino-darker to-casino-dark p-4 border-b border-gold/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent1-dark to-accent1-light flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent1-light to-accent1">
            KI-Trading Bot
          </h2>
        </div>

        {/* Trade counter indicator removed - now part of the power button in RankDisplay */}
      </div>
    </div>
  );
};

export default TradingBotHeader;
