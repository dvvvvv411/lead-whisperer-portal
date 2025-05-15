
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowUp, Clock } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { usePublicTrades } from "@/hooks/usePublicTrades";

interface TradeItemProps {
  trade: any;
  isNew?: boolean;
}

const TradeItem = ({ trade, isNew = false }: TradeItemProps) => {
  const isBuy = trade.type === 'buy';
  
  return (
    <motion.div 
      initial={isNew ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center justify-between p-3 border-b border-white/10 ${isNew ? 'bg-white/5' : ''}`}
    >
      <div className="flex items-center space-x-3">
        {trade.crypto_asset?.image_url ? (
          <div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden bg-white/10">
            <AspectRatio ratio={1/1}>
              <img 
                src={trade.crypto_asset?.image_url} 
                alt={trade.crypto_asset?.symbol || "Crypto"} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </AspectRatio>
          </div>
        ) : (
          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-xs font-bold">{trade.crypto_asset?.symbol?.substring(0, 2) || "?"}</span>
          </div>
        )}
        
        <div>
          <p className="text-sm font-medium">{trade.crypto_asset?.name || "Unknown Asset"}</p>
          <p className="text-xs text-gray-400">{trade.crypto_asset?.symbol || "???"}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className={`flex items-center px-2 py-1 rounded text-xs font-medium ${isBuy ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {isBuy ? (
            <ArrowUp className="w-3 h-3 mr-1" />
          ) : (
            <ArrowDown className="w-3 h-3 mr-1" />
          )}
          {isBuy ? 'BUY' : 'SELL'}
        </span>
        
        <div className="text-right">
          <p className="text-sm font-medium">{trade.quantity.toFixed(4)} {trade.crypto_asset?.symbol}</p>
          <p className="text-xs text-gray-400">≈ €{trade.total_amount.toFixed(2)}</p>
        </div>
      </div>
    </motion.div>
  );
};

const TradeLoadingSkeleton = () => (
  <div className="flex items-center justify-between p-3 border-b border-white/10">
    <div className="flex items-center space-x-3">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div>
        <Skeleton className="w-20 h-4 mb-1" />
        <Skeleton className="w-10 h-3" />
      </div>
    </div>
    
    <div className="flex items-center space-x-2">
      <Skeleton className="w-12 h-6 rounded" />
      <div>
        <Skeleton className="w-16 h-4 mb-1" />
        <Skeleton className="w-12 h-3" />
      </div>
    </div>
  </div>
);

const LiveTradesDisplay = () => {
  const { trades, loading } = usePublicTrades();
  const [recentTrades, setRecentTrades] = useState<string[]>([]);
  
  // Mark newly arrived trades for animation
  useEffect(() => {
    if (trades.length > 0) {
      // Get IDs of the 3 most recent trades
      const newTradeIds = trades.slice(0, 3).map(trade => trade.id);
      
      // Set these as recent
      setRecentTrades(newTradeIds);
      
      // After 2 seconds, remove them from recent list
      const timer = setTimeout(() => {
        setRecentTrades([]);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [trades]);

  return (
    <div className="bg-casino-card border border-white/10 rounded-xl shadow-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <h3 className="text-xl font-bold text-white">Live Trades</h3>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
          <span className="text-green-500 text-sm">Live</span>
        </div>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        {loading ? (
          Array(5).fill(0).map((_, i) => (
            <TradeLoadingSkeleton key={i} />
          ))
        ) : trades.length === 0 ? (
          <div className="py-8 text-center text-gray-400">
            <p>Keine Trades gefunden</p>
          </div>
        ) : (
          <AnimatePresence>
            {trades.map(trade => (
              <TradeItem 
                key={trade.id} 
                trade={trade} 
                isNew={recentTrades.includes(trade.id)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
      
      <div className="p-3 bg-casino-darker border-t border-white/10 text-xs text-gray-400 flex items-center">
        <Clock className="w-3 h-3 mr-1" />
        <span>Letzte Aktualisierung: {formatDistanceToNow(new Date(), { addSuffix: true, locale: de })}</span>
      </div>
    </div>
  );
};

export default LiveTradesDisplay;
