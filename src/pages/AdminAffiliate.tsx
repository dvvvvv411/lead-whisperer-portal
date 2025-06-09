
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AffiliateManager from "@/components/admin/affiliate/AffiliateManager";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const AdminAffiliate = () => {
  const { user, authLoading, handleLogout } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-casino-darker flex items-center justify-center">
        <div className="text-white">Laden...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-casino-darker">
      <AdminNavbar />
      <main className="container mx-auto px-4 py-8">
        <AffiliateManager />
      </main>
    </div>
  );
};

export default AdminAffiliate;
