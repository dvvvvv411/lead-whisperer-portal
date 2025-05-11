
import { CardTitle, CardDescription } from "@/components/ui/card";
import { ZapIcon } from "lucide-react";
import BotControlsHeader from "./BotControlsHeader";

interface TradingBotHeaderProps {
  onManualTrade: () => void;
  tradesRemaining: number;
}

const TradingBotHeader = ({ onManualTrade, tradesRemaining }: TradingBotHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <CardTitle className="flex items-center">
          <ZapIcon className="mr-2 h-5 w-5 text-yellow-400" />
          KI-Trading Bot
        </CardTitle>
        <CardDescription>Automatisierte Trades mit KI-Optimierung</CardDescription>
      </div>
      <BotControlsHeader 
        onManualTrade={onManualTrade}
        tradesRemaining={tradesRemaining}
      />
    </div>
  );
};

export default TradingBotHeader;
