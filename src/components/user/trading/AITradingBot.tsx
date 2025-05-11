
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ZapIcon } from "lucide-react";
import { useAITradingBot } from "@/hooks/useAITradingBot";
import { useTradeHistory } from "@/hooks/useTradeHistory";
import { useCryptos } from "@/hooks/useCryptos";
import { useState } from "react";
import RankDisplay from "./RankDisplay";
import BotStatusOverview from "./bot-components/BotStatusOverview";
import BotSettingsPanel from "./bot-components/BotSettingsPanel";
import BotPerformance from "./bot-components/BotPerformance";
import BotInfoCard from "./bot-components/BotInfoCard";
import BotControlsHeader from "./bot-components/BotControlsHeader";
import TradeSimulationDialog from "./bot-components/TradeSimulationDialog";

interface AITradingBotProps {
  userId?: string;
  userCredit?: number;
  onTradeExecuted?: () => void;
}

const AITradingBot = ({ userId, userCredit = 0, onTradeExecuted }: AITradingBotProps) => {
  const { 
    settings, 
    status, 
    updateBotSettings,
    executeSingleTrade,
    completeTradeAfterSimulation,
    isSimulating,
    setIsSimulating,
    rankTiers
  } = useAITradingBot(userId, userCredit, onTradeExecuted);
  
  const { botTrades, loading: tradesLoading } = useTradeHistory(userId);
  const { cryptos } = useCryptos();
  const [simulationOpen, setSimulationOpen] = useState(false);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleManualTrade = async () => {
    const canStart = await executeSingleTrade();
    if (canStart) {
      setSimulationOpen(true);
    }
  };
  
  const handleSimulationComplete = async (success: boolean) => {
    if (success) {
      await completeTradeAfterSimulation();
    }
    setSimulationOpen(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <ZapIcon className="mr-2 h-5 w-5 text-yellow-400" />
              KI-Trading Bot
            </CardTitle>
            <CardDescription>Automatisierte Trades mit KI-Optimierung</CardDescription>
          </div>
          <BotControlsHeader 
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
            isActive={false}
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
            isActive={false}
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
      
      {/* Trade Simulation Dialog */}
      <TradeSimulationDialog
        open={simulationOpen}
        onOpenChange={setSimulationOpen}
        onComplete={handleSimulationComplete}
        cryptoData={cryptos || []}
      />
    </Card>
  );
};

export default AITradingBot;
