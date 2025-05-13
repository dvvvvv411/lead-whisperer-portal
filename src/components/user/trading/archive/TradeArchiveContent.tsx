
import { useState, useEffect } from "react";
import TradeArchiveFilterBar from "./TradeArchiveFilterBar";
import TradeArchiveTable from "./TradeArchiveTable";
import { useTradeHistory } from "@/hooks/useTradeHistory";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface TradeArchiveContentProps {
  userId?: string;
}

const TradeArchiveContent = ({ userId }: TradeArchiveContentProps) => {
  const { trades, botTrades, loading, fetchTradeHistory, lastRefresh } = useTradeHistory(userId);
  const [filteredTrades, setFilteredTrades] = useState<any[]>([]);
  
  // Filter state
  const [filters, setFilters] = useState({
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined
    },
    asset: "",
    botStrategy: "",
    action: "all" as "all" | "buy" | "sell" // Changed from "" to "all"
  });
  
  // Apply filters to trades
  useEffect(() => {
    if (!botTrades) {
      setFilteredTrades([]);
      return;
    }
    
    let result = [...botTrades];
    
    // Filter by date range
    if (filters.dateRange.from) {
      result = result.filter(trade => 
        new Date(trade.created_at) >= filters.dateRange.from!
      );
    }
    
    if (filters.dateRange.to) {
      // Add a day to include the end date fully
      const endDate = new Date(filters.dateRange.to);
      endDate.setDate(endDate.getDate() + 1);
      
      result = result.filter(trade => 
        new Date(trade.created_at) <= endDate
      );
    }
    
    // Filter by crypto asset
    if (filters.asset) {
      result = result.filter(trade => 
        trade.crypto_asset?.symbol?.toLowerCase().includes(filters.asset.toLowerCase()) ||
        trade.crypto_asset?.name?.toLowerCase().includes(filters.asset.toLowerCase())
      );
    }
    
    // Filter by bot strategy
    if (filters.botStrategy) {
      result = result.filter(trade => 
        trade.strategy.toLowerCase().includes(filters.botStrategy.toLowerCase())
      );
    }
    
    // Filter by action (buy/sell)
    if (filters.action !== "all") {
      result = result.filter(trade => trade.type === filters.action);
    }
    
    setFilteredTrades(result);
  }, [botTrades, filters]);
  
  // Fetch data on initial load
  useEffect(() => {
    if (userId) {
      fetchTradeHistory();
    }
  }, [userId, fetchTradeHistory]);
  
  // Handle refresh
  const handleRefresh = () => {
    fetchTradeHistory();
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full bg-gray-800/50" />
        <Skeleton className="h-64 w-full bg-gray-800/50" />
      </div>
    );
  }
  
  const lastRefreshFormatted = lastRefresh 
    ? format(lastRefresh, "dd.MM.yyyy HH:mm:ss", { locale: de })
    : "N/A";
    
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-gray-400">
          Letzte Aktualisierung: {lastRefreshFormatted}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={handleRefresh}
        >
          <RefreshCw className="h-4 w-4" />
          Aktualisieren
        </Button>
      </div>
      
      <TradeArchiveFilterBar 
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      <TradeArchiveTable 
        trades={filteredTrades} 
        loading={loading}
      />
    </div>
  );
};

export default TradeArchiveContent;
