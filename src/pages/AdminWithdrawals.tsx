
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import WithdrawalManager from "@/components/admin/withdrawals/WithdrawalManager";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const AdminWithdrawals = () => {
  const { user, authLoading, handleLogout } = useAdminAuth();

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Wird geladen...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <AdminNavbar />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Auszahlungen</h1>
        {user && <p className="text-gray-600">Angemeldet als: {user.email}</p>}
      </div>
      
      <WithdrawalManager />
    </div>
  );
};

export default AdminWithdrawals;
