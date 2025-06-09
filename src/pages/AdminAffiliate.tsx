
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import AffiliateManager from "@/components/admin/affiliate/AffiliateManager";

const AdminAffiliate = () => {
  const { loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-casino-darker flex items-center justify-center">
        <div className="text-white">Lädt...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-casino-darker">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Affiliate-Management</h1>
          <p className="text-gray-300">Verwaltung und Übersicht der Affiliate-Partner</p>
        </div>
        <AffiliateManager />
      </div>
    </div>
  );
};

export default AdminAffiliate;
