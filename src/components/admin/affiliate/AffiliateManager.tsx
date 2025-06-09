
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Euro, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AffiliateStatistic {
  inviter_email: string;
  inviter_id: string;
  affiliate_code: string;
  total_invitations: number;
  total_bonuses_paid: number;
  total_bonus_amount: number;
}

const AffiliateManager = () => {
  const { toast } = useToast();
  const [affiliateStats, setAffiliateStats] = useState<AffiliateStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    totalUsers: 0,
    totalInvitations: 0,
    totalBonusesPaid: 0,
    totalAmountPaid: 0
  });

  useEffect(() => {
    fetchAffiliateStatistics();
  }, []);

  const fetchAffiliateStatistics = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('get_affiliate_statistics');
      
      if (error) throw error;
      
      setAffiliateStats(data || []);
      
      // Calculate total statistics
      const totalUsers = data?.length || 0;
      const totalInvitations = data?.reduce((sum, stat) => sum + stat.total_invitations, 0) || 0;
      const totalBonusesPaid = data?.reduce((sum, stat) => sum + stat.total_bonuses_paid, 0) || 0;
      const totalAmountPaid = data?.reduce((sum, stat) => sum + stat.total_bonus_amount, 0) || 0;
      
      setTotalStats({
        totalUsers,
        totalInvitations,
        totalBonusesPaid,
        totalAmountPaid: totalAmountPaid / 100 // Convert from cents to euros
      });
      
    } catch (error: any) {
      console.error('Error fetching affiliate statistics:', error);
      toast({
        title: "Fehler beim Laden der Affiliate-Statistiken",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-casino-card border-gold/10">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-600 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-600 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-casino-card border-gold/10">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-600 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-casino-card border-gold/10">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Aktive Einlader</p>
                <div className="text-2xl font-bold text-white">{totalStats.totalUsers}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-casino-card border-gold/10">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Gesamt Einladungen</p>
                <div className="text-2xl font-bold text-white">{totalStats.totalInvitations}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-casino-card border-gold/10">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-yellow-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Boni ausgezahlt</p>
                <div className="text-2xl font-bold text-white">{totalStats.totalBonusesPaid}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-casino-card border-gold/10">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Euro className="h-8 w-8 text-gold" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Gesamt ausgezahlt</p>
                <div className="text-2xl font-bold text-white">{totalStats.totalAmountPaid.toFixed(0)}€</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Affiliates Table */}
      <Card className="bg-casino-card border-gold/10">
        <CardHeader>
          <CardTitle className="text-gold">Top Affiliate-Partner</CardTitle>
          <CardDescription className="text-gray-300">
            Übersicht der besten Einlader nach Anzahl der erfolgreichen Empfehlungen
          </CardDescription>
        </CardHeader>
        <CardContent>
          {affiliateStats.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">Keine Affiliate-Daten verfügbar</h3>
              <p className="text-gray-500">Es wurden noch keine Einladungen erstellt.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gold/20">
                    <TableHead className="text-gray-300">Rank</TableHead>
                    <TableHead className="text-gray-300">E-Mail</TableHead>
                    <TableHead className="text-gray-300">Affiliate-Code</TableHead>
                    <TableHead className="text-gray-300">Einladungen</TableHead>
                    <TableHead className="text-gray-300">Erfolgreiche Boni</TableHead>
                    <TableHead className="text-gray-300">Verdient</TableHead>
                    <TableHead className="text-gray-300">Erfolgsrate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliateStats.map((stat, index) => {
                    const successRate = stat.total_invitations > 0 
                      ? ((stat.total_bonuses_paid / stat.total_invitations) * 100) 
                      : 0;
                    
                    return (
                      <TableRow key={stat.inviter_id} className="border-gold/10">
                        <TableCell>
                          <div className="flex items-center">
                            {index === 0 && <Award className="h-4 w-4 text-yellow-400 mr-1" />}
                            {index === 1 && <Award className="h-4 w-4 text-gray-400 mr-1" />}
                            {index === 2 && <Award className="h-4 w-4 text-yellow-600 mr-1" />}
                            <span className="text-white font-medium">#{index + 1}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-white font-medium">
                          {stat.inviter_email}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-gold/30 text-gold font-mono">
                            {stat.affiliate_code}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          {stat.total_invitations}
                        </TableCell>
                        <TableCell className="text-green-400 font-medium">
                          {stat.total_bonuses_paid}
                        </TableCell>
                        <TableCell className="text-gold font-medium">
                          {(stat.total_bonus_amount / 100).toFixed(0)}€
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={successRate >= 50 ? "default" : "secondary"}
                            className={successRate >= 50 ? "bg-green-600" : "bg-gray-600"}
                          >
                            {successRate.toFixed(1)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateManager;
