
import React from 'react';
import { Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RankTier } from "@/hooks/ai-bot/types";

// Import our refactored components
import RankBadge from './rank-components/RankBadge';
import AccountBalance from './rank-components/AccountBalance';
import RankProgress from './rank-components/RankProgress';
import WelcomeSection from './rank-components/WelcomeSection';
import TradeExecutionButton from './rank-components/TradeExecutionButton';
import TradeCounter from './rank-components/TradeCounter';
import BackgroundEffects from './rank-components/BackgroundEffects';
import RankDisplayStyles from './rank-components/RankDisplayStyles';

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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-gold" />
          <h3 className="font-medium text-white drop-shadow-sm">Trading-Rang</h3>
        </div>
      </div>
      
      <Card className="bg-gradient-to-br from-casino-dark/80 to-casino-card/90 backdrop-blur-xl border border-gold/20 p-4 relative overflow-hidden shadow-lg">
        {/* Background and glow effects */}
        <BackgroundEffects />
        
        {/* Content layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Rank info - Left Column */}
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <RankBadge currentRank={currentRank} />
            <AccountBalance userCredit={userCredit} />
            <RankProgress 
              currentRank={currentRank}
              userCredit={userCredit}
              rankTiers={rankTiers}
            />
          </div>
          
          {/* Welcome message and CTA - Middle section */}
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <WelcomeSection userName={userName} />
          </div>
          
          {/* Power button and trade execution */}
          <div className="flex flex-col items-center justify-center">
            {/* Power Button with Trading Execution */}
            <TradeExecutionButton
              tradesRemaining={tradesRemaining}
              onExecuteTrade={onExecuteTrade}
            />
            
            {/* Trades counter */}
            <TradeCounter
              tradesRemaining={tradesRemaining}
              maxTradesPerDay={maxTradesPerDay}
              dailyTradesExecuted={dailyTradesExecuted}
            />
          </div>
        </div>
      </Card>
      <RankDisplayStyles />
    </div>
  );
};

export default RankDisplay;
