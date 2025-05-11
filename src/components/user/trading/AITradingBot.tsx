
import { Card, CardContent } from "@/components/ui/card";
import { useAITradingBot } from "@/hooks/useAITradingBot";
import { useTradeHistory } from "@/hooks/useTradeHistory";
import { useCryptos } from "@/hooks/useCryptos";
import { useTradingBotSimulation } from "@/hooks/useTradingBotSimulation";
import TradingBotHeader from "./bot-components/TradingBotHeader";
import TradingBotContent from "./bot-components/TradingBotContent";
import TradingBotDialogs from "./bot-components/TradingBotDialogs";
import { cn } from "@/lib/utils";

interface AITradingBotProps {
  userId?: string;
  userCredit?: number;
  onTradeExecuted?: () => void;
  className?: string;
}

const AITradingBot = ({ userId, userCredit = 0, onTradeExecuted, className }: AITradingBotProps) => {
  const { 
    settings, 
    status, 
    startBot,
    stopBot,
    executeSingleTrade,
    completeTradeAfterSimulation,
    isSimulating,
    setIsSimulating,
    simulationInProgressRef,
    rankTiers
  } = useAITradingBot(userId, userCredit, onTradeExecuted);
  
  const { botTrades, loading: tradesLoading } = useTradeHistory(userId);
  const { cryptos } = useCryptos();
  
  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  // Use our custom hook for simulation logic
  const {
    simulationOpen,
    resultDialogOpen,
    tradeResult,
    handleManualTrade,
    handleSimulationComplete,
    handleDialogOpenChange,
    handleResultDialogClose
  } = useTradingBotSimulation(
    startBot,
    stopBot,
    executeSingleTrade,
    completeTradeAfterSimulation,
    isSimulating,
    setIsSimulating,
    simulationInProgressRef
  );

  return (
    <div className={cn("w-full", className)}>
      <TradingBotHeader 
        onManualTrade={handleManualTrade}
        tradesRemaining={status.tradesRemaining}
      />
      <CardContent className="p-4 pt-6">
        <TradingBotContent
          status={status}
          userCredit={userCredit}
          rankTiers={rankTiers}
          simulationOpen={simulationOpen}
          botTrades={botTrades}
          tradesLoading={tradesLoading}
          formatCurrency={formatCurrency}
        />
      </CardContent>
      
      <TradingBotDialogs
        simulationOpen={simulationOpen}
        resultDialogOpen={resultDialogOpen}
        cryptos={cryptos || []}
        tradeResult={tradeResult}
        handleDialogOpenChange={handleDialogOpenChange}
        handleSimulationComplete={handleSimulationComplete}
        handleResultDialogClose={handleResultDialogClose}
      />
    </div>
  );
};

export default AITradingBot;
