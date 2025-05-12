
import React from 'react';

interface TradeCounterProps {
  tradesRemaining: number;
  maxTradesPerDay: number;
  dailyTradesExecuted: number;
}

const TradeCounter = ({ tradesRemaining, maxTradesPerDay, dailyTradesExecuted }: TradeCounterProps) => {
  return (
    <div className="mt-3 text-center">
      <div className="text-sm text-muted-foreground flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-gold animate-pulse mr-2"></div>
        <span className="font-medium text-gold">{tradesRemaining}</span>
        <span className="text-muted-foreground ml-1">/{maxTradesPerDay}</span>
        <span className="text-muted-foreground ml-1">Trades</span>
      </div>
      
      {/* Trades progress bar */}
      <div className="w-full h-1.5 bg-casino-darker rounded-full overflow-hidden mt-1">
        <div 
          className="h-full bg-gradient-to-r from-gold/70 to-gold rounded-full"
          style={{ width: `${(dailyTradesExecuted / maxTradesPerDay) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default TradeCounter;
