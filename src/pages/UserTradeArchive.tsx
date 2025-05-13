
import { useEffect } from "react";
import { UserAuthWrapper } from "@/components/user/auth/UserAuthWrapper";
import { UserNavbar } from "@/components/user/UserNavbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useUserCredit } from "@/hooks/useUserCredit";
import { Skeleton } from "@/components/ui/skeleton";
import TradeArchiveContent from "@/components/user/trading/archive/TradeArchiveContent";

const UserTradeArchive = () => {
  const { user, loading } = useUserAuth();
  const { userCredit, loading: creditLoading, fetchUserCredit } = useUserCredit();
  
  useEffect(() => {
    if (user?.id) {
      fetchUserCredit();
    }
  }, [user?.id, fetchUserCredit]);

  return (
    <UserAuthWrapper>
      <div className="min-h-screen bg-casino-background text-white">
        <UserNavbar userCredit={userCredit} />
        
        <div className="container mx-auto px-4 py-8">
          <Card className="border-casino-card bg-casino-card text-white shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Trading-Archiv</CardTitle>
              <CardDescription className="text-gray-300">
                Vollständige Übersicht aller KI-Bot Trading-Aktivitäten
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full bg-gray-800/50" />
                  <Skeleton className="h-64 w-full bg-gray-800/50" />
                </div>
              ) : (
                <TradeArchiveContent userId={user?.id} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </UserAuthWrapper>
  );
};

export default UserTradeArchive;
