
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Gift, Euro, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface AffiliateStats {
  inviterEmail: string;
  inviterId: string;
  affiliateCode: string;
  totalInvitations: number;
  totalBonusesPaid: number;
  totalBonusAmount: number;
}

const AdminAffiliateOverview = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<AffiliateStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    totalInvitations: 0,
    totalBonuses: 0,
    totalAmount: 0
  });

  useEffect(() => {
    const fetchAffiliateStats = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase.rpc('get_affiliate_statistics');
        
        if (error) throw error;
        
        setStats(data || []);
        
        // Calculate totals
        const totals = (data || []).reduce((acc, curr) => ({
          totalInvitations: acc.totalInvitations + curr.total_invitations,
          totalBonuses: acc.totalBonuses + curr.total_bonuses_paid,
          totalAmount: acc.totalAmount + curr.total_bonus_amount
        }), { totalInvitations: 0, totalBonuses: 0, totalAmount: 0 });
        
        setTotalStats(totals);
      } catch (error: any) {
        console.error("Error fetching affiliate statistics:", error);
        toast({
          title: "Fehler",
          description: "Affiliate-Statistiken konnten nicht geladen werden",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliateStats();
  }, [toast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-gold/10 bg-casino-card">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Total Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-gold/10 bg-casino-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-400" />
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Gesamt Einladungen</p>
                  <p className="text-2xl font-bold text-white">{totalStats.totalInvitations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border-gold/10 bg-casino-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Gift className="h-8 w-8 text-green-400" />
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Bezahlte Boni</p>
                  <p className="text-2xl font-bold text-white">{totalStats.totalBonuses}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border-gold/10 bg-casino-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Euro className="h-8 w-8 text-gold" />
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Gesamt Bonus</p>
                  <p className="text-2xl font-bold text-white">
                    {(totalStats.totalAmount / 100).toFixed(2)}€
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Affiliate Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="border-gold/10 bg-casino-card">
          <CardHeader>
            <CardTitle className="text-white">Affiliate Benutzer</CardTitle>
            <CardDescription className="text-gray-400">
              Übersicht über alle aktiven Affiliate-Partner
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Noch keine Affiliate-Partner vorhanden.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold/10">
                      <th className="text-left p-4 text-gray-300">Benutzer</th>
                      <th className="text-left p-4 text-gray-300">Code</th>
                      <th className="text-center p-4 text-gray-300">Einladungen</th>
                      <th className="text-center p-4 text-gray-300">Bezahlte Boni</th>
                      <th className="text-right p-4 text-gray-300">Gesamt Bonus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((stat) => (
                      <tr key={stat.inviterId} className="border-b border-gold/10 hover:bg-casino-highlight">
                        <td className="p-4">
                          <div>
                            <p className="text-white font-medium">{stat.inviterEmail}</p>
                            <p className="text-xs text-gray-400">{stat.inviterId}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="border-gold text-gold">
                            {stat.affiliateCode}
                          </Badge>
                        </td>
                        <td className="p-4 text-center text-white">{stat.totalInvitations}</td>
                        <td className="p-4 text-center text-white">{stat.totalBonusesPaid}</td>
                        <td className="p-4 text-right text-white font-mono">
                          {(stat.totalBonusAmount / 100).toFixed(2)}€
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminAffiliateOverview;
