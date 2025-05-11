
import { useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCryptos } from "@/hooks/useCryptos";
import { BotSettings, BotStatus } from "./types";
import { executeAITrade } from "./executeBotTrade";
import { getTradesExecutedToday } from "./botTradeUtils";

export const useBotOperations = (
  userId?: string,
  userCredit?: number,
  settings?: BotSettings,
  status?: BotStatus,
  updateStatus?: (update: any) => void,
  clearBotInterval?: () => void,
  setNewBotInterval?: (callback: () => void, intervalTime: number) => NodeJS.Timeout,
  setBotInterval?: (interval: NodeJS.Timeout | null) => void,
  setSettings?: (setter: (prev: BotSettings) => BotSettings) => void,
  onTradeExecuted?: () => void
) => {
  const { toast } = useToast();
  const { cryptos } = useCryptos();

  // Stop the AI trading bot
  const stopBot = useCallback(() => {
    if (!clearBotInterval || !setSettings || !updateStatus) return;

    clearBotInterval();
    setSettings(prev => ({ ...prev, isActive: false }));
    updateStatus({ isActive: false });
    
    toast({
      title: "KI-Bot deaktiviert",
      description: "Der KI-Trading-Bot wurde erfolgreich deaktiviert.",
    });
  }, [clearBotInterval, toast, setSettings, updateStatus]);
  
  // Execute a single trade
  const executeSingleTrade = useCallback(async () => {
    if (!userId || !userCredit || !updateStatus || !status || !settings || !cryptos) {
      return false;
    }
    
    // Check if user has reached daily limit
    if (status.tradesRemaining <= 0) {
      toast({
        title: "Tägliches Limit erreicht",
        description: `Sie haben bereits Ihr tägliches Limit von ${status.maxTradesPerDay} Trades erreicht. Erhöhen Sie Ihr Guthaben für mehr Trades.`,
        variant: "destructive"
      });
      return false;
    }
    
    const success = await executeAITrade(
      userId, 
      userCredit, 
      cryptos, 
      settings, 
      toast, 
      updateStatus, 
      status.dailyTradesExecuted,
      status.maxTradesPerDay
    );
    
    // Call the onTradeExecuted callback to update the parent components
    if (success && onTradeExecuted) {
      onTradeExecuted();
    }
    
    return success;
  }, [userId, userCredit, cryptos, settings, toast, updateStatus, onTradeExecuted, status]);
  
  // Start the AI trading bot
  const startBot = useCallback(() => {
    if (!userId || !userCredit || !settings || !status || !updateStatus || !setSettings || 
        !clearBotInterval || !setNewBotInterval || !executeSingleTrade || !stopBot) {
      toast({
        title: "Bot kann nicht aktiviert werden",
        description: "Benutzer nicht angemeldet oder kein Guthaben verfügbar.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if user has reached daily limit
    if (status.tradesRemaining <= 0) {
      toast({
        title: "Tägliches Limit erreicht",
        description: `Sie haben bereits Ihr tägliches Limit von ${status.maxTradesPerDay} Trades erreicht. Erhöhen Sie Ihr Guthaben für mehr Trades.`,
        variant: "destructive"
      });
      return;
    }
    
    // Set interval time based on frequency setting
    let intervalTime = 60000; // default 1 minute
    switch(settings.tradeFrequency) {
      case 'low':
        intervalTime = 180000; // 3 minutes
        break;
      case 'high':
        intervalTime = 30000; // 30 seconds
        break;
      case 'medium':
      default:
        intervalTime = 60000; // 1 minute
        break;
    }
    
    // Execute a trade immediately
    executeSingleTrade();
    
    // Set up interval for recurring trades
    const interval = setNewBotInterval(() => {
      // Check if trades remaining before executing
      if (status.tradesRemaining > 0) {
        executeSingleTrade();
      } else {
        // Stop bot if daily limit reached
        stopBot();
        toast({
          title: "Bot automatisch deaktiviert",
          description: `Tägliches Limit von ${status.maxTradesPerDay} Trades erreicht. Bot wurde gestoppt.`,
          variant: "default"
        });
      }
    }, intervalTime);
    
    setSettings(prev => ({ ...prev, isActive: true }));
    updateStatus({ isActive: true });
    
    toast({
      title: "KI-Bot aktiviert",
      description: "Der KI-Trading-Bot wurde erfolgreich aktiviert und wird nun automatisch handeln.",
    });
  }, [userId, userCredit, clearBotInterval, executeSingleTrade, settings, toast, status, updateStatus, setSettings, setNewBotInterval, stopBot]);

  return {
    startBot,
    stopBot,
    executeSingleTrade
  };
};
