
import { useEffect } from "react";
import { getUserRank } from "./botTradeUtils";
import { getTradesExecutedToday, getTotalTradesExecuted } from "./botTradeUtils";

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

  // Fetch today's trades and total trades on mount and update remaining trades
  useEffect(() => {
    if (!userId || !updateStatus) return;

    const fetchTradesData = async () => {
      try {
        // Get the count of trades executed today
        const todayTradesCount = await getTradesExecutedToday(userId);
        
        // Get the total count of trades executed (all time)
        const totalTradesCount = await getTotalTradesExecuted(userId);
        
        // Each trade now counts as 0.5, so we divide by 2 to get the actual trade count for today
        const actualDailyTradeCount = Math.ceil(todayTradesCount / 2);
        
        console.log("Trade counts fetched:", {
          todayRawCount: todayTradesCount,
          dailyTradeCount: actualDailyTradeCount,
          totalTradesCount
        });
        
        updateStatus(prev => ({ 
          dailyTradesExecuted: actualDailyTradeCount,
          tradesRemaining: Math.max(0, prev.maxTradesPerDay - actualDailyTradeCount),
          tradesExecuted: totalTradesCount // Update the total trades count
        }));
      } catch (error) {
        console.error("Error fetching trades data:", error);
      }
    };
    
    // Initial fetch
    fetchTradesData();
    
    // Use a longer interval (2 minutes) to reduce interference with simulation
    const interval = setInterval(fetchTradesData, 120000);
    
    return () => clearInterval(interval);
  }, [userId, updateStatus]);
};
