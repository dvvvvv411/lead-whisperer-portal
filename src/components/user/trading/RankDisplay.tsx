
import React from 'react';
import { RankTier } from '@/hooks/ai-bot/types';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, ChevronUp, Star, Zap, Power } from "lucide-react";
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
}

const RankDisplay = ({ 
  currentRank, 
  maxTradesPerDay, 
  tradesRemaining, 
  dailyTradesExecuted,
  userCredit,
  rankTiers,
  onExecuteTrade
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
        
        {/* Content layout - Reorganized grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left column with rank info */}
          <div className="md:col-span-4">
            <div className="flex flex-col h-full">
              {/* Rank Badge - Made more prominent */}
              <div className="bg-gradient-to-br from-casino-darker to-casino-card p-4 rounded-lg border border-gold/10 mb-4 relative overflow-hidden">
                {/* Background shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent animate-gradient-shift bg-[length:200%_100%]"></div>
                
                <div className="flex flex-col items-center">
                  <Trophy 
                    className={cn(
                      "h-12 w-12 mb-2",
                      currentRank >= 3 ? "text-yellow-400" : currentRank === 2 ? "text-slate-300" : "text-amber-600", 
                      "drop-shadow-md animate-pulse"
                    )}
                  />
                  <span className={cn(
                    "text-2xl font-bold text-center",
                    currentRank >= 3 ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500" : 
                    currentRank === 2 ? "text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-gray-400" : 
                    "text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400"
                  )}>
                    {getRankName(currentRank)}
                  </span>
                  
                  {/* Account balance - Now more prominent */}
                  <div className="mt-3 text-center">
                    <span className="text-xs text-muted-foreground block">Kontoguthaben</span>
                    <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light mt-1">
                      {userCredit.toLocaleString('de-DE')} €
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Daily trades counter - Styled to match theme */}
              <div className="bg-gradient-to-br from-casino-darker to-casino-card p-3 rounded-lg border border-gold/10">
                <div className="text-sm text-muted-foreground flex items-center justify-center mb-1">
                  <Zap className="h-3.5 w-3.5 mr-1 text-gold" />
                  <span>Tägliche Trades</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">0</div>
                  <div className="text-sm font-medium text-gold">
                    {dailyTradesExecuted}/{maxTradesPerDay}
                  </div>
                  <div className="text-xs text-muted-foreground">Max</div>
                </div>
                <Progress
                  value={(dailyTradesExecuted / maxTradesPerDay) * 100}
                  className="h-1.5 mt-1 bg-casino-darker"
                  indicatorClassName="bg-gradient-to-r from-gold/70 to-gold"
                />
              </div>
            </div>
          </div>
          
          {/* Center column with progress */}
          <div className="md:col-span-4">
            <div className="h-full flex flex-col justify-between">
              {/* Next rank progress section - Enhanced with animations */}
              {nextTier && (
                <div className="mb-4 bg-gradient-to-br from-casino-darker to-casino-card p-4 rounded-lg border border-gold/10 relative">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjE1LDAsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-10"></div>
                  
                  <div className="text-center mb-2">
                    <div className="text-sm font-medium flex items-center justify-center gap-2">
                      <Star className="h-4 w-4 text-gold-light" />
                      <span>Fortschritt zum nächsten Rang</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <Trophy className={cn(
                        "h-6 w-6",
                        currentRank >= 3 ? "text-yellow-400" : 
                        currentRank === 2 ? "text-slate-300" : "text-amber-600"
                      )} />
                    </div>
                    
                    <div className="flex-1">
                      <Progress 
                        value={progressToNextRank} 
                        className="h-2 bg-casino-darker" 
                        indicatorClassName="bg-gradient-to-r from-accent1/70 to-accent1"
                      />
                    </div>
                    
                    <div className="w-10 h-10 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-accent1" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <div>{currentTier?.label}</div>
                    <div className="text-accent1">{progressToNextRank}%</div>
                    <div>{nextTier.label}</div>
                  </div>
                  
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <div>{currentTier?.minBalance.toLocaleString('de-DE')}€</div>
                    <div>{nextTier.minBalance.toLocaleString('de-DE')}€</div>
                  </div>
                </div>
              )}
              
              {/* Trades remaining indicator */}
              <div className="bg-gradient-to-br from-casino-darker to-casino-card p-4 rounded-lg border border-gold/10">
                <div className="text-center mb-2">
                  <span className="text-sm font-medium flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
                    <span>Verbleibende Trades</span>
                  </span>
                </div>
                
                <div className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light">
                  {tradesRemaining}
                </div>
                
                <div className="text-xs text-center text-muted-foreground mt-1">
                  von {maxTradesPerDay} pro Tag
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column with power button - Enhanced with dramatic effects */}
          <div className="md:col-span-4">
            <div className="h-full flex flex-col items-center justify-center">
              {/* New CTA Power Button with enhanced design */}
              <div className="text-center mb-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-gold-light">Trading Power</span>
              </div>
              
              <div className="relative">
                {/* Outer ring glow effect */}
                <div className="absolute inset-0 rounded-full bg-gold/20 filter blur-xl animate-pulse-gold"></div>
                
                {/* Radiating circles animation */}
                <div className="absolute -inset-4 z-0">
                  <div className="w-full h-full rounded-full border-2 border-gold/10 animate-pulse-gold"></div>
                  <div className="absolute inset-2 rounded-full border-2 border-gold/20 animate-pulse-gold" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute inset-4 rounded-full border-2 border-gold/30 animate-pulse-gold" style={{animationDelay: '1s'}}></div>
                </div>
                
                {/* Power button */}
                <button
                  onClick={onExecuteTrade}
                  disabled={tradesRemaining <= 0}
                  className={cn(
                    "relative w-32 h-32 rounded-full flex items-center justify-center z-10",
                    "overflow-hidden group cursor-pointer",
                    "border-4 border-gold/30 shadow-xl shadow-gold/20",
                    "bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md",
                    "transform transition-all duration-500 hover:scale-105",
                    tradesRemaining <= 0 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {/* Inner circles */}
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 group-hover:from-gold/30 group-hover:to-gold/10 transition-all duration-300"></div>
                  
                  {/* Center button */}
                  <div className={cn(
                    "absolute inset-4 rounded-full",
                    "bg-gradient-to-br from-gold/30 to-gold/10",
                    "flex items-center justify-center",
                    "transform transition-all duration-500",
                    "group-hover:from-gold/40 group-hover:to-gold/20",
                    "group-active:scale-95"
                  )}>
                    <Power className={cn(
                      "h-12 w-12 text-gold",
                      "filter drop-shadow-lg",
                      "animate-pulse",
                      "transform transition-transform duration-300",
                      "group-hover:scale-110 group-hover:rotate-12"
                    )} />
                  </div>
                  
                  {/* Light rays effect */}
                  <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {Array.from({length: 8}).map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute top-1/2 left-1/2 w-40 h-1 bg-gradient-to-r from-gold/40 to-transparent"
                        style={{
                          transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                          transformOrigin: 'center'
                        }}
                      ></div>
                    ))}
                  </div>
                </button>
              </div>
              
              {/* Power button label */}
              <div className="mt-4 text-center">
                <span className="text-sm font-medium text-gold">{tradesRemaining > 0 ? "Jetzt Traden" : "Keine Trades mehr"}</span>
                <p className="text-xs text-muted-foreground mt-1">Klicken um einen automatisierten Trade auszuführen</p>
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
