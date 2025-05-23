
import { useEffect } from "react";
import UserAuthWrapper from "@/components/user/auth/UserAuthWrapper";
import UserNavbar from "@/components/user/UserNavbar";
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
    <UserAuthWrapper redirectTo="/auth">
      {(authUser) => (
        <div className="min-h-screen bg-gradient-to-b from-casino-dark to-casino-darker text-white">
          <UserNavbar userId={authUser?.id} userEmail={authUser?.email} />
          
          <div className="container mx-auto px-4 py-8">
            <Card className="backdrop-blur-xl bg-black/40 border-gold/20 shadow-md">
              <CardHeader className="border-b border-gold/10 pb-4">
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold-light to-amber-500">Trading-Archiv</CardTitle>
                <CardDescription className="text-gray-300">
                  Vollständige Übersicht aller KI-Bot Trading-Aktivitäten
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full bg-gray-800/30" />
                    <Skeleton className="h-64 w-full bg-gray-800/30" />
                  </div>
                ) : (
                  <TradeArchiveContent userId={authUser?.id} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </UserAuthWrapper>
  );
};

export default UserTradeArchive;
