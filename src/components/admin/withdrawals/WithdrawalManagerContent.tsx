
import WithdrawalTable from "./WithdrawalTable";
import WithdrawalLoadingState from "./WithdrawalLoadingState";

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

interface WithdrawalManagerContentProps {
  withdrawals: Withdrawal[];
  loading: boolean;
  onWithdrawalUpdated: () => void;
}

const WithdrawalManagerContent = ({ 
  withdrawals, 
  loading, 
  onWithdrawalUpdated 
}: WithdrawalManagerContentProps) => {
  if (loading) {
    return <WithdrawalLoadingState />;
  }
  
  return (
    <WithdrawalTable
      withdrawals={withdrawals}
      onWithdrawalUpdated={onWithdrawalUpdated}
    />
  );
};

export default WithdrawalManagerContent;
