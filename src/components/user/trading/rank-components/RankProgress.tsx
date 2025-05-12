
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Star, ChevronUp } from "lucide-react";
import { RankTier } from "@/hooks/ai-bot/types";

interface RankProgressProps {
  currentRank: number;
  userCredit: number;
  rankTiers: RankTier[];
}

const RankProgress = ({
  currentRank,
  userCredit,
  rankTiers
}: RankProgressProps) => {
  // Find the current and next rank tier
  const currentTier = rankTiers.find(tier => tier.rankNumber === currentRank);
  const nextTier = rankTiers.find(tier => tier.rankNumber === currentRank + 1);

  // Calculate progress to next rank if there is one
  const progressToNextRank = nextTier ? 
    Math.min(100, Math.round((userCredit - currentTier!.minBalance) / (nextTier.minBalance - currentTier!.minBalance) * 100)) : 100;

  if (!nextTier) return null;
  
  return (
    <div className="mb-1 relative z-10 w-full max-w-[210px]">
      <div className="flex justify-between mb-1">
        <div className="text-sm font-medium flex items-center gap-2">
          <Star className="h-4 w-4 text-accent1-light" />
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
        indicatorClassName="bg-gradient-to-r from-purple-600/70 to-accent1-light" 
      />
      <div className="flex justify-between mt-1">
        <div className="text-xs text-muted-foreground">
          {currentTier?.minBalance}€
        </div>
        
        <div className="text-xs text-muted-foreground">
          {nextTier.minBalance}€
        </div>
      </div>
    </div>
  );
};

export default RankProgress;
