import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TotalPayoutManager } from "@/components/admin/total-payouts/TotalPayoutManager";
import { useToast } from "@/hooks/use-toast";

const AdminTotalPayouts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if user is admin
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);

      const isAdmin = roles?.some(role => role.role === 'admin');
      
      if (!isAdmin) {
        toast({
          title: "Zugriff verweigert",
          description: "Sie haben keine Berechtigung für diese Seite.",
          variant: "destructive"
        });
        navigate("/");
        return;
      }
    };

    checkAuth();
  }, [navigate, toast]);

  return <TotalPayoutManager />;
};

export default AdminTotalPayouts;