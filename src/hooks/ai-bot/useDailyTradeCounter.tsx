
import { useEffect } from "react";
import { getUserRank } from "./botTradeUtils";
import { getTradesExecutedToday } from "./botTradeUtils";

export const useDailyTradeCounter = (
  userId?: string,
  userCredit?: number,
  updateStatus?: (update: any) => void
) => {
  // Update rank and limits when user credit changes
  useEffect(() => {
    if (userCredit && updateStatus) {
      const newRank = getUserRank(userCredit);
      updateStatus({ 
        currentRank: newRank.rankNumber,
        maxTradesPerDay: newRank.maxTradesPerDay,
      });
    }
  }, [userCredit, updateStatus]);

  // Fetch today's trades on mount and update remaining trades
  useEffect(() => {
    if (!userId || !updateStatus) return;

    const fetchTodaysTrades = async () => {
      const todayTradesCount = await getTradesExecutedToday(userId);
      updateStatus(prev => ({ 
        dailyTradesExecuted: todayTradesCount,
        tradesRemaining: Math.max(0, prev.maxTradesPerDay - todayTradesCount)
      }));
    };
    
    fetchTodaysTrades();
    // Set up an interval to update trade count periodically
    const interval = setInterval(fetchTodaysTrades, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [userId, updateStatus]);
};
