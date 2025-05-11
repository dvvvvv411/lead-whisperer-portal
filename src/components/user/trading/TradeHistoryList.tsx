
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TradeHistoryItem {
  id: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total_amount: number;
  strategy: string;
  status: string;
  simulation_date: string;
  created_at: string;
  crypto_asset?: {
    id: string;
    symbol: string;
    name: string;
    image_url: string | null;
  };
}

interface TradeHistoryListProps {
  trades: TradeHistoryItem[];
  botTrades?: TradeHistoryItem[];
}

const TradeHistoryList = ({ trades, botTrades = [] }: TradeHistoryListProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'bot'>('all');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
  };
  
  const getStrategyName = (strategyId: string) => {
    const strategies: Record<string, string> = {
      'trend_following': 'Trendfolge-Strategie',
      'mean_reversion': 'Mean-Reversion-Strategie',
      'momentum': 'Momentum-Strategie',
      'sentiment': 'Sentiment-Analyse',
      'bot_trend_following': 'KI Trendfolge',
      'bot_mean_reversion': 'KI Mean-Reversion',
      'bot_momentum': 'KI Momentum',
      'bot_sentiment': 'KI Sentiment-Analyse',
      'ai_deep_learning': 'KI Deep Learning'
    };
    
    return strategies[strategyId] || strategyId;
  };
  
  // Determine which trades to display based on active tab
  const displayTrades = activeTab === 'bot' ? botTrades : trades;

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList>
          <TabsTrigger value="all">Alle Trades</TabsTrigger>
          <TabsTrigger value="bot">Bot Trades</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum</TableHead>
              <TableHead>Aktion</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Menge</TableHead>
              <TableHead className="text-right">Preis</TableHead>
              <TableHead className="text-right">Gesamtbetrag</TableHead>
              <TableHead>Strategie</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayTrades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {activeTab === 'bot' ? 'Keine Bot-Handelshistorie vorhanden' : 'Keine Handelshistorie vorhanden'}
                </TableCell>
              </TableRow>
            ) : (
              displayTrades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(trade.created_at)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={trade.type === 'buy' ? 'default' : 'destructive'}
                      className="uppercase"
                    >
                      {trade.type === 'buy' ? 'Kauf' : 'Verkauf'}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    {trade.crypto_asset?.image_url && (
                      <img 
                        src={trade.crypto_asset.image_url} 
                        alt={trade.crypto_asset?.symbol || ''} 
                        className="w-5 h-5 rounded-full" 
                      />
                    )}
                    <span>{trade.crypto_asset?.symbol}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    {trade.quantity.toFixed(6)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(trade.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(trade.total_amount)}
                  </TableCell>
                  <TableCell>
                    {getStrategyName(trade.strategy)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TradeHistoryList;
