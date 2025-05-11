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
import TradeResultDialog from "./bot-components/TradeResultDialog";

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
  
  // State for trade result dialog
  const [tradeResult, setTradeResult] = useState({
    cryptoSymbol: "",
    cryptoName: "",
    profitAmount: 0,
    profitPercentage: 0,
    tradeAmount: 0,
    buyPrice: 0,
    sellPrice: 0,
    quantity: 0,
    tradeDate: new Date()
  });
  
  // Use a ref to track dialog closing to prevent race conditions
  const dialogClosingRef = useRef(false);
  
  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Set bot as active during simulation
  useEffect(() => {
    if (simulationOpen) {
      startBot();
    } else if (!simulationOpen && !simulationInProgressRef.current) {
      stopBot();
    }
  }, [simulationOpen, startBot, stopBot, simulationInProgressRef]);

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
  
  // Handle simulation completion with updated trade result details
  const handleSimulationComplete = useCallback(async (success: boolean, selectedCrypto?: any) => {
    console.log("Simulation completed, success:", success, "selected crypto:", selectedCrypto);
    
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
        // Close simulation dialog first
        setSimulationOpen(false);
        
        // Execute the trade and get results
        const tradeResult = await completeTradeAfterSimulation();
        
        if (tradeResult && typeof tradeResult === 'object' && 'success' in tradeResult && tradeResult.success) {
          // Prepare data for result dialog with new detailed information
          setTradeResult({
            cryptoSymbol: tradeResult.crypto?.symbol || selectedCrypto?.symbol || "BTC",
            cryptoName: tradeResult.crypto?.name || selectedCrypto?.name || "Bitcoin",
            profitAmount: tradeResult.profit || 0,
            profitPercentage: tradeResult.profitPercentage || 0,
            tradeAmount: tradeResult.tradeAmount || 0,
            buyPrice: tradeResult.buyPrice || 0,
            sellPrice: tradeResult.sellPrice || 0,
            quantity: tradeResult.quantity || 0,
            tradeDate: new Date()
          });
          
          // Show result dialog
          setResultDialogOpen(true);
        }
      }, 500);
    } else {
      setSimulationOpen(false);
    }
  }, [completeTradeAfterSimulation]);

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
  
  // Handle closing the result dialog
  const handleResultDialogClose = useCallback(() => {
    setResultDialogOpen(false);
  }, []);
  
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
      
      {/* Trade Result Dialog */}
      <TradeResultDialog
        open={resultDialogOpen}
        onClose={handleResultDialogClose}
        cryptoSymbol={tradeResult.cryptoSymbol}
        cryptoName={tradeResult.cryptoName}
        profitAmount={tradeResult.profitAmount}
        profitPercentage={tradeResult.profitPercentage}
        tradeAmount={tradeResult.tradeAmount}
        buyPrice={tradeResult.buyPrice}
        sellPrice={tradeResult.sellPrice}
        quantity={tradeResult.quantity}
        tradeDate={tradeResult.tradeDate}
      />
    </Card>
  );
};

export default AITradingBot;
