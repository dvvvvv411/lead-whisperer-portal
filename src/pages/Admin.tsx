
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import AdminLogin from "@/components/admin/AdminLogin";
import LeadTable from "@/components/admin/LeadTable";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Fehler beim Abrufen der Session:", error);
      }
      
      setSession(data.session);
      setLoading(false);
    };
    
    checkSession();
    
    // Auth-Status-Änderungen überwachen
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Wird geladen...</p>
      </div>
    );
  }

  return (
    <div>
      {session ? <LeadTable /> : <AdminLogin />}
    </div>
  );
};

export default Admin;
