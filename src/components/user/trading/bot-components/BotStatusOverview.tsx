
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, TrendingUpIcon, ActivityIcon } from "lucide-react";

interface BotStatusOverviewProps {
  isActive: boolean;
  totalProfitAmount: number;
  totalProfitPercentage: number;
  tradesExecuted: number;
  dailyTradesExecuted: number;
  lastTradeTime: Date | null;
  formatCurrency: (amount: number) => string;
}

const BotStatusOverview = ({
  isActive,
  totalProfitAmount,
  totalProfitPercentage,
  tradesExecuted,
  dailyTradesExecuted,
  lastTradeTime,
  formatCurrency
}: BotStatusOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground mb-1">Bot-Status</p>
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className="font-medium">{isActive ? 'Aktiv' : 'Inaktiv'}</span>
        </div>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground mb-1">Gewinn Gesamt</p>
        <div className="flex items-center text-green-600 font-bold">
          <TrendingUpIcon className="h-4 w-4 mr-1" />
          {formatCurrency(totalProfitAmount)}
        </div>
        <div className="text-xs text-green-600 flex items-center mt-1">
          <ArrowUpIcon className="h-3 w-3 mr-1" />
          {totalProfitPercentage.toFixed(2)}%
        </div>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground mb-1">Ausgeführte Trades</p>
        <div className="font-bold flex items-center">
          <ActivityIcon className="h-4 w-4 mr-1 text-blue-500" />
          {tradesExecuted}
          <span className="text-xs text-muted-foreground ml-2">
            (Heute: {dailyTradesExecuted})
          </span>
        </div>
        {lastTradeTime && (
          <div className="text-xs text-muted-foreground mt-1">
            Letzter Trade: {new Date(lastTradeTime).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default BotStatusOverview;
