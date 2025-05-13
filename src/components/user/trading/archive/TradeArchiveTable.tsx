
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Bot, ArrowDown, ArrowUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SortField = 'date' | 'asset' | 'price' | 'quantity' | 'total' | 'profit';
type SortDirection = 'asc' | 'desc';

interface TradeArchiveTableProps {
  trades: any[];
  loading: boolean;
}

const PAGE_SIZE = 10;

const TradeArchiveTable = ({ trades, loading }: TradeArchiveTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({
    field: 'date',
    direction: 'desc',
  });
  
  // Sort trades
  const sortedTrades = [...trades].sort((a, b) => {
    switch (sortConfig.field) {
      case 'date':
        return sortConfig.direction === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'asset':
        return sortConfig.direction === 'asc'
          ? (a.crypto_asset?.symbol || '').localeCompare(b.crypto_asset?.symbol || '')
          : (b.crypto_asset?.symbol || '').localeCompare(a.crypto_asset?.symbol || '');
      case 'price':
        return sortConfig.direction === 'asc'
          ? a.price - b.price
          : b.price - a.price;
      case 'quantity':
        return sortConfig.direction === 'asc'
          ? a.quantity - b.quantity
          : b.quantity - a.quantity;
      case 'total':
        return sortConfig.direction === 'asc'
          ? a.total_amount - b.total_amount
          : b.total_amount - a.total_amount;
      case 'profit':
        // For profit we need to find sell trades and their matching buy trades
        // This is a simple approach that just sorts by total amount difference
        return sortConfig.direction === 'asc'
          ? a.total_amount - b.total_amount
          : b.total_amount - a.total_amount;
      default:
        return 0;
    }
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedTrades.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedTrades = sortedTrades.slice(startIndex, startIndex + PAGE_SIZE);
  
  // Change sort configuration
  const handleSort = (field: SortField) => {
    setSortConfig({
      field,
      direction: 
        sortConfig.field === field && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };
  
  // Pagination navigation
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  };
  
  // Extract bot name from strategy
  const getBotName = (strategy: string) => {
    if (strategy.startsWith('ai_')) {
      return strategy.replace('ai_', 'KI Bot (');
    }
    if (strategy.startsWith('bot_')) {
      return strategy.replace('bot_', 'Bot (');
    }
    return strategy;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd.MM.yyyy HH:mm:ss", { locale: de });
  };

  // Find profit for sell trades
  const findTradeProfit = (trade: any) => {
    if (trade.type !== 'sell') return null;
    
    // Since the profit is calculated internally and not exposed directly,
    // we can't show an exact profit figure in many cases
    // This is a simplified calculation
    return trade.profit || 0;
  };
  
  // Determine sort direction indicator
  const getSortIndicator = (field: SortField) => {
    if (sortConfig.field !== field) return null;
    
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4" /> 
      : <ArrowDown className="h-4 w-4" />;
  };
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-casino-highlight bg-casino-card">
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:text-accent1-light transition-colors"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    Datum & Uhrzeit
                    {getSortIndicator('date')}
                  </div>
                </TableHead>
                <TableHead>Bot-Name</TableHead>
                <TableHead>Exchange</TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-accent1-light transition-colors"
                  onClick={() => handleSort('asset')}
                >
                  <div className="flex items-center">
                    Asset
                    {getSortIndicator('asset')}
                  </div>
                </TableHead>
                <TableHead>Aktion</TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-accent1-light transition-colors text-right"
                  onClick={() => handleSort('quantity')}
                >
                  <div className="flex items-center justify-end">
                    Menge
                    {getSortIndicator('quantity')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-accent1-light transition-colors text-right"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center justify-end">
                    Preis
                    {getSortIndicator('price')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-accent1-light transition-colors text-right"
                  onClick={() => handleSort('total')}
                >
                  <div className="flex items-center justify-end">
                    Betrag
                    {getSortIndicator('total')}
                  </div>
                </TableHead>
                <TableHead className="text-right">Gewinn/Verlust</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTrades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                      <Bot className="h-10 w-10" />
                      <p>Keine Bot-Trades gefunden.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTrades.map((trade) => {
                  const profit = trade.type === 'sell' ? findTradeProfit(trade) : null;
                  
                  return (
                    <TableRow key={trade.id} className="hover:bg-casino-highlight/10">
                      <TableCell className="font-mono text-xs">
                        {formatDate(trade.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Bot className="h-4 w-4 text-accent1" />
                          <span className="text-sm">{getBotName(trade.strategy)}</span>
                        </div>
                      </TableCell>
                      <TableCell>Binance</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {trade.crypto_asset?.image_url && (
                            <img 
                              src={trade.crypto_asset.image_url} 
                              alt={trade.crypto_asset.symbol} 
                              className="h-5 w-5 rounded-full"
                            />
                          )}
                          <span className="uppercase">{trade.crypto_asset?.symbol || "UNKNOWN"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={trade.type === 'buy' ? 'default' : 'secondary'}
                          className={cn(
                            "text-xs",
                            trade.type === 'buy' 
                              ? "bg-green-600/30 text-green-300 hover:bg-green-600/40 border-green-600/50" 
                              : "bg-red-600/30 text-red-300 hover:bg-red-600/40 border-red-600/50"
                          )}
                        >
                          {trade.type === 'buy' ? (
                            <TrendingUp className="h-3.5 w-3.5 mr-1" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5 mr-1" />
                          )}
                          {trade.type === 'buy' ? 'KAUF' : 'VERKAUF'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {trade.quantity.toFixed(6)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(trade.price)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(trade.total_amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {trade.type === 'sell' && (
                          <span className="text-green-400 font-medium">
                            +{formatCurrency(trade.total_amount - (trade.buy_amount || trade.total_amount * 0.95))}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Zeige {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, sortedTrades.length)} von {sortedTrades.length} Einträgen
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Zurück
            </Button>
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              // Show pages around current page
              const pageNumbers = [];
              const buffer = 2; // Number of pages to show on either side
              
              // Calculate range of pages to show
              let startPage = Math.max(1, currentPage - buffer);
              let endPage = Math.min(totalPages, currentPage + buffer);
              
              // Adjust if we're near the beginning or end
              if (currentPage <= buffer) {
                endPage = Math.min(totalPages, 2 * buffer + 1);
              } else if (currentPage >= totalPages - buffer) {
                startPage = Math.max(1, totalPages - 2 * buffer);
              }
              
              // Generate page buttons
              for (let page = startPage; page <= endPage; page++) {
                pageNumbers.push(
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </Button>
                );
              }
              
              return pageNumbers;
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Weiter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeArchiveTable;
