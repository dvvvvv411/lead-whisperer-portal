
export interface BotSettings {
  isActive: boolean;
  tradeFrequency: 'low' | 'medium' | 'high';
  riskLevel: 'conservative' | 'balanced' | 'aggressive';
  maxTradeAmount: number;
  tradeInterval: number; 
}

export interface BotStatus {
  isActive: boolean;
  isRunning: boolean; 
  lastTradeTime: Date | null;
  lastTradeAttempt?: Date | null; 
  lastSuccessfulTrade?: Date | null;
  lastStarted?: Date | null; // Added the missing property
  totalProfitPercentage: number;
  totalProfitAmount: number;
  tradesExecuted: number;
  totalTradesExecuted?: number; 
  // Rank-related fields
  currentRank: number;
  maxTradesPerDay: number;
  tradesRemaining: number;
  dailyTradesExecuted: number;
  dailyTradesCount?: number; 
  dailyTradeLimit?: number; 
  statusMessage?: string; 
}

export interface RankTier {
  rankNumber: number;
  minBalance: number;
  maxBalance: number | null;
  maxTradesPerDay: number;
  label: string;
}
