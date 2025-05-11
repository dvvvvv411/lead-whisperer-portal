
import { useState, useRef, useCallback } from "react";

export const useBotInterval = () => {
  const [botInterval, setBotInterval] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const clearBotInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  
  const setNewBotInterval = useCallback((callback: () => void, minutes: number) => {
    clearBotInterval();
    
    // Convert minutes to milliseconds
    const milliseconds = minutes * 60 * 1000;
    
    // Set new interval
    intervalRef.current = setInterval(callback, milliseconds);
    
    // Update the interval state
    setBotInterval(minutes);
  }, [clearBotInterval]);

  return {
    botInterval,
    intervalRef,
    clearBotInterval,
    setNewBotInterval,
    setBotInterval
  };
};
