
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface BotPerformanceProps {
  botTrades: any[];
  loading: boolean;
  formatCurrency: (amount: number) => string;
}

const BotPerformance = ({ botTrades, loading, formatCurrency }: BotPerformanceProps) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'HH:mm', { locale: de });
  };
  
  // Get trend icon based on trade type
  const getTrendIcon = (type: 'buy' | 'sell') => {
    if (type === 'buy') return <TrendingUp className="h-3 w-3" />;
    return <TrendingDown className="h-3 w-3" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center">
          <Bot className="h-4 w-4 mr-2 text-accent1-light" />
          Letzte Bot-Trades
        </h3>
        {botTrades.length > 0 && (
          <Badge variant="outline" className="bg-accent1/10 text-accent1-light border-accent1/30">
            {botTrades.length} 
            <span className="ml-1 text-xs">Trades</span>
          </Badge>
        )}
      </div>
      
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full bg-casino-card" />
          <Skeleton className="h-12 w-full bg-casino-card" />
          <Skeleton className="h-12 w-full bg-casino-card" />
        </div>
      ) : botTrades.length > 0 ? (
        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-accent1/20 scrollbar-track-casino-card">
          {botTrades.slice(0, 5).map((trade) => (
            <div 
              key={trade.id} 
              className={cn(
                "border rounded-md p-3 transition-all",
                "bg-casino-darker border-gold/10 hover:border-gold/20",
                "transform hover:translate-y-[-2px] hover:shadow-md",
                "duration-300"
              )}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {trade.crypto_asset?.image_url && (
                    <div className="h-8 w-8 rounded-full overflow-hidden border border-gold/20 mr-3 p-1 bg-casino-card flex items-center justify-center">
                      <img 
                        src={trade.crypto_asset.image_url} 
                        alt={trade.crypto_asset.symbol} 
                        className="h-5 w-5"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-sm">{trade.crypto_asset?.symbol?.toUpperCase()}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(trade.created_at)}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <Badge 
                    variant={trade.type === 'buy' ? 'default' : 'secondary'}
                    className={cn(
                      "mb-1 flex items-center",
                      trade.type === 'buy' 
                        ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30" 
                        : "bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30"
                    )}
                  >
                    {getTrendIcon(trade.type)}
                    <span className="ml-1">{trade.type === 'buy' ? 'KAUF' : 'VERKAUF'}</span>
                  </Badge>
                  <span className="text-gold font-medium">{formatCurrency(trade.total_amount)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 px-4 border border-dashed border-casino-highlight rounded-lg bg-casino-darker">
          <Bot className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-muted-foreground">
            Noch keine Bot-Trades vorhanden. Aktiviere den Bot, um zu beginnen.
          </p>
        </div>
      )}
    </div>
  );
};

export default BotPerformance;
