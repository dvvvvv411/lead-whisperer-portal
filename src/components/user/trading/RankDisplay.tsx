
import React from 'react';
import { RankTier } from '@/hooks/ai-bot/types';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <h3 className="font-medium">Ihr Trading-Rang</h3>
        </div>
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Rang {currentRank}
        </Badge>
      </div>
      
      <Card className="p-4 border border-yellow-200 bg-yellow-50">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium">{currentTier?.label}</div>
          {nextTier && (
            <div className="text-xs text-muted-foreground flex items-center">
              <span>Nächster Rang bei {nextTier.minBalance}€</span> 
              <ChevronUp className="ml-1 h-4 w-4" />
            </div>
          )}
        </div>
        
        {nextTier && (
          <div className="mb-4">
            <Progress value={progressToNextRank} className="h-2" />
            <div className="text-xs text-right mt-1 text-muted-foreground">
              {progressToNextRank}% zum nächsten Rang
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="text-center p-2 bg-white rounded border">
            <div className="text-sm text-muted-foreground">Tägliches Limit</div>
            <div className="font-bold">{maxTradesPerDay} Trades</div>
          </div>
          <div className="text-center p-2 bg-white rounded border">
            <div className="text-sm text-muted-foreground">Verbleibend</div>
            <div className="font-bold">{tradesRemaining} Trades</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RankDisplay;
