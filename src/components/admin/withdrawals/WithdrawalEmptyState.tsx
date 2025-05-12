
import { TableRow, TableCell } from "@/components/ui/table";

const WithdrawalEmptyState = () => {
  return (
    <TableRow>
      <TableCell colSpan={7} className="text-center p-4 text-gray-400">
        Keine Auszahlungen vorhanden
      </TableCell>
    </TableRow>
  );
};

export default WithdrawalEmptyState;
