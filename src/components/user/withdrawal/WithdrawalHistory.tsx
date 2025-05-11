
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import WithdrawalTable from "./WithdrawalTable";
import WithdrawalLoading from "./WithdrawalLoading";
import WithdrawalEmptyState from "./WithdrawalEmptyState";
import { useWithdrawalHistory } from "@/hooks/useWithdrawalHistory";

interface WithdrawalHistoryProps {
  userId?: string;
}

const WithdrawalHistory = ({ userId }: WithdrawalHistoryProps) => {
  const { withdrawals, loading } = useWithdrawalHistory(userId);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Auszahlungsverlauf</CardTitle>
      </CardHeader>
      
      {loading ? (
        <WithdrawalLoading />
      ) : withdrawals.length > 0 ? (
        <WithdrawalTable withdrawals={withdrawals} />
      ) : (
        <WithdrawalEmptyState />
      )}
    </Card>
  );
};

export default WithdrawalHistory;
