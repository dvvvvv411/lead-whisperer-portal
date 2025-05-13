
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TradeData {
  id: string;
  type: 'buy' | 'sell';
  crypto_asset: {
    symbol: string;
    name: string;
    image_url: string;
  };
  price: number;
  quantity: number;
  total_amount: number;
  created_at: string;
}

interface BotTradeCardProps {
  buyTrade: TradeData;
  sellTrade: TradeData | null;
  formatCurrency: (amount: number) => string;
}

const BotTradeCard: React.FC<BotTradeCardProps> = ({ buyTrade, sellTrade, formatCurrency }) => {
  // Calculate profit/loss if we have both buy and sell trades
  const calculateProfit = () => {
    if (!sellTrade) return { amount: 0, percentage: 0, isProfit: false };
    
    const profit = sellTrade.total_amount - buyTrade.total_amount;
    const percentage = (profit / buyTrade.total_amount) * 100;
    
    return {
      amount: profit,
      percentage,
      isProfit: profit > 0
    };
  };

  const profitData = sellTrade ? calculateProfit() : null;

  // Format date (short version)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy', { locale: de });
  };

  return (
    <div className="bg-casino-darker border border-gold/10 rounded-lg overflow-hidden hover:border-gold/30 transition-all duration-300">
      {/* Card Header */}
      <div className="bg-casino-dark/60 p-2 border-b border-gold/10 flex items-center justify-between">
        <div className="flex items-center">
          {buyTrade.crypto_asset?.image_url && (
            <div className="h-6 w-6 rounded-full overflow-hidden border border-gold/20 mr-2 bg-casino-card flex items-center justify-center">
              <img 
                src={buyTrade.crypto_asset.image_url} 
                alt={buyTrade.crypto_asset.symbol} 
                className="h-4 w-4"
              />
            </div>
          )}
          <div className="font-bold text-sm text-white">{buyTrade.crypto_asset?.symbol?.toUpperCase()}</div>
        </div>
        
        {profitData && (
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs px-1 py-0",
              profitData.isProfit 
                ? "bg-green-500/20 text-green-400 border-green-500/30" 
                : "bg-red-500/20 text-red-400 border-red-500/30"
            )}
          >
            {profitData.isProfit ? '+' : ''}{profitData.percentage.toFixed(1)}%
          </Badge>
        )}
      </div>
      
      {/* Card Content - Simplified */}
      <div className="p-2 flex-1 flex flex-col text-xs">
        {/* Buy Trade - Simplified */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-400" />
            <span className="text-white/90">{formatCurrency(buyTrade.total_amount)}</span>
          </div>
          <span className="text-xs text-gray-400">{formatDate(buyTrade.created_at)}</span>
        </div>

        {/* Separator with arrow */}
        {sellTrade ? (
          <div className="flex items-center my-1">
            <div className="h-px bg-gold/10 flex-1"></div>
            <div className="mx-1">
              <ArrowRight className="h-3 w-3 text-gold/40" />
            </div>
            <div className="h-px bg-gold/10 flex-1"></div>
          </div>
        ) : (
          <div className="h-px bg-gold/10 my-1"></div>
        )}

        {/* Sell Trade - Simplified */}
        {sellTrade ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-red-400" />
              <span className="text-white/90">{formatCurrency(sellTrade.total_amount)}</span>
            </div>
            <span className="text-xs text-gray-400">{formatDate(sellTrade.created_at)}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span className="text-xs text-gray-400 italic">Ausstehend</span>
          </div>
        )}
        
        {/* Profit/Loss - Only shown if there's data */}
        {profitData && (
          <div className={cn(
            "text-right text-xs font-medium mt-1 pt-1 border-t border-gold/10",
            profitData.isProfit ? "text-green-400" : "text-red-400"
          )}>
            {profitData.isProfit ? '+' : ''}{formatCurrency(profitData.amount)}
          </div>
        )}
      </div>
    </div>
  );
};

export default BotTradeCard;
