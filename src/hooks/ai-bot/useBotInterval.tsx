
import { useState, useCallback, useEffect } from "react";

export const useBotInterval = () => {
  const [botInterval, setBotInterval] = useState<NodeJS.Timeout | null>(null);

  // Clear the bot interval
  const clearBotInterval = useCallback(() => {
    if (botInterval) {
      console.log("Cleaning up interval");
      clearInterval(botInterval);
      setBotInterval(null);
    }
  }, [botInterval]);

  // Set a new interval
  const setNewBotInterval = useCallback((callback: () => void, intervalTime: number) => {
    // Clear any existing interval first
    clearBotInterval();
    
    // Convert minutes to milliseconds
    const intervalMs = intervalTime * 60 * 1000;
    
    // Set up new interval
    console.log(`Setting up new interval to run every ${intervalTime} minutes (${intervalMs}ms)`);
    const interval = setInterval(callback, intervalMs);
    setBotInterval(interval);
    
    return interval;
  }, [clearBotInterval]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (botInterval) {
        console.log("Component unmounting, cleaning up interval");
        clearInterval(botInterval);
      }
    };
  }, [botInterval]);

  return {
    botInterval,
    clearBotInterval,
    setNewBotInterval,
    setBotInterval
  };
};
