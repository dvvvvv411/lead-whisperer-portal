
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
    <div className={cn(
      "w-full rounded-xl overflow-hidden border border-gold/10 bg-gradient-to-br from-casino-darker to-casino-card/90 shadow-xl", 
      "backdrop-blur-xl relative",
      className
    )}>
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmMTAiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-10"></div>
      
      {/* Glow effects */}
      <div className="absolute top-0 -right-40 w-80 h-80 bg-accent1/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-40 w-80 h-80 bg-gold/5 rounded-full blur-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <TradingBotHeader 
          tradesRemaining={status.tradesRemaining}
        />
        <div className="p-4 pt-6">
          <TradingBotContent
            status={status}
            userCredit={userCredit}
            rankTiers={rankTiers}
            simulationOpen={simulationOpen}
            botTrades={botTrades}
            tradesLoading={tradesLoading}
            formatCurrency={formatCurrency}
            onManualTrade={handleManualTrade}
          />
        </div>
      </div>
      
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
