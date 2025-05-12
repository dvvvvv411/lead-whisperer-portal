
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
      try {
        // Get the count of buy transactions (each buy-sell pair counts as 1 trade)
        const todayTradesCount = await getTradesExecutedToday(userId);
        
        // Each trade now counts as 0.5, so we divide by 2 to get the actual trade count
        const actualTradeCount = Math.ceil(todayTradesCount / 2);
        
        updateStatus(prev => ({ 
          dailyTradesExecuted: actualTradeCount,
          tradesRemaining: Math.max(0, prev.maxTradesPerDay - actualTradeCount)
        }));
      } catch (error) {
        console.error("Error fetching today's trades:", error);
      }
    };
    
    // Initial fetch
    fetchTodaysTrades();
    
    // Use a longer interval (2 minutes) to reduce interference with simulation
    const interval = setInterval(fetchTodaysTrades, 120000);
    
    return () => clearInterval(interval);
  }, [userId, updateStatus]);
};
