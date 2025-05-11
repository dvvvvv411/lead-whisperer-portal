
import React from 'react';
import { RankTier } from '@/hooks/ai-bot/types';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, ChevronUp, Star, Power } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RankDisplayProps {
  currentRank: number;
  maxTradesPerDay: number;
  tradesRemaining: number;
  dailyTradesExecuted: number;
  userCredit: number;
  rankTiers: RankTier[];
  onExecuteTrade?: () => void;
  userName?: string;
}

const RankDisplay = ({ 
  currentRank, 
  maxTradesPerDay, 
  tradesRemaining, 
  dailyTradesExecuted,
  userCredit,
  rankTiers,
  onExecuteTrade,
  userName
}: RankDisplayProps) => {
  // Find the current and next rank tier
  const currentTier = rankTiers.find(tier => tier.rankNumber === currentRank);
  const nextTier = rankTiers.find(tier => tier.rankNumber === currentRank + 1);
  
  // Calculate progress to next rank if there is one
  const progressToNextRank = nextTier 
    ? Math.min(100, Math.round((userCredit - currentTier!.minBalance) / 
      (nextTier.minBalance - currentTier!.minBalance) * 100))
    : 100;
  
  // Get rank badge color
  const getRankBadgeBg = (rank: number) => {
    switch(rank) {
      case 1: return "bg-gradient-to-br from-amber-700 to-amber-500"; // Bronze
      case 2: return "bg-gradient-to-br from-slate-400 to-slate-300"; // Silver
      case 3: return "bg-gradient-to-br from-yellow-500 to-amber-300"; // Gold
      case 4: return "bg-gradient-to-br from-blue-600 to-cyan-400"; // Platinum
      case 5: return "bg-gradient-to-br from-violet-600 to-fuchsia-400"; // Diamond
      default: return "bg-slate-700";
    }
  };

  const getRankGlow = (rank: number) => {
    switch(rank) {
      case 1: return "shadow-amber-700/30"; // Bronze
      case 2: return "shadow-slate-400/30"; // Silver
      case 3: return "shadow-yellow-500/40"; // Gold
      case 4: return "shadow-blue-600/40"; // Platinum
      case 5: return "shadow-violet-600/50"; // Diamond
      default: return "shadow-slate-700/30";
    }
  };

  const getRankName = (rank: number) => {
    switch(rank) {
      case 1: return "Bronze";
      case 2: return "Silber";
      case 3: return "Gold";
      case 4: return "Platin";
      case 5: return "Diamant";
      default: return "Anfänger";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-gold" />
          <h3 className="font-medium">Trading-Rang</h3>
        </div>
      </div>
      
      <Card className="bg-gradient-to-br from-casino-dark/80 to-casino-card/90 backdrop-blur-xl border border-gold/20 p-4 relative overflow-hidden shadow-lg">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmMTAiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-10"></div>
        
        {/* Glow effects */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gold/5 blur-3xl animate-glow-pulse"></div>
        <div className="absolute -bottom-40 -left-20 w-60 h-60 rounded-full bg-accent1/5 blur-3xl animate-glow-pulse"></div>
        
        {/* Content layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Rank info - Left Column */}
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center mb-4">
              <span className="text-sm text-muted-foreground">Aktueller Rang</span>
              <div className="flex items-center gap-2 mt-1">
                <Trophy 
                  className={cn(
                    "h-7 w-7",
                    currentRank >= 3 ? "text-yellow-400" : currentRank === 2 ? "text-slate-300" : "text-amber-600", 
                    "drop-shadow-md animate-pulse"
                  )}
                />
                <span className={cn(
                  "text-2xl font-bold",
                  currentRank >= 3 ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500" : 
                  currentRank === 2 ? "text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-gray-400" : 
                  "text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400"
                )}>
                  {getRankName(currentRank)}
                </span>
              </div>
            </div>
            
            {/* Account balance */}
            <div className="mb-4 text-center">
              <span className="text-sm text-muted-foreground">Kontoguthaben</span>
              <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light">
                {userCredit.toLocaleString('de-DE')} €
              </div>
            </div>
            
            {/* Next rank progress */}
            {nextTier && (
              <div className="mb-1 relative z-10 w-full max-w-[210px]">
                <div className="flex justify-between mb-1">
                  <div className="text-sm font-medium flex items-center gap-2">
                    <Star className="h-4 w-4 text-gold-light" />
                    <span>{currentTier?.label}</span>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <span>Nächster Rang: {nextTier.label} ({nextTier.minBalance}€)</span> 
                    <ChevronUp className="ml-1 h-4 w-4" />
                  </div>
                </div>
                <Progress 
                  value={progressToNextRank} 
                  className="h-1.5 bg-casino-darker" 
                  indicatorClassName="bg-gradient-to-r from-accent1/70 to-accent1"
                />
                <div className="flex justify-between mt-1">
                  <div className="text-xs text-muted-foreground">
                    {currentTier?.minBalance}€
                  </div>
                  <div className="text-xs text-accent1">
                    {progressToNextRank}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {nextTier.minBalance}€
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Welcome message and CTA - Middle section */}
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <div className="text-center space-y-4 py-2">
              {/* Updated welcome message to be more general */}
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light animate-fade-in">
                Willkommen zurück im Dashboard!
              </h3>
              
              {/* Instruction text split into two lines */}
              <div className="text-sm text-muted-foreground max-w-[220px] mx-auto">
                <p>Starten Sie den KI-Bot für</p>
                <p>intelligente Trading-Entscheidungen</p>
              </div>
            </div>
          </div>
          
          {/* Power button and trade execution */}
          <div className="flex flex-col items-center justify-center">
            {/* Power Button with Trading Execution */}
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
            
            {/* Trades counter */}
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
          </div>
        </div>
      </Card>
      <style>
        {`
          @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default RankDisplay;
