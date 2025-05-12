
import RankDisplay from "./RankDisplay";
import BotStatusOverview from "./bot-components/BotStatusOverview";
import BotPerformance from "./bot-components/BotPerformance";
import BotInfoCard from "./bot-components/BotInfoCard";
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
  onManualTrade?: () => void;
  userName?: string;
}

const TradingBotContent = ({
  status,
  userCredit,
  rankTiers,
  simulationOpen,
  botTrades,
  tradesLoading,
  formatCurrency,
  onManualTrade,
  userName
}: TradingBotContentProps) => {
  // Calculate daily profit statistics
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter trades that happened today
  const todayBotTrades = botTrades.filter(trade => {
    const tradeDate = new Date(trade.created_at);
    return tradeDate >= today;
  });

  // Calculate daily profit amount and percentage
  let dailyProfitAmount = 0;
  let dailyProfitPercentage = 0;

  // Process today's trades to calculate profits
  if (todayBotTrades.length > 0) {
    // Group by buy/sell pairs to calculate profit
    const buyTrades = todayBotTrades.filter(t => t.type === 'buy');
    const sellTrades = todayBotTrades.filter(t => t.type === 'sell');
    
    // Match buy and sell trades for the same crypto to calculate profit
    sellTrades.forEach(sellTrade => {
      const matchingBuyTrade = buyTrades.find(
        b => b.crypto_asset_id === sellTrade.crypto_asset_id && 
             new Date(b.created_at) < new Date(sellTrade.created_at)
      );
      
      if (matchingBuyTrade) {
        // Calculate profit for this pair
        const buyAmount = matchingBuyTrade.total_amount;
        const sellAmount = sellTrade.total_amount;
        const profit = sellAmount - buyAmount;
        
        // Add to daily totals
        dailyProfitAmount += profit;
        
        // Calculate percentage profit for this trade and add to total
        if (buyAmount > 0) {
          const percentageForTrade = (profit / buyAmount) * 100;
          dailyProfitPercentage += percentageForTrade;
        }
      }
    });
    
    // If we found matching trades, average the percentage
    if (sellTrades.length > 0) {
      dailyProfitPercentage = dailyProfitPercentage / sellTrades.length;
    }
  }

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
        onExecuteTrade={onManualTrade}
      />

      {/* Bot Status Overview with daily stats */}
      <BotStatusOverview
        isActive={status.isActive || simulationOpen}
        totalProfitAmount={dailyProfitAmount} // Changed to daily profit
        totalProfitPercentage={dailyProfitPercentage} // Changed to daily percentage
        tradesExecuted={status.tradesExecuted}
        dailyTradesExecuted={status.dailyTradesExecuted}
        lastTradeTime={status.lastTradeTime}
        formatCurrency={formatCurrency}
      />
      
      {/* Bot Performance with Trade Cards */}
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
