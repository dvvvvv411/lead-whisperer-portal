
import React from 'react';
import { cn } from "@/lib/utils";
import { Power } from "lucide-react";

interface TradeExecutionButtonProps {
  tradesRemaining: number;
  onExecuteTrade?: () => void;
}

const TradeExecutionButton = ({ tradesRemaining, onExecuteTrade }: TradeExecutionButtonProps) => {
  return (
    <button
      onClick={onExecuteTrade}
      disabled={tradesRemaining <= 0}
      className={cn(
        "relative w-20 h-20 rounded-full flex items-center justify-center",
        "overflow-hidden group cursor-pointer",
        "border border-gold/30 shadow-lg",
        "bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md",
        tradesRemaining <= 0 && "opacity-50 cursor-not-allowed"
      )}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-gold/5 rounded-full"></div>
      
      {/* Power button icon */}
      <div className={cn(
        "absolute inset-1 rounded-full",
        "bg-gradient-to-br from-gold/20 to-gold/10",
        "flex items-center justify-center",
        "transform transition-all duration-500",
        "group-hover:from-gold/30 group-hover:to-gold/20",
        "group-active:scale-95"
      )}>
        <Power className={cn(
          "h-8 w-8 text-gold",
          "filter drop-shadow-lg",
          "animate-pulse",
          "transform transition-transform duration-300",
          "group-hover:scale-110"
        )} />
      </div>
      
      {/* Outer ring animation */}
      <div className={cn(
        "absolute inset-0 rounded-full",
        "border-2 border-gold/30",
        "animate-pulse-gold"
      )}></div>
      
      {/* Circular ripple effect on hover */}
      <div className={cn(
        "absolute inset-0 rounded-full",
        "bg-gold/5 scale-0 opacity-0",
        "group-hover:scale-100 group-hover:opacity-100",
        "transition-all duration-700 ease-out"
      )}></div>
    </button>
  );
};

export default TradeExecutionButton;
