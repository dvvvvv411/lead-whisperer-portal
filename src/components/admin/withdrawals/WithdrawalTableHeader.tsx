
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

const WithdrawalTableHeader = () => {
  return (
    <TableHeader className="bg-casino-darker">
      <TableRow className="border-gold/10">
        <TableHead className="text-gray-300">Datum</TableHead>
        <TableHead className="text-gray-300">Benutzer</TableHead>
        <TableHead className="text-gray-300">Betrag</TableHead>
        <TableHead className="text-gray-300">Währung</TableHead>
        <TableHead className="text-gray-300">Wallet-Adresse</TableHead>
        <TableHead className="text-gray-300">Status</TableHead>
        <TableHead className="text-gray-300">Aktionen</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default WithdrawalTableHeader;
