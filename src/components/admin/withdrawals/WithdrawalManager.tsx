
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WithdrawalManagerContent from "./WithdrawalManagerContent";
import { useAdminWithdrawals } from "@/hooks/useAdminWithdrawals";

const WithdrawalManager = () => {
  const { withdrawals, loading, fetchWithdrawals } = useAdminWithdrawals();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auszahlungen verwalten</CardTitle>
        <CardDescription>Bearbeiten Sie Auszahlungsanfragen von Nutzern</CardDescription>
      </CardHeader>
      <CardContent>
        <WithdrawalManagerContent
          withdrawals={withdrawals}
          loading={loading}
          onWithdrawalUpdated={fetchWithdrawals}
        />
      </CardContent>
    </Card>
  );
};

export default WithdrawalManager;
