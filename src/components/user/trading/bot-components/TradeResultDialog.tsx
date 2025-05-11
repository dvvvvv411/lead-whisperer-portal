
import React, { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { TrendingUpIcon, Sparkles, Award, Star } from "lucide-react";
import { formatTradeDate } from "./simulation/simulationUtils";

interface TradeResultDialogProps {
  open: boolean;
  onClose: () => void;
  cryptoSymbol: string;
  cryptoName: string;
  profitAmount: number;
  profitPercentage: number;
  tradeAmount: number;
  buyPrice?: number;
  sellPrice?: number;
  quantity?: number;
  tradeDate?: Date;
}

const TradeResultDialog = ({
  open,
  onClose,
  cryptoSymbol,
  cryptoName,
  profitAmount,
  profitPercentage,
  tradeAmount,
  buyPrice,
  sellPrice,
  quantity,
  tradeDate = new Date()
}: TradeResultDialogProps) => {
  // Animation states
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateProfit, setAnimateProfit] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Display countup animation for profit
  const [displayedProfit, setDisplayedProfit] = useState(0);
  
  // Reset animations when dialog opens/closes
  useEffect(() => {
    if (open) {
      // Reset states
      setShowConfetti(false);
      setAnimateProfit(false);
      setShowDetails(false);
      setDisplayedProfit(0);
      
      // Start animation sequence
      const confettiTimer = setTimeout(() => setShowConfetti(true), 400);
      const profitTimer = setTimeout(() => setAnimateProfit(true), 700);
      const detailsTimer = setTimeout(() => setShowDetails(true), 1200);
      
      // Start profit counter animation
      let startValue = 0;
      const duration = 1500; // ms
      const interval = 30; // ms
      const steps = duration / interval;
      const increment = profitAmount / steps;
      let currentStep = 0;
      
      const counterInterval = setInterval(() => {
        currentStep++;
        const newValue = Math.min(profitAmount, startValue + (increment * currentStep));
        setDisplayedProfit(newValue);
        
        if (currentStep >= steps) {
          clearInterval(counterInterval);
          setDisplayedProfit(profitAmount);
        }
      }, interval);
      
      return () => {
        clearTimeout(confettiTimer);
        clearTimeout(profitTimer);
        clearTimeout(detailsTimer);
        clearInterval(counterInterval);
      };
    }
  }, [open, profitAmount]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  // Generate confetti particles
  const renderConfetti = () => {
    if (!showConfetti) return null;
    
    const particles = Array.from({ length: 80 }).map((_, i) => {
      const size = Math.floor(Math.random() * 8) + 5;
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 0.5;
      const color = i % 3 === 0 ? 'bg-gold' : (i % 3 === 1 ? 'bg-accent1' : 'bg-white');
      
      return (
        <div 
          key={i} 
          className={`absolute z-50 rounded-full ${color} animate-confetti`}
          style={{
            width: size + 'px',
            height: size + 'px',
            left: left + '%',
            animationDelay: animationDelay + 's',
            opacity: Math.random() * 0.8 + 0.2
          }}
        />
      );
    });
    
    return <div className="confetti-container absolute inset-0 overflow-hidden pointer-events-none">{particles}</div>;
  };

  return (
    <AlertDialog open={open} onOpenChange={() => onClose()}>
      <AlertDialogContent className="max-w-md bg-gradient-to-b from-casino-darker to-casino-card border border-gold/20 shadow-xl overflow-hidden">
        {renderConfetti()}
        
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold via-accent1 to-gold bg-[length:200%_auto] animate-gradient-shift"></div>
        
        <AlertDialogHeader className="relative">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20">
            <div className="absolute inset-0 bg-gradient-to-r from-gold to-accent1 rounded-full opacity-20 animate-pulse"></div>
          </div>
          
          <AlertDialogTitle className="flex items-center justify-center text-xl text-center pt-5">
            <div className="relative bg-gradient-to-r from-gold to-accent1 p-4 rounded-full shadow-glow mb-2">
              {animateProfit ? <Sparkles className="h-6 w-6 text-black animate-pulse" /> : <TrendingUpIcon className="h-6 w-6 text-black" />}
            </div>
          </AlertDialogTitle>
          
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-white">Trade erfolgreich!</h2>
            <div className={`text-3xl font-bold transition-all duration-700 ${animateProfit ? "scale-125 text-gold" : "text-white"}`}>
              {formatCurrency(displayedProfit)}
              <span className="text-lg ml-1 text-green-500">+{profitPercentage.toFixed(2)}%</span>
            </div>
          </div>
          
          <AlertDialogDescription className="space-y-5 mt-4">
            <div className={`transition-all duration-500 ${showDetails ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <div className="bg-casino-dark/50 backdrop-blur-sm p-4 rounded-md shadow-inner border border-gold/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent1/30 to-gold/30 flex items-center justify-center mr-2">
                      <span className="text-xs font-bold text-white">{cryptoSymbol}</span>
                    </div>
                    <span className="font-medium">{cryptoName}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-gold mr-1 fill-gold" />
                    <Star className="h-4 w-4 text-gold mr-1 fill-gold" />
                    <Star className="h-4 w-4 text-gold fill-gold" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-muted-foreground">Datum:</span>
                  </div>
                  <div className="text-right">{formatTradeDate(tradeDate)}</div>
                  
                  <div className="flex items-center">
                    <span className="text-muted-foreground">Handelsbetrag:</span>
                  </div>
                  <div className="text-right">{formatCurrency(tradeAmount)}</div>
                  
                  {quantity && (
                    <>
                      <div className="flex items-center">
                        <span className="text-muted-foreground">Menge:</span>
                      </div>
                      <div className="text-right">{quantity.toFixed(6)} {cryptoSymbol}</div>
                    </>
                  )}
                  
                  {buyPrice && (
                    <>
                      <div className="flex items-center">
                        <span className="text-muted-foreground">Kaufpreis:</span>
                      </div>
                      <div className="text-right">{formatCurrency(buyPrice)}</div>
                    </>
                  )}
                  
                  {sellPrice && (
                    <>
                      <div className="flex items-center">
                        <span className="text-muted-foreground">Verkaufspreis:</span>
                      </div>
                      <div className="text-right">{formatCurrency(sellPrice)}</div>
                    </>
                  )}
                  
                  <div className="flex items-center col-span-2 mt-2 pt-2 border-t border-gold/10">
                    <span className="text-muted-foreground">Gewinn:</span>
                    <div className="ml-auto text-green-500 font-bold text-base">
                      {formatCurrency(profitAmount)} ({profitPercentage.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`text-center transition-all duration-500 delay-300 ${showDetails ? "opacity-100" : "opacity-0"}`}>
              <div className="flex items-center justify-center gap-2">
                <Award className="h-5 w-5 text-gold animate-pulse" />
                <span className="text-sm text-gold/90">
                  Der Gewinn wurde deinem Guthaben gutgeschrieben
                </span>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="mt-4">
          <AlertDialogAction 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-gold to-accent1 hover:from-gold hover:to-gold text-black font-medium transition-all duration-300"
          >
            Schließen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TradeResultDialog;
