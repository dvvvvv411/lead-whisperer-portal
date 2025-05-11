
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import WithdrawalStatusBadge from "./WithdrawalStatusBadge";
import { useEffect, useState } from "react";

interface Withdrawal {
  id: string;
  amount: number;
  wallet_currency: string;
  status: string;
  created_at: string;
  notes: string | null;
}

interface WithdrawalTableProps {
  withdrawals: Withdrawal[];
}

const WithdrawalTable = ({ withdrawals }: WithdrawalTableProps) => {
  const [localWithdrawals, setLocalWithdrawals] = useState<Withdrawal[]>(withdrawals);
  
  // Update local state when props change
  useEffect(() => {
    console.log("WithdrawalTable received updated withdrawals:", withdrawals);
    setLocalWithdrawals(withdrawals);
  }, [withdrawals]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Datum</TableHead>
          <TableHead>Betrag</TableHead>
          <TableHead>Währung</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Anmerkungen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {localWithdrawals.map((withdrawal) => (
          <TableRow key={withdrawal.id}>
            <TableCell>
              {new Date(withdrawal.created_at).toLocaleDateString('de-DE')}
            </TableCell>
            <TableCell>{(withdrawal.amount / 100).toFixed(2)}€</TableCell>
            <TableCell>{withdrawal.wallet_currency}</TableCell>
            <TableCell>
              <WithdrawalStatusBadge status={withdrawal.status} />
            </TableCell>
            <TableCell>
              {withdrawal.notes || "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default WithdrawalTable;
