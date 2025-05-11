
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AITradingBot from "@/components/user/trading/AITradingBot";
import CryptoMarketList from "@/components/user/trading/CryptoMarketList";
import TradeHistoryList from "@/components/user/trading/TradeHistoryList";
import { useCryptos } from "@/hooks/useCryptos";
import { useTradeHistory } from "@/hooks/useTradeHistory";

interface DashboardContentProps {
  userId?: string;
  userEmail?: string;
  userCredit: number;
  onTradeExecuted: () => void;
}

const DashboardContent = ({ userId, userEmail, userCredit, onTradeExecuted }: DashboardContentProps) => {
  const { cryptos, loading: cryptosLoading } = useCryptos();
  const { trades, botTrades, loading: tradesLoading } = useTradeHistory(userId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main section - AI Bot (takes 2/3 of the screen on large displays) */}
      <div className="lg:col-span-2">
        <AITradingBot 
          userId={userId} 
          userEmail={userEmail}
          userCredit={userCredit}
          onTradeExecuted={onTradeExecuted}
          className="transform transition-all duration-500 hover:translate-y-[-2px] hover:shadow-2xl"
        />
      </div>

      {/* Sidebar sections (1/3 of screen on large displays) */}
      <div className="space-y-6">
        {/* Market Overview */}
        <Card className="overflow-hidden transform transition-all duration-300 hover:translate-y-[-2px] border border-gold/10 bg-gradient-to-br from-casino-darker to-casino-card/90 shadow-lg backdrop-blur-xl">
          <CardHeader className="border-b border-gold/10 bg-gradient-to-r from-casino-darker/80 to-casino-dark/80">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent1-light animate-pulse"></div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent1-light to-accent1">
                Marktübersicht
              </span>
              <Sparkles className="h-4 w-4 text-accent1 ml-auto" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 max-h-[400px] overflow-y-auto">
            {cryptosLoading ? (
              <div className="p-4 text-center">
                <div className="h-8 w-8 rounded-full border-2 border-t-gold border-casino-card animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Lade Marktdaten...</p>
              </div>
            ) : (
              <CryptoMarketList 
                cryptos={cryptos} 
                userCredit={userCredit}
                onTrade={() => {}}
                compact={true}
              />
            )}
          </CardContent>
        </Card>

        {/* Trade History */}
        <Card className="overflow-hidden transform transition-all duration-300 hover:translate-y-[-2px] border border-gold/10 bg-gradient-to-br from-casino-darker to-casino-card/90 shadow-lg backdrop-blur-xl">
          <CardHeader className="border-b border-gold/10 bg-gradient-to-r from-casino-darker/80 to-casino-dark/80">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light">
                Handelshistorie
              </span>
              <Sparkles className="h-4 w-4 text-gold ml-auto" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 max-h-[400px] overflow-y-auto">
            {tradesLoading ? (
              <div className="p-4 text-center">
                <div className="h-8 w-8 rounded-full border-2 border-t-gold border-casino-card animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Lade Handelshistorie...</p>
              </div>
            ) : (
              <TradeHistoryList 
                trades={trades} 
                botTrades={botTrades}
                compact={true} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;
