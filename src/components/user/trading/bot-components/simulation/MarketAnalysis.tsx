
import React from 'react';
import CryptoComparison, { CryptoComparisonProps } from "./CryptoComparison";

interface MarketAnalysisProps {
  comparisons: CryptoComparisonProps[];
}

const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ comparisons }) => {
  return (
    <div className="bg-slate-50 p-3 rounded-md">
      <div className="text-xs font-medium mb-2">Markt-Analyse</div>
      {comparisons.length > 0 ? (
        comparisons.map((comp, idx) => (
          <CryptoComparison key={`comp-${idx}`} {...comp} />
        ))
      ) : (
        <div className="text-xs text-muted-foreground py-2">Warte auf Daten...</div>
      )}
    </div>
  );
};

export default MarketAnalysis;
