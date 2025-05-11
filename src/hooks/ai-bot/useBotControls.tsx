
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { BotStatus } from "./types";

export const useBotControls = (
  userId?: string,
  status?: BotStatus,
  updateStatus?: (newStatus: Partial<BotStatus>) => void,
  clearBotInterval?: () => void,
  setNewBotInterval?: (callback: () => void, minutes: number) => void,
  executeSingleTrade?: () => Promise<boolean>
) => {
  const { toast } = useToast();
  
  // Start the trading bot
  const startBot = useCallback(() => {
    if (!userId || !status || !updateStatus || !setNewBotInterval || !executeSingleTrade) {
      console.log("Cannot start bot: missing required data");
      return;
    }
    
    // Only allow starting if not already running
    if (status.isRunning) {
      console.log("Bot is already running");
      return;
    }
    
    console.log("Starting trading bot with interval:", status.currentRank, "minutes");
    
    // Update status to running
    updateStatus({
      isRunning: true,
      statusMessage: "Bot ist aktiv und handelt automatisch"
    });
    
    // Set the bot interval based on current settings
    setNewBotInterval(() => {
      executeSingleTrade().then(success => {
        if (success) {
          console.log("Bot executed first trade successfully");
        }
      });
    }, status.currentRank);
    
    // Removed toast notification that was shown when bot starts
    
  }, [userId, status, updateStatus, setNewBotInterval, executeSingleTrade]);
  
  // Stop the trading bot
  const stopBot = useCallback(() => {
    if (!status || !updateStatus || !clearBotInterval) {
      console.log("Cannot stop bot: missing required data");
      return;
    }
    
    // Only stop if running
    if (!status.isRunning) {
      console.log("Bot is not running");
      return;
    }
    
    console.log("Stopping trading bot");
    
    // Clear the interval
    clearBotInterval();
    
    // Update status to stopped
    updateStatus({
      isRunning: false,
      statusMessage: "Bot ist gestoppt"
    });
    
    toast({
      title: "Trading Bot gestoppt",
      description: "Der automatische Handel wurde beendet."
    });
    
  }, [status, updateStatus, clearBotInterval, toast]);

  return {
    startBot,
    stopBot
  };
};
