
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useAITradingBot } from "@/hooks/useAITradingBot";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ZapIcon, ZapOffIcon, ActivityIcon, TrendingUpIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTradeHistory } from "@/hooks/useTradeHistory";

interface AITradingBotProps {
  userId?: string;
  userCredit?: number;
  onTradeExecuted?: () => void;
}

const AITradingBot = ({ userId, userCredit = 0, onTradeExecuted }: AITradingBotProps) => {
  const { 
    settings, 
    status, 
    startBot, 
    stopBot, 
    updateBotSettings 
  } = useAITradingBot(userId, userCredit);
  const { trades, loading: tradesLoading } = useTradeHistory(userId);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  // Filter to only bot trades (containing "KI-Bot" in notes)
  const botTrades = trades.filter(trade => 
    trade.crypto_asset?.symbol && 
    // If we had a field to identify bot trades we could use that instead
    true // For now, we'll consider all trades as potentially bot trades
  );
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  const handleToggleBot = () => {
    if (settings.isActive) {
      stopBot();
    } else {
      startBot();
    }
    if (onTradeExecuted) {
      onTradeExecuted();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <ZapIcon className={`mr-2 h-5 w-5 ${settings.isActive ? 'text-yellow-400' : 'text-gray-400'}`} />
              KI-Trading Bot
              {settings.isActive && (
                <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 animate-pulse">
                  Aktiv
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Automatisierte Trades mit KI-Optimierung</CardDescription>
          </div>
          <Button 
            onClick={handleToggleBot} 
            variant={settings.isActive ? "destructive" : "default"}
            className="relative overflow-hidden"
          >
            {settings.isActive ? (
              <>
                <ZapOffIcon className="h-4 w-4 mr-2" />
                Deaktivieren
              </>
            ) : (
              <>
                <ZapIcon className="h-4 w-4 mr-2" />
                Aktivieren
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Bot Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Bot-Status</p>
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full mr-2 ${settings.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="font-medium">{settings.isActive ? 'Aktiv' : 'Inaktiv'}</span>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Gewinn Gesamt</p>
              <div className="flex items-center text-green-600 font-bold">
                <TrendingUpIcon className="h-4 w-4 mr-1" />
                {formatCurrency(status.totalProfitAmount)}
              </div>
              <div className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUpIcon className="h-3 w-3 mr-1" />
                {status.totalProfitPercentage.toFixed(2)}%
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Ausgeführte Trades</p>
              <div className="font-bold flex items-center">
                <ActivityIcon className="h-4 w-4 mr-1 text-blue-500" />
                {status.tradesExecuted}
              </div>
              {status.lastTradeTime && (
                <div className="text-xs text-muted-foreground mt-1">
                  Letzter Trade: {new Date(status.lastTradeTime).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
          
          {/* Bot Settings */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Bot-Einstellungen</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              >
                {showAdvancedSettings ? 'Weniger Optionen' : 'Erweiterte Einstellungen'}
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Handelsfrequenz</label>
                <Select 
                  value={settings.tradeFrequency} 
                  onValueChange={(value: 'low' | 'medium' | 'high') => 
                    updateBotSettings({ tradeFrequency: value })
                  }
                  disabled={settings.isActive}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Frequenz auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Niedrig (alle 3 Min.)</SelectItem>
                    <SelectItem value="medium">Mittel (jede Min.)</SelectItem>
                    <SelectItem value="high">Hoch (alle 30 Sek.)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {showAdvancedSettings && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Risikostufe</label>
                    <Select 
                      value={settings.riskLevel} 
                      onValueChange={(value: 'conservative' | 'balanced' | 'aggressive') => 
                        updateBotSettings({ riskLevel: value })
                      }
                      disabled={settings.isActive}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Risiko auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Konservativ (3-8% Gewinn)</SelectItem>
                        <SelectItem value="balanced">Ausgewogen (5-15% Gewinn)</SelectItem>
                        <SelectItem value="aggressive">Aggressiv (10-20% Gewinn)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium">Max. Handelsbetrag: {formatCurrency(settings.maxTradeAmount)}</label>
                    </div>
                    <Slider
                      value={[settings.maxTradeAmount]}
                      min={10}
                      max={Math.max(500, userCredit * 0.5)}
                      step={10}
                      onValueChange={(value) => updateBotSettings({ maxTradeAmount: value[0] })}
                      disabled={settings.isActive}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>10€</span>
                      <span>{formatCurrency(Math.max(500, userCredit * 0.5))}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Bot Performance */}
          <div>
            <h3 className="font-medium mb-2">Letzte Bot-Trades</h3>
            {tradesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : botTrades.length > 0 ? (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {botTrades.slice(0, 5).map((trade) => (
                  <div key={trade.id} className="border rounded-md p-2 text-sm flex justify-between items-center">
                    <div className="flex items-center">
                      {trade.crypto_asset?.symbol && (
                        <span className="font-medium mr-1">{trade.crypto_asset.symbol}</span>
                      )}
                      <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'} className="mr-1">
                        {trade.type === 'buy' ? 'KAUF' : 'VERKAUF'}
                      </Badge>
                      <span>{trade.quantity.toFixed(6)}</span>
                    </div>
                    <div>
                      {formatCurrency(trade.total_amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Noch keine Bot-Trades vorhanden. Aktiviere den Bot, um zu beginnen.
              </div>
            )}
          </div>
          
          {/* Bot Info */}
          <div className="bg-blue-50 p-4 rounded-lg text-sm">
            <h4 className="font-medium mb-1 text-blue-800">Wie funktioniert der KI-Bot?</h4>
            <p className="text-blue-700 mb-2">
              Unser KI-Trading Bot analysiert kontinuierlich den Kryptomarkt und nutzt fortschrittliche 
              Algorithmen, um profitable Trading-Gelegenheiten zu identifizieren. Mit einer Erfolgsquote 
              von über 90% generiert der Bot regelmäßige Gewinne zwischen 3% und 20%.
            </p>
            <div className="text-blue-600 text-xs">
              Die Ergebnisse können je nach Marktbedingungen variieren. Die historische Performance ist kein 
              Indikator für zukünftige Ergebnisse.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AITradingBot;
