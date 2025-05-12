
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WalletLoadingStateProps {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const WalletLoadingState = ({ loading, error, onRetry }: WalletLoadingStateProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2 text-gold-light" />
        <span className="text-white/80">Zahlungsmethoden werden geladen...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-900/20 backdrop-blur-sm p-4 rounded-md border border-red-500/30 flex items-start">
        <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
        <div>
          <p className="text-red-200">{error}</p>
          <Button 
            variant="outline" 
            onClick={onRetry} 
            className="mt-2 border-red-500/30 text-red-200 hover:bg-red-900/30"
          >
            Erneut versuchen
          </Button>
        </div>
      </div>
    );
  }
  
  return null;
};

export default WalletLoadingState;
