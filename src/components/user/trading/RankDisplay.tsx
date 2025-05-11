
import React from 'react';
import { RankTier } from '@/hooks/ai-bot/types';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, ChevronUp, Star, Award } from "lucide-react";
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
  
  // Get rank badge color
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
      
      <Card className="bg-casino-card border border-gold/20 p-4 relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gold/5 blur-xl animate-glow-pulse"></div>
        
        {/* Large rank display */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex flex-col items-start">
            <span className="text-sm text-muted-foreground">Aktueller Rang</span>
            <div className="flex items-center gap-2 mt-1">
              <Award className="h-7 w-7 text-gold animate-pulse-gold" />
              <span className={`text-2xl font-bold ${currentRank >= 3 ? "text-gold" : currentRank === 2 ? "text-gray-300" : "text-amber-600"}`}>
                {getRankName(currentRank)}
              </span>
            </div>
          </div>
          <div 
            className={cn(
              "flex items-center justify-center w-16 h-16 rounded-full border-4 transition-all duration-300",
              getRankBadgeBg(currentRank),
              "animate-gradient-shift"
            )}
          >
            <span className="text-3xl font-bold text-black">
              {currentRank}
            </span>
          </div>
        </div>
        
        {/* Compact trades limit display */}
        <div className="mb-4 p-3 bg-casino-darker rounded-lg border border-gold/10 relative z-10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-muted-foreground">Tägliches Limit</span>
            <span className="text-xs text-gold font-medium">
              {tradesRemaining}/{maxTradesPerDay} verfügbar
            </span>
          </div>
          <Progress 
            value={(dailyTradesExecuted / maxTradesPerDay) * 100} 
            className="h-3 bg-casino-darker"
          />
          <style>
            {`
              /* Custom progress bar styling */
              .h-3.bg-casino-darker [role="progressbar"] {
                background: linear-gradient(to right, rgba(255, 215, 0, 0.8), rgba(255, 215, 0, 1)) !important;
                transition: all 0.3s ease;
              }
            `}
          </style>
        </div>
        
        {/* Next rank progress */}
        {nextTier && (
          <div className="mb-2 relative z-10">
            <div className="flex justify-between mb-1">
              <div className="text-sm font-medium text-foreground">{currentTier?.label}</div>
              <div className="text-xs text-muted-foreground flex items-center">
                <span>Nächster Rang: {nextTier.label} ({nextTier.minBalance}€)</span> 
                <ChevronUp className="ml-1 h-4 w-4" />
              </div>
            </div>
            <Progress 
              value={progressToNextRank} 
              className="h-2 bg-casino-darker" 
            />
            <div className="flex justify-between mt-1">
              <div className="text-xs text-muted-foreground">
                {currentTier?.minBalance}€
              </div>
              <div className="text-xs text-gold">
                {progressToNextRank}%
              </div>
              <div className="text-xs text-muted-foreground">
                {nextTier.minBalance}€
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RankDisplay;
