
import React from 'react';
import { RankTier } from '@/hooks/ai-bot/types';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, ChevronUp, Star } from "lucide-react";
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
    
  // Get rank color based on rank number
  const getRankColor = (rank: number) => {
    switch(rank) {
      case 1: return "text-gray-400 bg-gray-800/50"; // Bronze
      case 2: return "text-gray-300 bg-gray-700/50"; // Silver
      case 3: return "text-gold bg-gold/10"; // Gold
      case 4: return "text-blue-300 bg-blue-800/50"; // Platinum
      case 5: return "text-accent1-light bg-accent1/20"; // Diamond
      default: return "text-gray-400 bg-gray-800/50";
    }
  };
  
  // Get rank badge background
  const getRankBadgeBg = (rank: number) => {
    switch(rank) {
      case 1: return "bg-gradient-to-r from-amber-700 to-amber-600"; // Bronze
      case 2: return "bg-gradient-to-r from-gray-400 to-gray-300"; // Silver
      case 3: return "bg-gradient-to-r from-gold-dark to-gold"; // Gold
      case 4: return "bg-gradient-to-r from-blue-600 to-blue-400"; // Platinum
      case 5: return "bg-gradient-to-r from-accent1-dark to-accent1"; // Diamond
      default: return "bg-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-gold" />
          <h3 className="font-medium">Ihr Trading-Rang</h3>
        </div>
        <Badge 
          className={cn(
            "px-3 py-1 border-0 text-black font-bold",
            getRankBadgeBg(currentRank),
            "animate-gradient-shift bg-clip-text transition-all duration-300"
          )}
        >
          <Star className="h-3.5 w-3.5 mr-1" />
          Rang {currentRank}
        </Badge>
      </div>
      
      <Card className="bg-casino-card border border-gold/20 p-4 relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gold/5 blur-xl animate-glow-pulse"></div>
        
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="text-sm font-medium text-foreground">{currentTier?.label}</div>
          {nextTier && (
            <div className="text-xs text-muted-foreground flex items-center">
              <span>Nächster Rang: {nextTier.label} ({nextTier.minBalance}€)</span> 
              <ChevronUp className="ml-1 h-4 w-4" />
            </div>
          )}
        </div>
        
        {nextTier && (
          <div className="mb-4 relative z-10">
            <Progress 
              value={progressToNextRank} 
              className="h-3 bg-casino-darker" 
              indicatorClassName="bg-gradient-to-r from-gold/80 to-gold transition-all"
            />
            <div className="flex justify-between mt-1">
              <div className="text-xs text-muted-foreground">
                {currentTier?.label}
              </div>
              <div className="text-xs text-gold">
                {progressToNextRank}%
              </div>
              <div className="text-xs text-muted-foreground">
                {nextTier.label}
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3 relative z-10">
          <div className="text-center p-3 bg-casino-darker rounded-lg border border-gold/10 transition-transform duration-300 hover:scale-105">
            <div className="text-sm text-muted-foreground">Tägliches Limit</div>
            <div className="text-xl font-bold text-gold">{maxTradesPerDay}</div>
            <div className="text-xs text-muted-foreground">Trades</div>
          </div>
          <div className="text-center p-3 bg-casino-darker rounded-lg border border-gold/10 transition-transform duration-300 hover:scale-105">
            <div className="text-sm text-muted-foreground">Verbleibend</div>
            <div className="text-xl font-bold text-accent1-light">{tradesRemaining}</div>
            <div className="text-xs text-muted-foreground">Trades</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RankDisplay;
