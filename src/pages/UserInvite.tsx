
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import UserNavbar from "@/components/user/UserNavbar";
import { InviteFriendsTab } from "@/components/user/invite/InviteFriendsTab";

const UserInvite = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getUser();
        
        if (data?.user) {
          setUser(data.user);
        } else {
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Error checking user:", error);
        navigate("/");
        return;
      } finally {
        setLoading(false);
      }
    };
    
    getUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-casino-dark">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-gold border-casino-card animate-spin mb-4"></div>
          <p className="text-muted-foreground">Wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-casino-darker to-casino-dark dark">
      <UserNavbar userId={user?.id} userEmail={user?.email} />
      
      <main className="flex-1 container mx-auto p-4">
        <InviteFriendsTab userId={user?.id} />
      </main>
    </div>
  );
};

export default UserInvite;
