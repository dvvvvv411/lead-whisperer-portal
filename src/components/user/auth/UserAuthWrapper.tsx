
import { Loader2 } from "lucide-react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useUserAuth } from "@/hooks/useUserAuth";

interface UserAuthWrapperProps {
  children: React.ReactNode;
  onUserLoaded: (user: any) => void;
  redirectToActivation?: boolean;
}

const UserAuthWrapper = ({ 
  children, 
  onUserLoaded,
  redirectToActivation = true 
}: UserAuthWrapperProps) => {
  // Set up credit change subscription
  const {
    user,
    loading,
    userCredit,
    creditLoading
  } = useUserAuth({
    redirectToActivation,
    onUserLoaded
  });

  // Handle redirection logic
  useAuthRedirect({
    userId: user?.id,
    userCredit,
    creditLoading,
    redirectToActivation
  });
  
  if (loading || creditLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Wird geladen...</p>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default UserAuthWrapper;
