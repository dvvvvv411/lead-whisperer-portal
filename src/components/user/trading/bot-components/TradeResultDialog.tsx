
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { TrendingUpIcon } from "lucide-react";

interface TradeResultDialogProps {
  open: boolean;
  onClose: () => void;
  cryptoSymbol: string;
  cryptoName: string;
  profitAmount: number;
  profitPercentage: number;
  tradeAmount: number;
}

const TradeResultDialog = ({
  open,
  onClose,
  cryptoSymbol,
  cryptoName,
  profitAmount,
  profitPercentage,
  tradeAmount
}: TradeResultDialogProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <AlertDialog open={open} onOpenChange={() => onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-green-600">
            <TrendingUpIcon className="mr-2 h-5 w-5" />
            Trade erfolgreich ausgeführt!
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-md mt-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Kryptowährung:</div>
                <div>{cryptoSymbol} ({cryptoName})</div>
                
                <div className="font-medium">Handelsbetrag:</div>
                <div>{formatCurrency(tradeAmount)}</div>
                
                <div className="font-medium">Gewinn:</div>
                <div className="text-green-600 font-bold">
                  {formatCurrency(profitAmount)} ({profitPercentage.toFixed(2)}%)
                </div>
              </div>
            </div>
            <p className="text-xs text-center mt-4">
              Der Gewinn wurde deinem Guthaben gutgeschrieben.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>Schließen</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TradeResultDialog;
