
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ZapIcon } from "lucide-react";
import { useAITradingBot } from "@/hooks/useAITradingBot";
import { useTradeHistory } from "@/hooks/useTradeHistory";
import { useCryptos } from "@/hooks/useCryptos";
import { useState, useCallback, useEffect, useRef } from "react";
import RankDisplay from "./RankDisplay";
import BotStatusOverview from "./bot-components/BotStatusOverview";
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
  const [simulationOpen, setSimulationOpen] = useState(false);
  
  // Use a ref to track dialog closing to prevent race conditions
  const dialogClosingRef = useRef(false);
  
  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Handle manual trade button click
  const handleManualTrade = useCallback(async () => {
    console.log("Manual trade button clicked");
    const canStart = await executeSingleTrade();
    
    if (canStart) {
      console.log("Starting simulation dialog");
      setSimulationOpen(true);
      // Reset the dialog closing state
      dialogClosingRef.current = false;
    }
  }, [executeSingleTrade]);
  
  // Handle simulation completion
  const handleSimulationComplete = useCallback(async (success: boolean) => {
    console.log("Simulation completed, success:", success);
    
    // Prevent multiple completions
    if (dialogClosingRef.current) {
      console.log("Dialog already closing, ignoring completion");
      return;
    }
    
    // Mark dialog as closing
    dialogClosingRef.current = true;
    
    if (success) {
      // Complete the trade with a slight delay to ensure dialog animation completes
      setTimeout(async () => {
        await completeTradeAfterSimulation();
        setSimulationOpen(false);
      }, 500);
    } else {
      setSimulationOpen(false);
    }
  }, [completeTradeAfterSimulation]);

  // Toggle bot activation
  const handleBotToggle = useCallback(() => {
    if (status.isActive) {
      stopBot();
    } else {
      startBot();
    }
  }, [status.isActive, startBot, stopBot]);

  // Handle dialog open state changes
  const handleDialogOpenChange = useCallback((open: boolean) => {
    console.log("Dialog open state changed to:", open);
    
    if (!open && (isSimulating || simulationInProgressRef.current)) {
      // Dialog closed manually during simulation
      console.log("Dialog closed manually while simulating");
      dialogClosingRef.current = true;
      setIsSimulating(false);
    }
    
    setSimulationOpen(open);
  }, [isSimulating, setIsSimulating, simulationInProgressRef]);
  
  // Ensure simulation is properly closed if component unmounts
  useEffect(() => {
    return () => {
      if (isSimulating || simulationInProgressRef.current) {
        console.log("Component unmounting, cleaning up simulation");
        setIsSimulating(false);
      }
    };
  }, [isSimulating, setIsSimulating, simulationInProgressRef]);

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
            isActive={status.isActive}
            onBotToggle={handleBotToggle}
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
            isActive={status.isActive}
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
      </CardContent>
      
      {/* Trade Simulation Dialog */}
      {cryptos && cryptos.length > 0 && (
        <TradeSimulationDialog
          open={simulationOpen}
          onOpenChange={handleDialogOpenChange}
          onComplete={handleSimulationComplete}
          cryptoData={cryptos}
        />
      )}
    </Card>
  );
};

export default AITradingBot;
