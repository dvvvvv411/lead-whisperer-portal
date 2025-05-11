
import RankDisplay from "../RankDisplay";
import BotStatusOverview from "./BotStatusOverview";
import BotPerformance from "./BotPerformance";
import BotInfoCard from "./BotInfoCard";
import { RankTier } from "@/hooks/ai-bot/types";

interface TradingBotContentProps {
  status: {
    isActive: boolean;
    totalProfitAmount: number;
    totalProfitPercentage: number;
    tradesExecuted: number;
    dailyTradesExecuted: number;
    lastTradeTime: Date | null;
    currentRank: number;
    maxTradesPerDay: number;
    tradesRemaining: number;
  };
  userCredit: number;
  rankTiers: RankTier[];
  simulationOpen: boolean;
  botTrades: any[];
  tradesLoading: boolean;
  formatCurrency: (amount: number) => string;
}

const TradingBotContent = ({
  status,
  userCredit,
  rankTiers,
  simulationOpen,
  botTrades,
  tradesLoading,
  formatCurrency
}: TradingBotContentProps) => {
  return (
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
        isActive={status.isActive || simulationOpen}
        totalProfitAmount={status.totalProfitAmount}
        totalProfitPercentage={status.totalProfitPercentage}
        tradesExecuted={status.tradesExecuted}
        dailyTradesExecuted={status.dailyTradesExecuted}
        lastTradeTime={status.lastTradeTime}
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
  );
};

export default TradingBotContent;
