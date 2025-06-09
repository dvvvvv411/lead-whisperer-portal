
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function useAdminAuth() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Enhanced user session management with hardcoded admin check
  useEffect(() => {
    console.log("useAdminAuth: Setting up enhanced auth monitoring with hardcoded admin check");
    
    // Set up the auth listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("useAdminAuth: Auth state changed:", event);
      
      if (session?.user) {
        console.log("useAdminAuth: User session updated:", session.user.email);
        setUser(session.user);
        
        // Check admin status after setting user
        await checkAdminStatus(session.user);
      } else if (event === 'SIGNED_OUT') {
        console.log("useAdminAuth: User signed out");
        setUser(null);
        setIsAdminUser(false);
        navigate("/");
      }
    });
    
    // Then get the current status
    const getUser = async () => {
      try {
        console.log("useAdminAuth: Getting current user session");
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("useAdminAuth: Error fetching user:", error);
          // Don't redirect immediately - let components handle their own access control
          setUser(null);
          setIsAdminUser(false);
          setAuthLoading(false);
          return;
        }
        
        if (data?.user) {
          console.log("useAdminAuth: User found:", data.user.email);
          setUser(data.user);
          await checkAdminStatus(data.user);
        } else {
          console.log("useAdminAuth: No user found");
          setUser(null);
          setIsAdminUser(false);
        }
      } catch (err) {
        console.error("useAdminAuth: Unexpected error:", err);
        setUser(null);
        setIsAdminUser(false);
      } finally {
        setAuthLoading(false);
      }
    };
    
    // Function to check admin status with hardcoded check first
    const checkAdminStatus = async (user: any) => {
      try {
        console.log("useAdminAuth: Checking admin status for user:", user.id);
        
        // Enhanced hardcoded admin check for both special users
        if (user.id === "7eccf781-5911-4d90-a683-1df251069a2f" || 
            user.id === "054c7ee0-7f82-4e34-a0c0-45552f6a67f8") {
          console.log(`useAdminAuth: Hardcoded admin access granted to user with ID: ${user.id}`);
          setIsAdminUser(true);
          return;
        }
        
        // For other users, check admin role with proper error handling
        console.log(`useAdminAuth: Checking admin role via RPC for user: ${user.id}`);
        
        const { data: isAdmin, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });
        
        if (error) {
          console.error("useAdminAuth: Error checking admin role:", error);
          console.log("useAdminAuth: Falling back to non-admin access due to RPC error");
          setIsAdminUser(false);
        } else {
          console.log(`useAdminAuth: Admin role check result for user ${user.id}: ${isAdmin ? "Is admin" : "Not admin"}`);
          setIsAdminUser(isAdmin || false);
        }
      } catch (err) {
        console.error("useAdminAuth: Unexpected error during admin status check:", err);
        setIsAdminUser(false);
      }
    };
    
    getUser();
    
    // Cleanup
    return () => {
      console.log("useAdminAuth: Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      console.log("useAdminAuth: Initiating logout");
      await supabase.auth.signOut();
      toast({
        title: "Erfolgreich abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet."
      });
      navigate("/");
    } catch (error) {
      console.error("useAdminAuth: Error during logout:", error);
      toast({
        title: "Fehler beim Abmelden",
        description: "Es gab ein Problem beim Abmelden.",
        variant: "destructive"
      });
    }
  };

  return {
    user,
    authLoading,
    isAdminUser,
    handleLogout
  };
}
