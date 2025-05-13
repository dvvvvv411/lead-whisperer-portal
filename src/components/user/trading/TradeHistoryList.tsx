
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { BotIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TradeHistoryListProps {
  trades: any[];
  botTrades?: any[];
  compact?: boolean;
}

const TradeHistoryList = ({ trades, botTrades = [], compact = false }: TradeHistoryListProps) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, compact ? 'HH:mm' : 'dd.MM.yyyy HH:mm', { locale: de });
  };

  // Check if a trade was executed by the AI bot
  const isBotTrade = (trade: any) => {
    return trade.strategy.includes('bot_') || trade.strategy.includes('ai_');
  };

  // Display the most recent trades first
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  // Limit to 10 most recent trades if in compact mode
  const displayedTrades = compact ? sortedTrades.slice(0, 10) : sortedTrades;

  return (
    <div className={compact ? "p-2" : "p-4"}>
      {displayedTrades.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          Keine Handelshistorie verfügbar
        </div>
      ) : (
        <div className="space-y-2">
          {displayedTrades.map((trade) => (
            <div 
              key={trade.id} 
              className={cn(
                "rounded-lg border transition-all",
                isBotTrade(trade) 
                  ? "border-accent1/30 bg-accent1/5 hover:bg-accent1/10" 
                  : "border-casino-highlight bg-casino-card hover:bg-casino-highlight/50",
                compact ? "p-2" : "p-3"
              )}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {trade.crypto_asset?.image_url && (
                    <img 
                      src={trade.crypto_asset?.image_url} 
                      alt={trade.crypto_asset?.symbol || "Crypto"} 
                      className={`${compact ? "h-4 w-4" : "h-6 w-6"} mr-2 rounded-full`} 
                    />
                  )}
                  <span className={`${compact ? "text-xs" : "text-sm"} font-medium text-white`}>
                    {trade.crypto_asset?.symbol?.toUpperCase() || "UNKNOWN"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge 
                    variant={trade.type === 'buy' ? 'default' : 'secondary'}
                    className={cn(
                      compact ? "text-xs px-1.5 py-0" : "text-xs px-2 py-0.5",
                      trade.type === 'buy' 
                        ? "bg-green-600/30 text-green-300 hover:bg-green-600/40 border-green-600/50" 
                        : "bg-red-600/30 text-red-300 hover:bg-red-600/40 border-red-600/50"
                    )}
                  >
                    {trade.type === 'buy' ? (
                      <TrendingUp className={`${compact ? "h-3 w-3" : "h-3.5 w-3.5"} mr-0.5`} />
                    ) : (
                      <TrendingDown className={`${compact ? "h-3 w-3" : "h-3.5 w-3.5"} mr-0.5`} />
                    )}
                    {trade.type === 'buy' ? 'KAUF' : 'VERKAUF'}
                  </Badge>
                  
                  {isBotTrade(trade) && (
                    <Badge 
                      variant="outline"
                      className={cn(
                        "bg-accent1/10 text-accent1-light border-accent1/30",
                        compact ? "text-[0.65rem] px-1 py-0" : "text-xs px-1.5 py-0"
                      )}
                    >
                      <BotIcon className={`${compact ? "h-2.5 w-2.5" : "h-3 w-3"} mr-0.5`} />
                      BOT
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-2">
                <div className={`${compact ? "text-xs" : "text-sm"} text-gray-300`}>
                  {formatDate(trade.created_at)}
                </div>
                <div className={`${compact ? "text-xs" : "text-sm"} font-medium text-gold`}>
                  {formatCurrency(trade.total_amount)}
                </div>
              </div>

              {!compact && (
                <div className="flex justify-between mt-1">
                  <div className="text-xs text-gray-400">
                    Strategie: {trade.strategy}
                  </div>
                  <div className="text-xs text-gray-400">
                    {trade.quantity.toFixed(6)} @ {formatCurrency(trade.price)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TradeHistoryList;
