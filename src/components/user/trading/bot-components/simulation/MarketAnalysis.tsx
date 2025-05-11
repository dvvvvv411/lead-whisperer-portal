
import React from 'react';
import CryptoComparison, { CryptoComparisonProps } from "./CryptoComparison";
import { Bitcoin } from "lucide-react";

interface MarketAnalysisProps {
  comparisons: CryptoComparisonProps[];
}

const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ comparisons }) => {
  return (
    <div className="bg-casino-darker/60 backdrop-blur-sm border border-gold/10 rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-casino-darker to-casino-dark px-3 py-2 border-b border-gold/10">
        <div className="flex justify-between items-center">
          <div className="text-xs font-semibold text-accent1 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-accent1"></div>
            Markt-Analyse
          </div>
          
          <div className="flex items-center">
            <Bitcoin className="h-3.5 w-3.5 text-gold" />
          </div>
        </div>
      </div>
      
      <div className="p-0.5 max-h-[180px] overflow-y-auto">
        {comparisons.length > 0 ? (
          comparisons.map((comp, idx) => (
            <CryptoComparison key={`comp-${idx}`} {...comp} />
          ))
        ) : (
          <div className="text-xs text-muted-foreground p-3 text-center">Warte auf Marktdaten...</div>
        )}
      </div>
    </div>
  );
};

export default MarketAnalysis;
