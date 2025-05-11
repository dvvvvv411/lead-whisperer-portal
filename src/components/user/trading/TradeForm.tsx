
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
}

interface TradeFormProps {
  crypto: CryptoAsset;
  onTrade: (cryptoId: string, type: 'buy' | 'sell', quantity: number, price: number, strategy: string) => void;
  onClose: () => void;
  defaultAction?: 'buy' | 'sell';
  userCredit?: number;
}

const tradeStrategies = [
  { id: 'trend_following', name: 'Trendfolge-Strategie', description: 'Kaufen bei Aufwärtsbewegungen, Verkaufen bei Abwärtsbewegungen' },
  { id: 'mean_reversion', name: 'Mean-Reversion-Strategie', description: 'Kaufen bei übermäßigen Rückgängen, Verkaufen bei übermäßigen Anstiegen' },
  { id: 'momentum', name: 'Momentum-Strategie', description: 'Kaufen bei starken Aufwärtsbewegungen, Verkaufen bei starkem Abwärtstrend' },
  { id: 'sentiment', name: 'Sentiment-Analyse', description: 'Kaufen/Verkaufen basierend auf Marktstimmung und Nachrichten' }
];

const TradeForm = ({ crypto, onTrade, onClose, defaultAction = 'buy', userCredit = 0 }: TradeFormProps) => {
  const [action, setAction] = useState<'buy' | 'sell'>(defaultAction);
  const [amount, setAmount] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [strategy, setStrategy] = useState<string>(tradeStrategies[0].id);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentTotal, setCurrentTotal] = useState<number>(0);
  
  // Update total when amount or quantity changes
  useEffect(() => {
    if (amount && !isNaN(parseFloat(amount))) {
      setCurrentTotal(parseFloat(amount));
      setQuantity((parseFloat(amount) / crypto.current_price).toFixed(6));
    } else if (quantity && !isNaN(parseFloat(quantity))) {
      setCurrentTotal(parseFloat(quantity) * crypto.current_price);
    }
  }, [amount, quantity, crypto.current_price]);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (value && !isNaN(parseFloat(value))) {
      setQuantity((parseFloat(value) / crypto.current_price).toFixed(6));
    } else {
      setQuantity('');
    }
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuantity(value);
    if (value && !isNaN(parseFloat(value))) {
      setAmount((parseFloat(value) * crypto.current_price).toFixed(2));
    } else {
      setAmount('');
    }
  };
  
  const handleStrategyChange = (value: string) => {
    setStrategy(value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };
  
  const confirmTrade = () => {
    const qtyNum = parseFloat(quantity);
    
    onTrade(
      crypto.id,
      action,
      qtyNum,
      crypto.current_price,
      strategy
    );
    
    setShowConfirmation(false);
    onClose();
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
  };
  
  const getCurrentStrategyDescription = () => {
    return tradeStrategies.find(s => s.id === strategy)?.description || '';
  };
  
  const isDisabled = () => {
    const qtyNum = parseFloat(quantity);
    const amtNum = parseFloat(amount);
    
    if (!qtyNum || !amtNum || isNaN(qtyNum) || isNaN(amtNum) || qtyNum <= 0) {
      return true;
    }
    
    if (action === 'buy' && userCredit !== undefined && amtNum > userCredit) {
      return true;
    }
    
    return false;
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {crypto.name} 
          <span className="text-muted-foreground">({crypto.symbol})</span>
          <span className="font-bold ml-2">
            {formatPrice(crypto.current_price)}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Schließen
        </Button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <RadioGroup 
            defaultValue={action} 
            value={action}
            onValueChange={(value) => setAction(value as 'buy' | 'sell')} 
            className="flex"
          >
            <div className="flex items-center space-x-2 mr-6">
              <RadioGroupItem value="buy" id="buy" />
              <Label htmlFor="buy">Kaufen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sell" id="sell" />
              <Label htmlFor="sell">Verkaufen</Label>
            </div>
          </RadioGroup>
          
          <Tabs defaultValue="amount">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="amount">Betrag</TabsTrigger>
              <TabsTrigger value="quantity">Menge</TabsTrigger>
            </TabsList>
            
            <TabsContent value="amount">
              <div className="space-y-2">
                <Label htmlFor="amount">Betrag (€)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Betrag eingeben"
                  value={amount}
                  onChange={handleAmountChange}
                  min="0"
                  step="0.01"
                />
                {action === 'buy' && userCredit !== undefined && (
                  <div className="text-sm text-muted-foreground">
                    Verfügbares Guthaben: {formatPrice(userCredit)}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="quantity">
              <div className="space-y-2">
                <Label htmlFor="quantity">Menge ({crypto.symbol})</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Menge eingeben"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="0"
                  step="0.000001"
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="space-y-2">
            <Label>AI-Handelsstrategie</Label>
            <Select 
              value={strategy}
              onValueChange={handleStrategyChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Strategie auswählen" />
              </SelectTrigger>
              <SelectContent>
                {tradeStrategies.map((strat) => (
                  <SelectItem key={strat.id} value={strat.id}>
                    {strat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              {getCurrentStrategyDescription()}
            </p>
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex justify-between text-sm mb-4">
              <span>Gesamtbetrag:</span>
              <span className="font-bold">{formatPrice(currentTotal)}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span>Menge:</span>
              <span className="font-bold">{parseFloat(quantity || '0').toFixed(6)} {crypto.symbol}</span>
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isDisabled()}
              variant={action === 'buy' ? 'default' : 'destructive'}
            >
              {action === 'buy' ? 'Kaufen' : 'Verkaufen'}
            </Button>
          </div>
        </div>
      </form>
      
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'buy' ? 'Kaufbestätigung' : 'Verkaufsbestätigung'}
            </DialogTitle>
            <DialogDescription>
              Bitte bestätigen Sie Ihre Transaktion
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-between">
              <span>Asset:</span>
              <span className="font-semibold">{crypto.name} ({crypto.symbol})</span>
            </div>
            <div className="flex justify-between">
              <span>Aktion:</span>
              <span className="font-semibold">{action === 'buy' ? 'Kaufen' : 'Verkaufen'}</span>
            </div>
            <div className="flex justify-between">
              <span>Menge:</span>
              <span className="font-semibold">{parseFloat(quantity).toFixed(6)} {crypto.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span>Preis:</span>
              <span className="font-semibold">{formatPrice(crypto.current_price)}</span>
            </div>
            <div className="flex justify-between">
              <span>Gesamtbetrag:</span>
              <span className="font-semibold">{formatPrice(currentTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Strategie:</span>
              <span className="font-semibold">
                {tradeStrategies.find(s => s.id === strategy)?.name}
              </span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Abbrechen
            </Button>
            <Button 
              onClick={confirmTrade}
              variant={action === 'buy' ? 'default' : 'destructive'}
            >
              Bestätigen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TradeForm;
