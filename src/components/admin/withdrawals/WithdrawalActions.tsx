
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

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
      <span className="text-sm text-gray-400">
        {withdrawal.notes || "Keine Anmerkung"}
      </span>
    );
  }

  return (
    <div className="flex space-x-2">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-green-900/20 border-green-500/30 hover:bg-green-800/30 text-green-400"
          onClick={() => onApprove(withdrawal)}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Genehmigen
        </Button>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-red-900/20 border-red-500/30 hover:bg-red-800/30 text-red-400"
          onClick={() => onReject(withdrawal)}
        >
          <XCircle className="h-4 w-4 mr-1" />
          Ablehnen
        </Button>
      </motion.div>
    </div>
  );
};

export default WithdrawalActions;
