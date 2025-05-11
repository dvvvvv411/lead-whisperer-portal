
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
}
