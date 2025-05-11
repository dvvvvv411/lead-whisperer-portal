
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface BotPerformanceProps {
  botTrades: any[];
  loading: boolean;
  formatCurrency: (amount: number) => string;
}

const BotPerformance = ({ botTrades, loading, formatCurrency }: BotPerformanceProps) => {
  return (
    <div>
      <h3 className="font-medium mb-2">Letzte Bot-Trades</h3>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : botTrades.length > 0 ? (
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {botTrades.slice(0, 5).map((trade) => (
            <div key={trade.id} className="border rounded-md p-2 text-sm flex justify-between items-center">
              <div className="flex items-center">
                {trade.crypto_asset?.symbol && (
                  <span className="font-medium mr-1">{trade.crypto_asset.symbol}</span>
                )}
                <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'} className="mr-1">
                  {trade.type === 'buy' ? 'KAUF' : 'VERKAUF'}
                </Badge>
                <span>{trade.quantity.toFixed(6)}</span>
              </div>
              <div>
                {formatCurrency(trade.total_amount)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          Noch keine Bot-Trades vorhanden. Aktiviere den Bot, um zu beginnen.
        </div>
      )}
    </div>
  );
};

export default BotPerformance;
