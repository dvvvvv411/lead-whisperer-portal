
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ZapIcon } from "lucide-react";
import { useAITradingBot } from "@/hooks/useAITradingBot";
import { useTradeHistory } from "@/hooks/useTradeHistory";
import RankDisplay from "./RankDisplay";
import BotStatusOverview from "./bot-components/BotStatusOverview";
import BotSettingsPanel from "./bot-components/BotSettingsPanel";
import BotPerformance from "./bot-components/BotPerformance";
import BotInfoCard from "./bot-components/BotInfoCard";
import BotControlsHeader from "./bot-components/BotControlsHeader";

interface AITradingBotProps {
  userId?: string;
  userCredit?: number;
  onTradeExecuted?: () => void;
}

const AITradingBot = ({ userId, userCredit = 0, onTradeExecuted }: AITradingBotProps) => {
  const { 
    settings, 
    status, 
    startBot, 
    stopBot, 
    updateBotSettings,
    executeSingleTrade,
    rankTiers
  } = useAITradingBot(userId, userCredit, onTradeExecuted);
  const { botTrades, loading: tradesLoading } = useTradeHistory(userId);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  const handleToggleBot = () => {
    if (settings.isActive) {
      stopBot();
    } else {
      startBot();
    }
  };

  const handleManualTrade = async () => {
    const success = await executeSingleTrade();
    if (success && onTradeExecuted) {
      onTradeExecuted();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <ZapIcon className={`mr-2 h-5 w-5 ${settings.isActive ? 'text-yellow-400' : 'text-gray-400'}`} />
              KI-Trading Bot
              {settings.isActive && (
                <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 animate-pulse">
                  Aktiv
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Automatisierte Trades mit KI-Optimierung</CardDescription>
          </div>
          <BotControlsHeader 
            isActive={settings.isActive}
            onToggleBot={handleToggleBot}
            onManualTrade={handleManualTrade}
            tradesRemaining={status.tradesRemaining}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Rank Display */}
          <RankDisplay 
            currentRank={status.currentRank}
            maxTradesPerDay={status.maxTradesPerDay}
            tradesRemaining={status.tradesRemaining}
            dailyTradesExecuted={status.dailyTradesExecuted}
            userCredit={userCredit}
            rankTiers={rankTiers}
          />

          {/* Bot Status Overview */}
          <BotStatusOverview
            isActive={settings.isActive}
            totalProfitAmount={status.totalProfitAmount}
            totalProfitPercentage={status.totalProfitPercentage}
            tradesExecuted={status.tradesExecuted}
            dailyTradesExecuted={status.dailyTradesExecuted}
            lastTradeTime={status.lastTradeTime}
            formatCurrency={formatCurrency}
          />
          
          {/* Bot Settings */}
          <BotSettingsPanel
            settings={settings}
            isActive={settings.isActive}
            userCredit={userCredit}
            updateBotSettings={updateBotSettings}
            formatCurrency={formatCurrency}
          />
          
          {/* Bot Performance */}
          <BotPerformance
            botTrades={botTrades}
            loading={tradesLoading}
            formatCurrency={formatCurrency}
          />
          
          {/* Bot Info */}
          <BotInfoCard />
        </div>
      </CardContent>
    </Card>
  );
};

export default AITradingBot;
