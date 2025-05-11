
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

const WithdrawalTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Datum</TableHead>
        <TableHead>Benutzer</TableHead>
        <TableHead>Betrag</TableHead>
        <TableHead>Währung</TableHead>
        <TableHead>Wallet-Adresse</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Aktionen</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default WithdrawalTableHeader;
