
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useCryptos } from "@/hooks/useCryptos";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useTradeHistory } from "@/hooks/useTradeHistory";
import { useTrades } from "@/hooks/useTrades";
import CryptoMarketList from "./CryptoMarketList";
import PortfolioOverview from "./PortfolioOverview";
import TradeForm from "./TradeForm";
import TradeHistoryList from "./TradeHistoryList";
import { Skeleton } from "@/components/ui/skeleton";

interface CryptoTradingProps {
  user?: any;
  userCredit: number;
  onUpdated: () => void;
}

const CryptoTradingSection = ({ user, userCredit, onUpdated }: CryptoTradingProps) => {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("market");
  const { cryptos, loading: cryptosLoading, updateCryptoPrices } = useCryptos();
  const { portfolio, summary, loading: portfolioLoading, fetchPortfolio } = usePortfolio(user?.id);
  const { trades, loading: tradesLoading, fetchTradeHistory } = useTradeHistory(user?.id);
  const { executeTradeSimulation, tradingLoading } = useTrades();
  
  const handleTrade = async (
    cryptoId: string, 
    type: 'buy' | 'sell', 
    quantity: number, 
    price: number,
    strategy: string
  ) => {
    if (!user) {
      toast({
        title: "Fehler",
        description: "Sie müssen angemeldet sein, um handeln zu können.",
        variant: "destructive"
      });
      return;
    }
    
    const result = await executeTradeSimulation({
      userId: user.id,
      userEmail: user.email,
      cryptoId,
      type,
      quantity,
      price,
      strategy,
      userCredit
    });
    
    if (result) {
      // Refresh data after successful trade
      fetchPortfolio();
      fetchTradeHistory();
      onUpdated(); // Update parent component (to refresh user credit)
    }
  };

  const handleRefresh = () => {
    updateCryptoPrices();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Krypto-Trading Simulator</CardTitle>
            <CardDescription>Simulieren Sie Krypto-Trades mit AI-gestützten Strategien</CardDescription>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={cryptosLoading}>
            Kurse aktualisieren
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="market" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="market">Marktübersicht</TabsTrigger>
            <TabsTrigger value="portfolio">Mein Portfolio</TabsTrigger>
            <TabsTrigger value="history">Handelshistorie</TabsTrigger>
          </TabsList>
          
          <TabsContent value="market">
            {cryptosLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <CryptoMarketList 
                cryptos={cryptos} 
                onTrade={handleTrade} 
                userCredit={userCredit}
              />
            )}
          </TabsContent>
          
          <TabsContent value="portfolio">
            {portfolioLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <PortfolioOverview 
                portfolio={portfolio} 
                summary={summary}
                onTrade={handleTrade}
              />
            )}
          </TabsContent>
          
          <TabsContent value="history">
            {tradesLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <TradeHistoryList trades={trades} />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <p>Die Kurse werden alle 5 Minuten aktualisiert. Datenquelle: CoinGecko</p>
      </CardFooter>
    </Card>
  );
};

export default CryptoTradingSection;
