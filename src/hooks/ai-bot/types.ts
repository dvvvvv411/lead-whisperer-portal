
export interface BotSettings {
  isActive: boolean;
  tradeFrequency: 'low' | 'medium' | 'high';
  riskLevel: 'conservative' | 'balanced' | 'aggressive';
  maxTradeAmount: number;
  tradeInterval: number; // Added missing property
}

export interface BotStatus {
  isActive: boolean;
  isRunning: boolean; // Added missing property
  lastTradeTime: Date | null;
  lastTradeAttempt?: Date | null; // Added missing property
  lastSuccessfulTrade?: Date | null; // Added missing property
  totalProfitPercentage: number;
  totalProfitAmount: number;
  tradesExecuted: number;
  totalTradesExecuted?: number; // Added missing property
  // Rank-related fields
  currentRank: number;
  maxTradesPerDay: number;
  tradesRemaining: number;
  dailyTradesExecuted: number;
  dailyTradesCount?: number; // Added missing property
  dailyTradeLimit?: number; // Added missing property
  statusMessage?: string; // Added missing property
}

export interface RankTier {
  rankNumber: number;
  minBalance: number;
  maxBalance: number | null;
  maxTradesPerDay: number;
  label: string;
}
