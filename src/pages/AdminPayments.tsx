
import { useEffect, useState } from "react";
import { checkUserRole } from "@/services/roleService";
import { PaymentManager } from "@/components/admin/payments/PaymentManager";

const AdminPayments = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
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

  return isAdmin ? <PaymentManager /> : null;
};

export default AdminPayments;
