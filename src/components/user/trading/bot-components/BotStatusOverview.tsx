
import { Badge } from "@/components/ui/badge";
import { TrendingUpIcon, ActivityIcon, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

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
  // Format time for last trade
  const formatTime = (date: Date | null) => {
    if (!date) return "Nie";
    return new Date(date).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Bot status card */}
      <div className={cn(
        "p-4 rounded-lg transition-all duration-500 relative overflow-hidden",
        "border", 
        isActive 
          ? "bg-green-400/5 border-green-400/20" 
          : "bg-casino-card border-gold/10"
      )}>
        {/* Animated background gradient for active state */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-green-600/5 animate-gradient-shift blur-sm"></div>
        )}
        <div className="relative z-10">
          <p className="text-sm text-muted-foreground mb-1">Bot-Status</p>
          <div className="flex items-center">
            <div className={cn(
              "h-3 w-3 rounded-full mr-2", 
              isActive 
                ? "bg-green-400 animate-pulse" 
                : "bg-gray-400"
            )}></div>
            <span className={cn(
              "font-medium text-lg",
              isActive ? "text-green-400" : "text-muted-foreground"
            )}>
              {isActive ? 'Aktiv' : 'Inaktiv'}
            </span>
          </div>
          {isActive && lastTradeTime && (
            <div className="text-xs text-muted-foreground mt-2 flex items-center">
              <ActivityIcon className="h-3 w-3 mr-1" />
              Letzter Trade: {formatTime(lastTradeTime)}
            </div>
          )}
        </div>
      </div>
      
      {/* Profit card */}
      <div className={cn(
        "p-4 rounded-lg border relative overflow-hidden",
        totalProfitAmount > 0 
          ? "bg-gradient-to-br from-green-400/5 to-green-600/5 border-green-400/20" 
          : totalProfitAmount < 0 
            ? "bg-gradient-to-br from-red-400/5 to-red-600/5 border-red-400/20"
            : "bg-casino-card border-gold/10"
      )}>
        {/* Animated background element */}
        {totalProfitAmount !== 0 && (
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br from-gold/5 to-accent1/5 blur-xl animate-float"></div>
        )}
        
        <div className="relative z-10">
          <p className="text-sm text-muted-foreground mb-1">Gewinn Heute</p>
          <div className={cn(
            "flex items-center text-xl font-bold",
            totalProfitAmount > 0 ? "text-green-400" :
            totalProfitAmount < 0 ? "text-red-400" : "text-muted-foreground"
          )}>
            <TrendingUpIcon className="h-5 w-5 mr-2" />
            {formatCurrency(totalProfitAmount)}
          </div>
          <div className={cn(
            "text-sm flex items-center mt-1",
            totalProfitPercentage > 0 ? "text-green-400" :
            totalProfitPercentage < 0 ? "text-red-400" : "text-muted-foreground"
          )}>
            {totalProfitPercentage.toFixed(2)}%
          </div>
        </div>
      </div>
      
      {/* Activity card */}
      <div className={cn(
        "p-4 rounded-lg border border-gold/10 bg-casino-card relative overflow-hidden"
      )}>
        {/* Animated element */}
        <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-accent1/10 blur-xl animate-pulse"></div>
        
        <div className="relative z-10">
          <p className="text-sm text-muted-foreground mb-1">Ausgeführte Trades</p>
          <div className="flex items-center">
            <ActivityIcon className="h-5 w-5 mr-2 text-accent1-light" />
            <div className="text-xl font-bold">
              <span className="text-accent1-light">{dailyTradesExecuted}</span>
              <span className="text-sm text-muted-foreground"> / </span>
              <span className="text-muted-foreground font-normal">{tradesExecuted} Gesamt</span>
            </div>
          </div>
          
          {dailyTradesExecuted > 0 && (
            <div className="flex items-center justify-start mt-2">
              <Badge variant="outline" className="bg-accent1/10 text-accent1-light border-accent1/30">
                <Zap className="h-3 w-3 mr-1" />
                Aktiv
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BotStatusOverview;
