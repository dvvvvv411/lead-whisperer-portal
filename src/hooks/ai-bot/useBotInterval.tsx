
import { useState, useCallback, useEffect } from "react";

export const useBotInterval = () => {
  const [botInterval, setBotInterval] = useState<NodeJS.Timeout | null>(null);

  // Clear the bot interval
  const clearBotInterval = useCallback(() => {
    if (botInterval) {
      clearInterval(botInterval);
      setBotInterval(null);
    }
  }, [botInterval]);

  // Set a new interval
  const setNewBotInterval = useCallback((callback: () => void, intervalTime: number) => {
    // Clear any existing interval first
    clearBotInterval();
    
    // Set up new interval
    const interval = setInterval(callback, intervalTime);
    setBotInterval(interval);
    
    return interval;
  }, [clearBotInterval]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (botInterval) {
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
