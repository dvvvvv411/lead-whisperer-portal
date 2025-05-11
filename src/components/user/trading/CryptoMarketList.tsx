
import React, { useState } from "react";
import { Motion, spring } from "react-motion";
import { ChevronUp, ChevronDown, BarChart2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TradeForm from "./TradeForm";
import { Button } from "@/components/ui/button";

interface CryptoMarketListProps {
  cryptos: any[];
  onTrade: (cryptoId: string, type: 'buy' | 'sell', quantity: number, price: number, strategy: string) => void;
  userCredit: number;
  compact?: boolean;
}

const CryptoMarketList = ({ cryptos, onTrade, userCredit, compact = false }: CryptoMarketListProps) => {
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  const getPercentageClass = (value: number) => {
    if (value > 0) return "text-green-400";
    if (value < 0) return "text-red-400";
    return "text-gray-400";
  };

  const handleSelectCrypto = (cryptoId: string) => {
    setSelectedCrypto(selectedCrypto === cryptoId ? null : cryptoId);
  };

  const getDirectionIcon = (value: number) => {
    if (value > 0) return <ChevronUp className="h-4 w-4 text-green-400" />;
    if (value < 0) return <ChevronDown className="h-4 w-4 text-red-400" />;
    return null;
  };

  return (
    <div className={`overflow-x-auto ${compact ? 'p-2' : 'p-4'}`}>
      <table className="w-full">
        <thead>
          <tr className={`border-b border-casino-highlight ${compact ? 'text-xs' : 'text-sm'}`}>
            <th className="text-left py-2 text-muted-foreground font-medium">Asset</th>
            <th className="text-right py-2 text-muted-foreground font-medium">Preis</th>
            <th className="text-right py-2 text-muted-foreground font-medium">24h</th>
            {!compact && (
              <th className="text-right py-2 text-muted-foreground font-medium">7d</th>
            )}
            <th className="text-right py-2 text-muted-foreground font-medium">Aktion</th>
          </tr>
        </thead>
        <tbody>
          {cryptos.map((crypto) => (
            <React.Fragment key={crypto.id}>
              <tr 
                className={`border-b border-casino-highlight hover:bg-casino-highlight cursor-pointer transition-colors ${
                  compact ? 'text-xs' : 'text-sm'
                }`}
                onClick={() => !compact && handleSelectCrypto(crypto.id)}
              >
                <td className="py-3">
                  <div className="flex items-center">
                    {crypto.image_url && (
                      <img 
                        src={crypto.image_url} 
                        alt={crypto.name} 
                        className={`${compact ? 'h-5 w-5' : 'h-6 w-6'} mr-2`} 
                      />
                    )}
                    <div>
                      <div className="font-medium">{crypto.symbol.toUpperCase()}</div>
                      {!compact && <div className="text-xs text-muted-foreground">{crypto.name}</div>}
                    </div>
                  </div>
                </td>
                <td className="text-right py-3 font-medium">
                  {formatCurrency(crypto.current_price)}
                </td>
                <td className="text-right py-3">
                  <div className={`flex items-center justify-end ${getPercentageClass(crypto.price_change_percentage_24h)}`}>
                    {getDirectionIcon(crypto.price_change_percentage_24h)}
                    <span>{formatPercentage(crypto.price_change_percentage_24h)}</span>
                  </div>
                </td>
                {!compact && (
                  <td className="text-right py-3">
                    <div className={`flex items-center justify-end ${getPercentageClass(crypto.price_change_percentage_7d)}`}>
                      {getDirectionIcon(crypto.price_change_percentage_7d)}
                      <span>{formatPercentage(crypto.price_change_percentage_7d)}</span>
                    </div>
                  </td>
                )}
                <td className="text-right py-3">
                  {compact ? (
                    <Badge variant="outline" className="cursor-pointer bg-gold/10 hover:bg-gold/20 text-gold-light border-gold/20">
                      <BarChart2 className="h-3 w-3 mr-1" /> Daten
                    </Badge>
                  ) : (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-gold/20 bg-transparent text-gold hover:bg-gold/10"
                    >
                      Handeln
                    </Button>
                  )}
                </td>
              </tr>
              {selectedCrypto === crypto.id && !compact && (
                <tr>
                  <td colSpan={5} className="p-0 bg-casino-darker">
                    <Motion
                      defaultStyle={{ height: 0, opacity: 0 }}
                      style={{ 
                        height: spring(200, { stiffness: 300, damping: 30 }), 
                        opacity: spring(1) 
                      }}
                    >
                      {interpolatingStyle => (
                        <div 
                          style={{ 
                            height: `${interpolatingStyle.height}px`,
                            opacity: interpolatingStyle.opacity,
                            overflow: 'hidden'
                          }}
                          className="p-4 border-t border-gold/10"
                        >
                          <TradeForm
                            crypto={crypto}
                            onTrade={onTrade}
                            userCredit={userCredit}
                            onClose={() => handleSelectCrypto(crypto.id)}
                          />
                        </div>
                      )}
                    </Motion>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoMarketList;
