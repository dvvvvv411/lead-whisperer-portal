
import { TableRow, TableCell } from "@/components/ui/table";
import WithdrawalStatusBadge from "./WithdrawalStatusBadge";
import WithdrawalActions from "./WithdrawalActions";

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

interface WithdrawalTableRowProps {
  withdrawal: Withdrawal;
  onApprove: (withdrawal: Withdrawal) => void;
  onReject: (withdrawal: Withdrawal) => void;
}

const WithdrawalTableRow = ({ 
  withdrawal, 
  onApprove, 
  onReject 
}: WithdrawalTableRowProps) => {
  return (
    <TableRow key={withdrawal.id}>
      <TableCell>
        {new Date(withdrawal.created_at).toLocaleDateString('de-DE')}
      </TableCell>
      <TableCell>{withdrawal.user_email}</TableCell>
      <TableCell>{(withdrawal.amount / 100).toFixed(2)}€</TableCell>
      <TableCell>{withdrawal.wallet_currency}</TableCell>
      <TableCell className="font-mono text-xs max-w-[200px] truncate">
        {withdrawal.wallet_address}
      </TableCell>
      <TableCell>
        <WithdrawalStatusBadge status={withdrawal.status} />
      </TableCell>
      <TableCell>
        <WithdrawalActions 
          withdrawal={withdrawal}
          onApprove={onApprove}
          onReject={onReject}
        />
      </TableCell>
    </TableRow>
  );
};

export default WithdrawalTableRow;
