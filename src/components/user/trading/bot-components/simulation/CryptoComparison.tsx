
import React from 'react';
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export interface CryptoComparisonProps {
  symbol: string;
  name?: string;
  price: number;
  change: number;
  logoUrl?: string;
}

const CryptoComparison = ({ symbol, name, price, change, logoUrl }: CryptoComparisonProps) => {
  // Generate miniature chart for visualization
  const generateMiniChart = () => {
    const points = 5;
    const height = 20;
    const width = 40;
    const uptrend = change > 0;
    
    const values = Array.from({ length: points }, (_, i) => {
      const progress = i / (points - 1);
      // Generate a semi-random path with overall trend matching change direction
      const randomFactor = Math.random() * 0.4 - 0.2; // -0.2 to 0.2
      const trendFactor = uptrend ? progress : 1 - progress;
      const value = height * (0.2 + 0.6 * trendFactor + randomFactor);
      return value;
    });
    
    // Create SVG path
    const pathPoints = values.map((value, i) => {
      const x = (i / (points - 1)) * width;
      return `${x},${height - value}`;
    });
    
    const pathD = `M${pathPoints.join(" L")}`;
    
    return (
      <svg width={width} height={height} className="opacity-60">
        <path 
          d={pathD} 
          fill="none" 
          stroke={uptrend ? "#22c55e" : "#ef4444"} 
          strokeWidth="1.5" 
        />
      </svg>
    );
  };

  // Get cryptocurrency logo URL based on the symbol
  const getCryptoLogoUrl = (symbol: string): string => {
    const normalizedSymbol = symbol.toLowerCase();
    return `https://cryptologos.cc/logos/${normalizedSymbol}-${normalizedSymbol}-logo.png`;
  };
  
  return (
    <div className="flex items-center justify-between py-2.5 px-3 border-b border-gold/5 transition-all duration-200 hover:bg-casino-highlight/10 animate-fade-in">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 rounded-md overflow-hidden bg-gradient-to-br from-casino-card to-casino-darker border border-gold/10">
          <AvatarImage 
            src={logoUrl || getCryptoLogoUrl(symbol)} 
            alt={symbol}
            className="object-contain p-1" 
          />
          <AvatarFallback className="bg-gradient-to-br from-casino-card to-casino-darker text-xs font-mono">
            {symbol}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-medium">{name || symbol}</div>
          <div className="text-sm font-medium">{price.toFixed(2)} €</div>
          <div className={cn(
            "text-xs",
            change > 0 ? "text-green-500" : "text-red-500"
          )}>
            {change > 0 ? "+" : ""}{change.toFixed(2)}%
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Mini chart visualization */}
        <div className="hidden md:block">
          {generateMiniChart()}
        </div>
        
        {/* Trend indicator */}
        <div className={cn(
          "flex items-center justify-center w-6 h-6 rounded-full",
          change > 0 ? "bg-green-500/10" : "bg-red-500/10"
        )}>
          {change > 0 ? (
            <TrendingUpIcon className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <TrendingDownIcon className="h-3.5 w-3.5 text-red-500" />
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoComparison;
