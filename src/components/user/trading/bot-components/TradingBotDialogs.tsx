
import { useRef } from "react";
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
}

const TradingBotDialogs = ({
  simulationOpen,
  resultDialogOpen,
  cryptos,
  tradeResult,
  handleDialogOpenChange,
  handleSimulationComplete,
  handleResultDialogClose
}: TradingBotDialogsProps) => {
  console.log("TradingBotDialogs rendering with resultDialogOpen:", resultDialogOpen);
  
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
      
      {/* Trade Result Dialog - Adding debug logs */}
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
    </>
  );
};

export default TradingBotDialogs;
