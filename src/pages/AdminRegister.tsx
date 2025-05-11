
import { useEffect, useState } from "react";
import AdminRegisterComponent from "@/components/admin/AdminRegister";
import { checkUserRole } from "@/services/roleService";
import { supabase } from "@/integrations/supabase/client";

const RegisterPage = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        const adminCheck = await checkUserRole('admin');
        setIsAdmin(adminCheck);
        
        // Wenn eingeloggt, aber kein Admin, zum Benutzer-Dashboard weiterleiten
        if (!adminCheck) {
          window.location.href = "/nutzer";
        }
      }
      
      setLoading(false);
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

  return <AdminRegisterComponent />;
};

export default RegisterPage;
