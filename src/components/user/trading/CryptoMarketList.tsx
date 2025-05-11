
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import TradeForm from "./TradeForm";

interface CryptoMarketListProps {
  cryptos: any[];
  onTrade?: (cryptoId: string, type: 'buy' | 'sell', quantity: number, price: number, strategy: string) => void;
  userCredit?: number;
  compact?: boolean;
  className?: string;
}

const CryptoMarketList = ({ 
  cryptos, 
  onTrade, 
  userCredit = 0,
  compact = false,
  className 
}: CryptoMarketListProps) => {
  const [sortBy, setSortBy] = useState<string>("market_cap");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [activeTradeCrypto, setActiveTradeCrypto] = useState<string | null>(null);
  
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
  };
  
  const handleTradeClick = (cryptoId: string) => {
    setActiveTradeCrypto(activeTradeCrypto === cryptoId ? null : cryptoId);
  };
  
  const sortedCryptos = [...cryptos].sort((a, b) => {
    if (sortBy === "name") {
      return sortDir === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    }
    
    if (sortBy === "symbol") {
      return sortDir === "asc" 
        ? a.symbol.localeCompare(b.symbol) 
        : b.symbol.localeCompare(a.symbol);
    }
    
    // Default numeric sorting
    const aValue = a[sortBy] || 0;
    const bValue = b[sortBy] || 0;
    
    return sortDir === "asc" ? aValue - bValue : bValue - aValue;
  });

  const renderPriceChangeCell = (changeValue: number) => {
    const isPositive = changeValue > 0;
    const changeColor = isPositive ? 'text-green-500' : changeValue < 0 ? 'text-red-500' : 'text-gray-400';
    const ArrowIcon = isPositive ? ArrowUpIcon : ArrowDownIcon;
    
    return (
      <td className={`whitespace-nowrap py-2 text-sm ${changeColor}`}>
        <div className="flex items-center">
          {changeValue !== 0 && (
            <ArrowIcon className="h-3 w-3 mr-1" />
          )}
          {Math.abs(changeValue).toFixed(2)}%
        </div>
      </td>
    );
  };

  // Compact view with just the essentials for sidebar
  if (compact) {
    return (
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full border-separate border-spacing-y-1">
          <thead className="bg-casino-dark sticky top-0 z-10">
            <tr className="text-xs text-gray-400">
              <th className="px-2 py-2 text-left">Währung</th>
              <th className="px-2 py-2 text-right">Preis</th>
              <th className="px-2 py-2 text-right">24h</th>
            </tr>
          </thead>
          <tbody>
            {sortedCryptos.map((crypto) => (
              <tr 
                key={crypto.id} 
                className="bg-casino-card/50 hover:bg-casino-card/80 transition-colors"
              >
                {/* Currency column with logo and name */}
                <td className="px-2 py-2">
                  <div className="flex items-center">
                    <img 
                      src={crypto.image_url} 
                      alt={crypto.symbol} 
                      className="w-5 h-5 mr-2 rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{crypto.symbol.toUpperCase()}</span>
                      <span className="text-xs text-muted-foreground">{crypto.name}</span>
                    </div>
                  </div>
                </td>
                
                {/* Price column */}
                <td className="px-2 py-2 text-right">
                  <span className="text-sm">{formatCurrency(crypto.current_price)}</span>
                </td>
                
                {/* 24h change column */}
                <td className="px-2 py-2 text-right">
                  <span className={`text-sm ${crypto.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {crypto.price_change_percentage_24h > 0 && '+'}
                    {crypto.price_change_percentage_24h?.toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Full view with trading functionality
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700 text-xs text-gray-400">
            <th className="py-3 px-2 text-left cursor-pointer" onClick={() => handleSort("name")}>
              Name
              {sortBy === "name" && (
                <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>
              )}
            </th>
            <th className="py-3 px-2 text-right cursor-pointer" onClick={() => handleSort("current_price")}>
              Preis
              {sortBy === "current_price" && (
                <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>
              )}
            </th>
            <th className="py-3 px-2 text-right cursor-pointer" onClick={() => handleSort("price_change_percentage_24h")}>
              24h %
              {sortBy === "price_change_percentage_24h" && (
                <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>
              )}
            </th>
            <th className="py-3 px-2 text-right cursor-pointer" onClick={() => handleSort("market_cap")}>
              Marktkapitalisierung
              {sortBy === "market_cap" && (
                <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>
              )}
            </th>
            <th className="py-3 px-2 text-right">
              Aktion
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedCryptos.map((crypto) => (
            // Use regular div instead of React.Fragment with properties
            <div key={crypto.id}>
              <tr className="border-b border-gray-800 hover:bg-gray-900/50">
                <td className="py-3 px-2">
                  <div className="flex items-center">
                    <img 
                      src={crypto.image_url || "https://via.placeholder.com/32"} 
                      alt={crypto.name}
                      className="w-8 h-8 mr-3 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{crypto.name}</div>
                      <div className="text-xs text-gray-400">{crypto.symbol.toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2 text-right">
                  {formatCurrency(crypto.current_price)}
                </td>
                {renderPriceChangeCell(crypto.price_change_percentage_24h)}
                <td className="py-3 px-2 text-right">
                  {formatCurrency(crypto.market_cap || 0)}
                </td>
                <td className="py-3 px-2 text-right">
                  {onTrade && (
                    <Button
                      variant={activeTradeCrypto === crypto.id ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handleTradeClick(crypto.id)}
                    >
                      {activeTradeCrypto === crypto.id ? "Schließen" : "Handeln"}
                    </Button>
                  )}
                </td>
              </tr>
              {activeTradeCrypto === crypto.id && onTrade && (
                <tr>
                  <td colSpan={5} className="bg-gray-900/30 border-b border-gray-800">
                    <TradeForm 
                      crypto={crypto}
                      userCredit={userCredit}
                      onTrade={onTrade}
                      onCancel={() => setActiveTradeCrypto(null)}
                    />
                  </td>
                </tr>
              )}
            </div>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoMarketList;
