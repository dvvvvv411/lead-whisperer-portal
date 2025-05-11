
import React from 'react';
import { RankTier } from '@/hooks/ai-bot/types';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, ChevronUp, Star, Award, Zap, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RankDisplayProps {
  currentRank: number;
  maxTradesPerDay: number;
  tradesRemaining: number;
  dailyTradesExecuted: number;
  userCredit: number;
  rankTiers: RankTier[];
}

const RankDisplay = ({ 
  currentRank, 
  maxTradesPerDay, 
  tradesRemaining, 
  dailyTradesExecuted,
  userCredit,
  rankTiers
}: RankDisplayProps) => {
  // Find the current and next rank tier
  const currentTier = rankTiers.find(tier => tier.rankNumber === currentRank);
  const nextTier = rankTiers.find(tier => tier.rankNumber === currentRank + 1);
  
  // Calculate progress to next rank if there is one
  const progressToNextRank = nextTier 
    ? Math.min(100, Math.round((userCredit - currentTier!.minBalance) / 
      (nextTier.minBalance - currentTier!.minBalance) * 100))
    : 100;
  
  // Get rank name
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
        
        {/* Bot and Rank Display - New Unified Design */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Gold circular background with gradient */}
            <div className={cn(
              "flex items-center justify-center w-32 h-32 rounded-full shadow-lg transition-all duration-500",
              "bg-gradient-to-br from-gold/80 via-gold-light to-amber-400",
              "shadow-[0_0_40px_rgba(255,215,0,0.4)]",
            )}>
              {/* Hexagonal grid pattern overlay */}
              <div className="absolute inset-0 rounded-full overflow-hidden opacity-20">
                <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iaGV4YWdvbiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjM0LjY0IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoMzApIj48cGF0aCBkPSJNMCwwIGwxMCwwIGw1LDguNjYgbC01LDguNjYgbC0xMCwwIGwtNSwtOC42NiB6IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2hleGFnb24pIiAvPjwvc3ZnPg==')]"></div>
              </div>
              
              {/* Bot Icon in center */}
              <div className="relative flex flex-col items-center justify-center">
                <Bot className="h-14 w-14 text-gold-foreground drop-shadow-lg z-10" />
                
                {/* Rank number overlay */}
                <div className="absolute -bottom-1 -right-7 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-casino-dark to-casino-card border-2 border-gold shadow-lg">
                  <span className="text-xl font-bold text-gold">{currentRank}</span>
                </div>
                
                {/* Rank name */}
                <div className="mt-2 text-center">
                  <span className={cn(
                    "text-lg font-bold text-gold-foreground drop-shadow-md",
                    currentRank === 5 && "animate-pulse"
                  )}>
                    {getRankName(currentRank)}
                  </span>
                </div>
              </div>
              
              {/* Animated pulse rings */}
              <div className="absolute inset-0 w-full h-full rounded-full border-4 border-gold/20 animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-0 w-full h-full rounded-full border-2 border-gold/10 animate-ping" style={{ animationDuration: '2s' }}></div>
            </div>
            
            {/* Circulating dots representing trading simulation */}
            <div className="absolute inset-0 w-full h-full">
              <div className="absolute top-0 left-[50%] w-2 h-2 rounded-full bg-white/60 animate-spin" style={{ animationDuration: '8s', transformOrigin: '0 16rem' }}></div>
              <div className="absolute top-0 left-[50%] w-1.5 h-1.5 rounded-full bg-white/40 animate-spin" style={{ animationDuration: '12s', animationDelay: '0.5s', transformOrigin: '0 16rem' }}></div>
              <div className="absolute top-0 left-[50%] w-1 h-1 rounded-full bg-white/30 animate-spin" style={{ animationDuration: '15s', animationDelay: '1s', transformOrigin: '0 16rem' }}></div>
            </div>
          </div>
        </div>
        
        {/* Compact trades limit display */}
        <div className="mb-4 p-3 bg-casino-darker/50 backdrop-blur-md rounded-lg border border-gold/10 relative z-10 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium">Tägliche Trades</span>
            </div>
            <div className="flex items-center gap-1 bg-gold/10 px-2 py-1 rounded-full text-xs font-medium">
              <span className="text-gold-light">{tradesRemaining}</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-400">{maxTradesPerDay}</span>
            </div>
          </div>
          
          <Progress 
            value={(dailyTradesExecuted / maxTradesPerDay) * 100} 
            className="h-2 bg-casino-darker"
            indicatorClassName="bg-gradient-to-r from-gold/70 to-gold"
          />
        </div>
        
        {/* Next rank progress */}
        {nextTier && (
          <div className="mb-1 relative z-10">
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
