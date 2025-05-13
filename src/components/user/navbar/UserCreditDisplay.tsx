
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface UserCreditDisplayProps {
  userCredit: number | null;
  loading: boolean;
}

const UserCreditDisplay = ({ userCredit, loading }: UserCreditDisplayProps) => {
  const [prevCredit, setPrevCredit] = useState<number | null>(null);
  const [creditIncreased, setCreditIncreased] = useState<boolean | null>(null);
  
  // Animation effect when credit changes
  useEffect(() => {
    if (prevCredit !== null && userCredit !== null) {
      setCreditIncreased(userCredit > prevCredit);
      
      // Reset animation after 2 seconds
      const timeout = setTimeout(() => {
        setCreditIncreased(null);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
    
    // Store current credit for next comparison
    if (userCredit !== null && userCredit !== prevCredit) {
      setPrevCredit(userCredit);
    }
  }, [userCredit, prevCredit]);
  
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "0,00 €";
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  return (
    <div 
      className={cn(
        "px-4 py-2 rounded-md transition-all duration-500 shadow-md",
        creditIncreased === true ? "bg-gold/20 text-gold animate-pulse-gold" : 
        creditIncreased === false ? "bg-red-500/20 text-gold" : 
        "bg-casino-card"
      )}
    >
      <div className="text-xs text-white/80 mb-0.5 font-medium">Guthaben</div>
      <div className="font-bold text-lg text-white drop-shadow-sm">
        {loading ? (
          <span className="animate-pulse">...</span>
        ) : (
          formatCurrency(userCredit)
        )}
      </div>
    </div>
  );
};

export default UserCreditDisplay;
