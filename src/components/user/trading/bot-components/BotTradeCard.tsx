
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, ArrowRight } from "lucide-react";
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
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy HH:mm', { locale: de });
  };

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

  return (
    <div className="bg-casino-darker border border-gold/10 rounded-lg overflow-hidden hover:border-gold/30 transition-all duration-300 h-full flex flex-col">
      {/* Card Header */}
      <div className="bg-casino-dark/60 p-3 border-b border-gold/10 flex items-center justify-between">
        <div className="flex items-center">
          {buyTrade.crypto_asset?.image_url && (
            <div className="h-8 w-8 rounded-full overflow-hidden border border-gold/20 mr-3 p-1 bg-casino-card flex items-center justify-center">
              <img 
                src={buyTrade.crypto_asset.image_url} 
                alt={buyTrade.crypto_asset.symbol} 
                className="h-5 w-5"
              />
            </div>
          )}
          <div>
            <div className="font-bold text-sm">{buyTrade.crypto_asset?.symbol?.toUpperCase()}</div>
            <div className="text-xs text-muted-foreground">{buyTrade.crypto_asset?.name}</div>
          </div>
        </div>
        
        {profitData && (
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs",
              profitData.isProfit 
                ? "bg-green-500/20 text-green-400 border-green-500/30" 
                : "bg-red-500/20 text-red-400 border-red-500/30"
            )}
          >
            {profitData.isProfit ? '+' : ''}{profitData.percentage.toFixed(2)}%
          </Badge>
        )}
      </div>
      
      {/* Card Content */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Buy Trade */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <Badge 
              variant="default"
              className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30 flex items-center"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>KAUF</span>
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(buyTrade.created_at)}
            </div>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-muted-foreground">Preis:</span>
            <span className="text-gold">{formatCurrency(buyTrade.price)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Menge:</span>
            <span>{buyTrade.quantity.toFixed(6)}</span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span className="text-muted-foreground">Gesamt:</span>
            <span className="text-gold">{formatCurrency(buyTrade.total_amount)}</span>
          </div>
        </div>

        {/* Separator with arrow */}
        {sellTrade ? (
          <div className="flex items-center my-1">
            <div className="h-px bg-gold/10 flex-1"></div>
            <div className="mx-2">
              <ArrowRight className="h-4 w-4 text-gold/40" />
            </div>
            <div className="h-px bg-gold/10 flex-1"></div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-xs text-muted-foreground italic">Verkauf ausstehend</span>
          </div>
        )}

        {/* Sell Trade */}
        {sellTrade && (
          <div className="mt-1">
            <div className="flex justify-between items-center mb-1">
              <Badge 
                variant="secondary"
                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30 flex items-center"
              >
                <TrendingDown className="h-3 w-3 mr-1" />
                <span>VERKAUF</span>
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {formatDate(sellTrade.created_at)}
              </div>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">Preis:</span>
              <span className="text-gold">{formatCurrency(sellTrade.price)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Menge:</span>
              <span>{sellTrade.quantity.toFixed(6)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className="text-muted-foreground">Gesamt:</span>
              <span className="text-gold">{formatCurrency(sellTrade.total_amount)}</span>
            </div>
            
            {/* Profit/Loss */}
            {profitData && (
              <div className="flex justify-between text-sm font-medium mt-2 pt-2 border-t border-gold/10">
                <span className="text-muted-foreground">Gewinn/Verlust:</span>
                <span className={profitData.isProfit ? "text-green-400" : "text-red-400"}>
                  {profitData.isProfit ? '+' : ''}{formatCurrency(profitData.amount)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BotTradeCard;
