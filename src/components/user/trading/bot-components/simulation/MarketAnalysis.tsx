
import React from 'react';
import CryptoComparison, { CryptoComparisonProps } from './CryptoComparison';
import { ScrollArea } from "@/components/ui/scroll-area";

interface MarketAnalysisProps {
  comparisons: CryptoComparisonProps[];
}

const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ comparisons }) => {
  return (
    <div className="border border-gold/10 rounded-md overflow-hidden bg-casino-darker/80">
      <div className="p-3 border-b border-gold/10 bg-casino-dark/40">
        <h3 className="text-sm font-semibold text-gold/80">Marktanalyse</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Echtzeit-Kryptowährungsdaten</p>
      </div>
      
      <div className="h-[160px]">
        <ScrollArea className="h-full">
          <div className="p-1">
            {comparisons.length === 0 && (
              <div className="text-center p-4 text-sm text-muted-foreground">
                Lade Marktdaten...
              </div>
            )}
            
            {comparisons.map((comparison, index) => (
              <CryptoComparison 
                key={`${comparison.symbol}-${index}`} 
                symbol={comparison.symbol}
                name={comparison.name}
                price={comparison.price}
                change={comparison.change}
                logoUrl={comparison.logoUrl}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MarketAnalysis;
