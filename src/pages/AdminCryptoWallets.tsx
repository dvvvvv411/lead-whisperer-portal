
import { useEffect, useState } from "react";
import { checkUserRole } from "@/services/roleService";
import { supabase } from "@/integrations/supabase/client";
import { CryptoWalletManager } from "@/components/admin/CryptoWalletManager";

const AdminCryptoWallets = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        window.location.href = "/admin";
        return;
      }
      
      const adminCheck = await checkUserRole('admin');
      setIsAdmin(adminCheck);
      setLoading(false);
      
      // Wenn kein Admin, zum Benutzer-Dashboard weiterleiten
      if (!adminCheck) {
        window.location.href = "/nutzer";
      }
    };
    
    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Wird geladen...</p>
      </div>
    );
  }

  return isAdmin ? <CryptoWalletManager /> : null;
};

export default AdminCryptoWallets;
