
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import WithdrawalTable from "./WithdrawalTable";
import WithdrawalLoading from "./WithdrawalLoading";
import WithdrawalEmptyState from "./WithdrawalEmptyState";
import { useWithdrawalHistory } from "@/hooks/useWithdrawalHistory";

interface WithdrawalHistoryProps {
  userId?: string;
}

const WithdrawalHistory = ({ userId }: WithdrawalHistoryProps) => {
  const { withdrawals, loading, fetchWithdrawals } = useWithdrawalHistory(userId);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWithdrawals();
    setTimeout(() => setRefreshing(false), 500); // Show refreshing state for at least 500ms
  };

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Auszahlungsverlauf</CardTitle>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleRefresh} 
          disabled={loading || refreshing}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <WithdrawalLoading />
        ) : withdrawals.length > 0 ? (
          <WithdrawalTable withdrawals={withdrawals} />
        ) : (
          <WithdrawalEmptyState />
        )}
      </CardContent>
    </Card>
  );
};

export default WithdrawalHistory;
