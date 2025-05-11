
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import WithdrawalStatusBadge from "./WithdrawalStatusBadge";

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
        {withdrawals.map((withdrawal) => (
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
