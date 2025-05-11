
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import TradeForm from "./TradeForm";

interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number | null;
  price_change_24h: number | null;
  price_change_percentage_24h: number | null;
  image_url: string | null;
}

interface CryptoMarketListProps {
  cryptos: CryptoAsset[];
  onTrade: (cryptoId: string, type: 'buy' | 'sell', quantity: number, price: number, strategy: string) => void;
  userCredit: number;
}

const CryptoMarketList = ({ cryptos, onTrade, userCredit }: CryptoMarketListProps) => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAsset | null>(null);
  const [showTradeForm, setShowTradeForm] = useState(false);
  
  const handleBuy = (crypto: CryptoAsset) => {
    setSelectedCrypto(crypto);
    setShowTradeForm(true);
  };

  const handleCloseTradeForm = () => {
    setShowTradeForm(false);
    setSelectedCrypto(null);
  };
  
  const formatPrice = (price?: number | null) => {
    if (price === null || price === undefined) return "-";
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
  };
  
  const formatMarketCap = (marketCap?: number | null) => {
    if (marketCap === null || marketCap === undefined) return "-";
    
    if (marketCap >= 1_000_000_000) {
      return `${(marketCap / 1_000_000_000).toFixed(2)} Mrd. €`;
    } else if (marketCap >= 1_000_000) {
      return `${(marketCap / 1_000_000).toFixed(2)} Mio. €`;
    }
    
    return formatPrice(marketCap);
  };
  
  const formatPercentage = (percentage?: number | null) => {
    if (percentage === null || percentage === undefined) return "-";
    return `${percentage > 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kryptowährung</TableHead>
              <TableHead className="text-right">Kurs</TableHead>
              <TableHead className="text-right">Marktkapitalisierung</TableHead>
              <TableHead className="text-right">24h Änderung</TableHead>
              <TableHead className="text-right">Aktion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cryptos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Keine Kryptowährungen verfügbar
                </TableCell>
              </TableRow>
            ) : (
              cryptos.map((crypto) => (
                <TableRow key={crypto.id}>
                  <TableCell className="flex items-center gap-2">
                    {crypto.image_url && (
                      <img 
                        src={crypto.image_url} 
                        alt={crypto.name} 
                        className="w-6 h-6 rounded-full" 
                      />
                    )}
                    <span className="font-medium">{crypto.name}</span>
                    <span className="text-muted-foreground ml-1">{crypto.symbol}</span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(crypto.current_price)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatMarketCap(crypto.market_cap)}
                  </TableCell>
                  <TableCell className={`text-right ${
                    crypto.price_change_percentage_24h && crypto.price_change_percentage_24h > 0 
                      ? 'text-green-500' 
                      : crypto.price_change_percentage_24h && crypto.price_change_percentage_24h < 0 
                        ? 'text-red-500' 
                        : ''
                  }`}>
                    <div className="flex items-center justify-end gap-1">
                      {crypto.price_change_percentage_24h && crypto.price_change_percentage_24h > 0 ? (
                        <ArrowUpIcon className="h-4 w-4" />
                      ) : crypto.price_change_percentage_24h && crypto.price_change_percentage_24h < 0 ? (
                        <ArrowDownIcon className="h-4 w-4" />
                      ) : null}
                      {formatPercentage(crypto.price_change_percentage_24h)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      onClick={() => handleBuy(crypto)}
                      variant="outline"
                      size="sm"
                    >
                      Handeln
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {showTradeForm && selectedCrypto && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <TradeForm
              crypto={selectedCrypto}
              onTrade={onTrade}
              onClose={handleCloseTradeForm}
              userCredit={userCredit}
            />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CryptoMarketList;
