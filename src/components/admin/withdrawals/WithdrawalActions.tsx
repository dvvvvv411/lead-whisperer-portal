
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface Withdrawal {
  id: string;
  user_id: string;
  user_email: string;
  amount: number;
  currency: string;
  wallet_currency: string;
  wallet_address: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface WithdrawalActionsProps {
  withdrawal: Withdrawal;
  onApprove: (withdrawal: Withdrawal) => void;
  onReject: (withdrawal: Withdrawal) => void;
}

const WithdrawalActions = ({ withdrawal, onApprove, onReject }: WithdrawalActionsProps) => {
  if (withdrawal.status !== "pending") {
    return (
      <span className="text-sm text-gray-500">
        {withdrawal.notes || "Keine Anmerkung"}
      </span>
    );
  }

  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        className="text-green-700 border-green-300 hover:bg-green-50"
        onClick={() => onApprove(withdrawal)}
      >
        <CheckCircle className="h-4 w-4 mr-1" />
        Genehmigen
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="text-red-700 border-red-300 hover:bg-red-50"
        onClick={() => onReject(withdrawal)}
      >
        <XCircle className="h-4 w-4 mr-1" />
        Ablehnen
      </Button>
    </div>
  );
};

export default WithdrawalActions;
