
export interface BotSettings {
  isActive: boolean;
  tradeFrequency: 'low' | 'medium' | 'high';
  riskLevel: 'conservative' | 'balanced' | 'aggressive';
  maxTradeAmount: number;
}

export interface BotStatus {
  isActive: boolean;
  lastTradeTime: Date | null;
  totalProfitPercentage: number;
  totalProfitAmount: number;
  tradesExecuted: number;
  // New rank-related fields
  currentRank: number;
  maxTradesPerDay: number;
  tradesRemaining: number;
  dailyTradesExecuted: number;
}

export interface RankTier {
  rankNumber: number;
  minBalance: number;
  maxBalance: number | null;
  maxTradesPerDay: number;
  label: string;
}
