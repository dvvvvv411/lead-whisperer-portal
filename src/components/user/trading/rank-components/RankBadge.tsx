
import React from 'react';
import { cn } from "@/lib/utils";
import { Trophy, Award, Medal } from "lucide-react";

interface RankBadgeProps {
  currentRank: number;
}

export const RankBadge = ({ currentRank }: RankBadgeProps) => {
  const getRankName = (rank: number) => {
    switch(rank) {
      case 1: return "Anfänger";
      case 2: return "Silber";
      case 3: return "Gold";
      case 4: return "Platin";
      case 5: return "Diamant";
      default: return "Anfänger";
    }
  };

  // Choose the appropriate icon based on rank
  const RankIcon = () => {
    if (currentRank >= 4) {
      return <Trophy className="h-7 w-7 text-yellow-400 drop-shadow-md animate-pulse" />;
    } else if (currentRank === 3) {
      return <Medal className="h-7 w-7 text-yellow-400 drop-shadow-md animate-pulse" />;
    } else if (currentRank === 2) {
      return <Medal className="h-7 w-7 text-slate-300 drop-shadow-md animate-pulse" />;
    } else {
      return <Award className="h-7 w-7 text-amber-600 drop-shadow-md animate-pulse" />;
    }
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <span className="text-sm text-muted-foreground">Aktueller Rang</span>
      <div className="flex items-center gap-2 mt-1">
        <RankIcon />
        <span className={cn(
          "text-2xl font-bold",
          currentRank >= 3 
            ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500" 
            : currentRank === 2 
            ? "text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-gray-400" 
            : "text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400"
        )}>
          {getRankName(currentRank)}
        </span>
      </div>
    </div>
  );
};

export default RankBadge;
