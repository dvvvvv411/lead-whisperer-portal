
import { useEffect, useState } from "react";
import AdminRegisterComponent from "@/components/admin/AdminRegister";
import { checkUserRole } from "@/services/roleService";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLeadsOnly, setIsLeadsOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        const adminCheck = await checkUserRole('admin');
        setIsAdmin(adminCheck);
        
        // Check if user has leads_only restriction
        const { data: leadsOnlyData } = await supabase.rpc('is_leads_only_user', {
          user_id_param: data.session.user.id
        });
        
        setIsLeadsOnly(!!leadsOnlyData);
        
        // Leads-only users shouldn't access this page
        if (leadsOnlyData) {
          navigate("/admin/leads");
          return;
        }
        
        // If logged in, but not admin, redirect to user dashboard
        if (!adminCheck) {
          navigate("/nutzer");
        }
      }
      
      setLoading(false);
    };
    
    checkAdminStatus();
  }, [navigate]);

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
