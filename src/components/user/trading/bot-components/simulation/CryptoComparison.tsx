
import React from 'react';
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

export interface CryptoComparisonProps {
  symbol: string;
  price: number;
  change: number;
}

const CryptoComparison = ({ symbol, price, change }: CryptoComparisonProps) => {
  return (
    <div className="flex items-center justify-between py-2 border-b border-dashed border-slate-200 animate-fade-in">
      <div className="flex items-center gap-2">
        <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs">{symbol}</span>
        <span className="text-sm font-medium">{price.toFixed(2)} €</span>
      </div>
      <div className="flex items-center">
        {change > 0 ? (
          <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <TrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span className={`text-xs ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change.toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

export default CryptoComparison;
