
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import BotTradeCard from "./BotTradeCard";

interface BotPerformanceProps {
  botTrades: any[];
  loading: boolean;
  formatCurrency: (amount: number) => string;
}

const BotPerformance = ({ botTrades, loading, formatCurrency }: BotPerformanceProps) => {
  // Group trades by pairs of buy and sell transactions for the same crypto
  const groupTrades = () => {
    // Create a deep copy of trades to avoid modifying the original array
    const tradesCopy = JSON.parse(JSON.stringify(botTrades));
    
    // Sort trades by created_at
    const sortedTrades = tradesCopy.sort((a: any, b: any) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    const groupedTrades = [];
    
    // Group by crypto asset and by pairs (buy and sell)
    const buyTrades: Record<string, any> = {}; // Map to store buy trades by crypto
    
    for (const trade of sortedTrades) {
      const cryptoSymbol = trade.crypto_asset?.symbol;
      if (!cryptoSymbol) continue;
      
      // Store buy trades, looking for a matching sell trade later
      if (trade.type === 'buy') {
        if (!buyTrades[cryptoSymbol]) {
          buyTrades[cryptoSymbol] = [];
        }
        buyTrades[cryptoSymbol].push(trade);
      } 
      // Match with previous buy trade
      else if (trade.type === 'sell') {
        if (buyTrades[cryptoSymbol] && buyTrades[cryptoSymbol].length > 0) {
          const buyTrade = buyTrades[cryptoSymbol].shift(); // Get the oldest buy trade
          groupedTrades.push({
            buy: buyTrade,
            sell: trade,
            cryptoSymbol,
            id: `${buyTrade.id}-${trade.id}`
          });
        } else {
          // Standalone sell trade (shouldn't happen in normal flow, but handle it)
          groupedTrades.push({
            buy: null,
            sell: trade,
            cryptoSymbol,
            id: trade.id
          });
        }
      }
    }
    
    // Add remaining buy trades without matching sells
    Object.keys(buyTrades).forEach(symbol => {
      buyTrades[symbol].forEach((buyTrade: any) => {
        groupedTrades.push({
          buy: buyTrade,
          sell: null,
          cryptoSymbol: symbol,
          id: buyTrade.id
        });
      });
    });
    
    // Sort final pairs by most recent activity
    return groupedTrades.sort((a, b) => {
      const aDate = a.sell ? new Date(a.sell.created_at) : new Date(a.buy.created_at);
      const bDate = b.sell ? new Date(b.sell.created_at) : new Date(b.buy.created_at);
      return bDate.getTime() - aDate.getTime(); // Descending order
    });
  };

  const tradePairs = groupTrades();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center">
          <Bot className="h-4 w-4 mr-2 text-accent1-light" />
          Bot-Trading Aktivität
        </h3>
        {botTrades.length > 0 && (
          <Badge variant="outline" className="bg-accent1/10 text-accent1-light border-accent1/30">
            {tradePairs.length} 
            <span className="ml-1 text-xs">Trades</span>
          </Badge>
        )}
      </div>
      
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full bg-casino-card" />
          ))}
        </div>
      ) : tradePairs.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {tradePairs.slice(0, 10).map((pair) => (
            pair.buy && (
              <BotTradeCard
                key={pair.id}
                buyTrade={pair.buy}
                sellTrade={pair.sell}
                formatCurrency={formatCurrency}
              />
            )
          ))}
        </div>
      ) : (
        <div className="text-center py-4 px-4 border border-dashed border-casino-highlight rounded-lg bg-casino-darker">
          <Bot className="h-6 w-6 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm text-muted-foreground">
            Noch keine Bot-Trades vorhanden.
          </p>
        </div>
      )}
    </div>
  );
};

export default BotPerformance;
