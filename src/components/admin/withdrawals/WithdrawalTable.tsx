
import { useState, useEffect } from "react";
import { Table, TableBody } from "@/components/ui/table";
import WithdrawalTableHeader from "./WithdrawalTableHeader";
import WithdrawalTableRow from "./WithdrawalTableRow";
import WithdrawalEmptyState from "./WithdrawalEmptyState";
import WithdrawalActionDialog from "./WithdrawalActionDialog";
import { useWithdrawalActions } from "@/hooks/useWithdrawalActions";

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

interface WithdrawalTableProps {
  withdrawals: Withdrawal[];
  onWithdrawalUpdated: () => void;
}

const WithdrawalTable = ({ withdrawals, onWithdrawalUpdated }: WithdrawalTableProps) => {
  const [updatedWithdrawals, setUpdatedWithdrawals] = useState<Withdrawal[]>(withdrawals);
  const {
    selectedWithdrawal,
    dialogOpen,
    dialogAction,
    notes,
    processing,
    handleApproveClick,
    handleRejectClick,
    handleDialogClose,
    handleConfirmAction,
    handleNotesChange
  } = useWithdrawalActions(onWithdrawalUpdated);

  // Update local state when props change
  useEffect(() => {
    setUpdatedWithdrawals(withdrawals);
  }, [withdrawals]);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <WithdrawalTableHeader />
          <TableBody>
            {updatedWithdrawals.length === 0 ? (
              <WithdrawalEmptyState />
            ) : (
              updatedWithdrawals.map((withdrawal) => (
                <WithdrawalTableRow
                  key={withdrawal.id}
                  withdrawal={withdrawal}
                  onApprove={handleApproveClick}
                  onReject={handleRejectClick}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <WithdrawalActionDialog
        selectedWithdrawal={selectedWithdrawal}
        dialogOpen={dialogOpen}
        dialogAction={dialogAction}
        notes={notes}
        processing={processing}
        onNotesChange={handleNotesChange}
        onConfirm={handleConfirmAction}
        onClose={handleDialogClose}
      />
    </>
  );
};

export default WithdrawalTable;
