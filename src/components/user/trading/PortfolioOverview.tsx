
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import TradeForm from "./TradeForm";

interface PortfolioItem {
  id: string;
  crypto_asset_id: string;
  quantity: number;
  average_buy_price: number;
  crypto_asset?: {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    image_url: string | null;
  };
}

interface PortfolioSummary {
  totalValue: number;
  totalProfit: number;
  profitPercentage: number;
}

interface PortfolioOverviewProps {
  portfolio: PortfolioItem[];
  summary: PortfolioSummary;
  onTrade: (cryptoId: string, type: 'buy' | 'sell', quantity: number, price: number, strategy: string) => void;
}

const PortfolioOverview = ({ portfolio, summary, onTrade }: PortfolioOverviewProps) => {
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [showTradeForm, setShowTradeForm] = useState(false);
  
  const handleTrade = (asset: any) => {
    setSelectedAsset(asset.crypto_asset);
    setShowTradeForm(true);
  };

  const handleCloseTradeForm = () => {
    setShowTradeForm(false);
    setSelectedAsset(null);
  };
  
  const formatPrice = (price?: number | null) => {
    if (price === null || price === undefined) return "-";
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
  };
  
  const calculateProfit = (item: PortfolioItem) => {
    if (!item.crypto_asset) return { value: 0, percentage: 0 };
    
    const investment = item.quantity * item.average_buy_price;
    const currentValue = item.quantity * item.crypto_asset.current_price;
    const profit = currentValue - investment;
    const percentage = investment > 0 ? (profit / investment) * 100 : 0;
    
    return { value: profit, percentage };
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gesamtwert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(summary.totalValue)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gesamtgewinn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              summary.totalProfit > 0 ? 'text-green-500' : 
              summary.totalProfit < 0 ? 'text-red-500' : ''
            }`}>
              {formatPrice(summary.totalProfit)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rendite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold flex items-center ${
              summary.profitPercentage > 0 ? 'text-green-500' : 
              summary.profitPercentage < 0 ? 'text-red-500' : ''
            }`}>
              {summary.profitPercentage > 0 ? (
                <ArrowUpIcon className="h-5 w-5 mr-1" />
              ) : summary.profitPercentage < 0 ? (
                <ArrowDownIcon className="h-5 w-5 mr-1" />
              ) : null}
              {summary.profitPercentage.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Menge</TableHead>
              <TableHead className="text-right">Durchschn. Kaufpreis</TableHead>
              <TableHead className="text-right">Aktueller Wert</TableHead>
              <TableHead className="text-right">Gewinn/Verlust</TableHead>
              <TableHead className="text-right">Aktion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolio.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Kein Portfolio vorhanden. Kaufen Sie Kryptowährungen, um Ihr Portfolio aufzubauen.
                </TableCell>
              </TableRow>
            ) : (
              portfolio.map((item) => {
                const profit = calculateProfit(item);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="flex items-center gap-2">
                      {item.crypto_asset?.image_url && (
                        <img 
                          src={item.crypto_asset.image_url} 
                          alt={item.crypto_asset.name} 
                          className="w-6 h-6 rounded-full" 
                        />
                      )}
                      <span className="font-medium">{item.crypto_asset?.name}</span>
                      <span className="text-muted-foreground ml-1">{item.crypto_asset?.symbol}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.quantity.toFixed(6)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(item.average_buy_price)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(item.crypto_asset?.current_price)}
                    </TableCell>
                    <TableCell className={`text-right ${
                      profit.value > 0 ? 'text-green-500' : 
                      profit.value < 0 ? 'text-red-500' : ''
                    }`}>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center">
                          {profit.value > 0 ? (
                            <ArrowUpIcon className="h-4 w-4 mr-1" />
                          ) : profit.value < 0 ? (
                            <ArrowDownIcon className="h-4 w-4 mr-1" />
                          ) : null}
                          {formatPrice(profit.value)}
                        </div>
                        <div className="text-xs">
                          {profit.percentage > 0 ? '+' : ''}
                          {profit.percentage.toFixed(2)}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        onClick={() => handleTrade(item)}
                        variant="outline"
                        size="sm"
                      >
                        Handeln
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      {showTradeForm && selectedAsset && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <TradeForm
              crypto={selectedAsset}
              onTrade={onTrade}
              onClose={handleCloseTradeForm}
              defaultAction="sell"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PortfolioOverview;
