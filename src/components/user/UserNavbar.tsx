
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useUserCredit } from "@/hooks/useUserCredit";
import UserNavbarLogo from "./navbar/UserNavbarLogo";
import DesktopNavigation from "./navbar/DesktopNavigation";
import MobileNavigation from "./navbar/MobileNavigation";
import UserCreditDisplay from "./navbar/UserCreditDisplay";
import LogoutButton from "./navbar/LogoutButton";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserNavbarProps {
  userId?: string;
  userEmail?: string;
  className?: string;
}

const UserNavbar = ({ userId, userEmail, className }: UserNavbarProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const { userCredit, loading: creditLoading, fetchUserCredit } = useUserCredit(userId);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsMounted(true);
    if (userId) {
      fetchUserCredit();
    }
  }, [userId, fetchUserCredit]);

  // Only render after mounting to avoid hydration errors
  if (!isMounted) return null;

  return (
    <header className={cn("w-full border-b border-gold/20 bg-casino-darker px-4 py-3", className)}>
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and title */}
        <UserNavbarLogo />
        
        {/* Desktop Navigation */}
        <DesktopNavigation />
        
        {/* User info and controls - only show on desktop */}
        {!isMobile && (
          <div className="flex items-center gap-4">
            {/* Credit display with animation */}
            <UserCreditDisplay userCredit={userCredit} loading={creditLoading} />
            
            {/* User email (visible on larger screens) */}
            {userEmail && (
              <div className="hidden md:block text-sm text-muted-foreground">
                {userEmail}
              </div>
            )}
            
            {/* Logout button */}
            <LogoutButton />
          </div>
        )}
      </div>
      
      {/* Mobile navigation with hamburger menu */}
      <MobileNavigation />
    </header>
  );
};

export default UserNavbar;
