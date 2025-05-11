
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
      // Get the count of buy transactions (each buy-sell pair counts as 1 trade)
      const todayTradesCount = await getTradesExecutedToday(userId);
      
      updateStatus(prev => ({ 
        dailyTradesExecuted: todayTradesCount,
        tradesRemaining: Math.max(0, prev.maxTradesPerDay - todayTradesCount)
      }));
    };
    
    fetchTodaysTrades();
    // Use a longer interval (2 minutes) to reduce interference with simulation
    const interval = setInterval(fetchTodaysTrades, 120000);
    
    return () => clearInterval(interval);
  }, [userId, updateStatus]);
};
