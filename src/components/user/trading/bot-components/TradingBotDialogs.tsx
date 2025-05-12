
import { useRef, useEffect } from "react";
import TradeSimulationDialog from "./TradeSimulationDialog";
import TradeResultDialog from "./TradeResultDialog";

interface TradingBotDialogsProps {
  simulationOpen: boolean;
  resultDialogOpen: boolean;
  cryptos: any[];
  tradeResult: {
    cryptoSymbol: string;
    cryptoName: string;
    profitAmount: number;
    profitPercentage: number;
    tradeAmount: number;
    buyPrice: number;
    sellPrice: number;
    quantity: number;
    tradeDate: Date;
  };
  handleDialogOpenChange: (open: boolean) => void;
  handleSimulationComplete: (success: boolean, selectedCrypto?: any) => void;
  handleResultDialogClose: () => void;
  onTradeExecuted?: () => void;
}

const TradingBotDialogs = ({
  simulationOpen,
  resultDialogOpen,
  cryptos,
  tradeResult,
  handleDialogOpenChange,
  handleSimulationComplete,
  handleResultDialogClose,
  onTradeExecuted
}: TradingBotDialogsProps) => {
  console.log("TradingBotDialogs rendering with resultDialogOpen:", resultDialogOpen);
  console.log("Trade result data:", tradeResult);
  
  // Track when result dialog has been displayed and closed
  const resultDialogWasOpen = useRef(false);
  
  // Call onTradeExecuted only when dialog is closed after being open
  useEffect(() => {
    if (resultDialogOpen) {
      resultDialogWasOpen.current = true;
    } else if (resultDialogWasOpen.current) {
      // Dialog was open but now is closed
      resultDialogWasOpen.current = false;
      
      // Call onTradeExecuted to update balance and refresh data
      if (onTradeExecuted) {
        console.log("Result dialog was closed, calling onTradeExecuted");
        onTradeExecuted();
      }
    }
  }, [resultDialogOpen, onTradeExecuted]);
  
  // Custom result dialog close handler that ensures onTradeExecuted gets called
  const handleResultClose = () => {
    console.log("Handling result dialog close");
    handleResultDialogClose();
    
    // The effect above will call onTradeExecuted when resultDialogOpen changes to false
  };
  
  return (
    <>
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
        onClose={handleResultClose}
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
    </>
  );
};

export default TradingBotDialogs;
