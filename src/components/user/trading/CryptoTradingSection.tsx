
import { useState, useEffect } from "react";
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
import AITradingBot from "./AITradingBot";

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
  const { trades, botTrades, loading: tradesLoading, fetchTradeHistory } = useTradeHistory(user?.id);
  const { executeTradeSimulation, tradingLoading } = useTrades();
  
  // Refresh data every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Update all relevant data
      updateCryptoPrices();
      if (user?.id) {
        fetchPortfolio();
        fetchTradeHistory();
      }
      onUpdated(); // Update balance
    }, 60000); // 60 seconds
    
    return () => clearInterval(interval);
  }, [updateCryptoPrices, fetchPortfolio, fetchTradeHistory, onUpdated, user?.id]);
  
  // Also fetch data when the component mounts
  useEffect(() => {
    console.log("CryptoTradingSection mounted, fetching initial data");
    updateCryptoPrices();
    if (user?.id) {
      fetchPortfolio();
      fetchTradeHistory();
    }
  }, [updateCryptoPrices, fetchPortfolio, fetchTradeHistory, user?.id]);
  
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
    console.log("Manual refresh triggered");
    updateCryptoPrices();
    fetchPortfolio();
    fetchTradeHistory();
    onUpdated();
  };

  const handleBotTradeExecuted = () => {
    // Refresh all data when the bot performs a trade
    console.log("Bot trade executed, refreshing all data");
    fetchPortfolio();
    fetchTradeHistory();
    onUpdated(); // Update parent component (to refresh user credit)
  };

  // Log whenever we change tabs
  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    setSelectedTab(value);
    
    // If changing to AIBot or history tab, refresh data
    if (value === "aibot" || value === "history") {
      fetchTradeHistory();
      onUpdated();
    } else if (value === "portfolio") {
      fetchPortfolio();
      onUpdated();
    }
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
        <Tabs defaultValue="market" value={selectedTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="market">Marktübersicht</TabsTrigger>
            <TabsTrigger value="portfolio">Mein Portfolio</TabsTrigger>
            <TabsTrigger value="history">Handelshistorie</TabsTrigger>
            <TabsTrigger value="aibot">KI-Bot</TabsTrigger>
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
              <TradeHistoryList trades={trades} botTrades={botTrades} />
            )}
          </TabsContent>
          
          <TabsContent value="aibot">
            <AITradingBot 
              userId={user?.id} 
              userCredit={userCredit}
              userEmail={user?.email}
              onTradeExecuted={handleBotTradeExecuted}
            />
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
