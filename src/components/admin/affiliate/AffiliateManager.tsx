
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminNavbar } from "../AdminNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Users, Gift, TrendingUp, Euro } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface AffiliateStats {
  inviter_email: string;
  inviter_id: string;
  affiliate_code: string;
  total_invitations: number;
  total_bonuses_paid: number;
  total_bonus_amount: number;
}

export const AffiliateManager = () => {
  const { toast } = useToast();
  const [affiliateStats, setAffiliateStats] = useState<AffiliateStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    totalInviters: 0,
    totalInvitations: 0,
    totalBonusesPaid: 0,
    totalBonusAmount: 0
  });

  useEffect(() => {
    fetchAffiliateStats();
  }, []);

  const fetchAffiliateStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_affiliate_statistics');

      if (error) throw error;

      setAffiliateStats(data || []);
      
      // Calculate totals
      const totals = (data || []).reduce((acc, stat) => ({
        totalInviters: acc.totalInviters + 1,
        totalInvitations: acc.totalInvitations + stat.total_invitations,
        totalBonusesPaid: acc.totalBonusesPaid + stat.total_bonuses_paid,
        totalBonusAmount: acc.totalBonusAmount + stat.total_bonus_amount
      }), { totalInviters: 0, totalInvitations: 0, totalBonusesPaid: 0, totalBonusAmount: 0 });

      setTotalStats(totals);
    } catch (error) {
      console.error('Error fetching affiliate stats:', error);
      toast({
        title: "Fehler",
        description: "Affiliate-Statistiken konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-casino-darker text-gray-300">
      <AdminNavbar />
      
      <div className="container mx-auto p-4">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
            Affiliate-Verwaltung
          </h1>
          <p className="text-gray-400">Übersicht über alle Affiliate-Aktivitäten</p>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-casino-card border-gold/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-400" />
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-white">{totalStats.totalInviters}</div>
                    <div className="text-sm text-gray-400">Aktive Werber</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-casino-card border-gold/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-white">{totalStats.totalInvitations}</div>
                    <div className="text-sm text-gray-400">Gesamt Einladungen</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-casino-card border-gold/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Gift className="h-8 w-8 text-purple-400" />
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-white">{totalStats.totalBonusesPaid}</div>
                    <div className="text-sm text-gray-400">Bezahlte Boni</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-casino-card border-gold/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Euro className="h-8 w-8 text-gold" />
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gold">{(totalStats.totalBonusAmount / 100).toFixed(0)}€</div>
                    <div className="text-sm text-gray-400">Gesamt Boni</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Affiliate Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="bg-casino-card border-gold/20">
            <CardHeader>
              <CardTitle className="text-gold">Affiliate-Übersicht</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="h-8 w-8 rounded-full border-2 border-t-gold border-casino-card animate-spin"></div>
                </div>
              ) : (
                <div className="rounded-md">
                  <Table>
                    <TableHeader className="bg-casino-darker">
                      <TableRow className="border-gold/10">
                        <TableHead className="text-gray-300">E-Mail</TableHead>
                        <TableHead className="text-gray-300">Affiliate-Code</TableHead>
                        <TableHead className="text-gray-300">Einladungen</TableHead>
                        <TableHead className="text-gray-300">Erfolgreiche Boni</TableHead>
                        <TableHead className="text-gray-300">Verdient</TableHead>
                        <TableHead className="text-gray-300">Erfolgsrate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {affiliateStats.length === 0 ? (
                        <TableRow className="border-t border-gold/10">
                          <TableCell colSpan={6} className="text-center py-6 text-gray-400">
                            Keine Affiliate-Daten gefunden
                          </TableCell>
                        </TableRow>
                      ) : (
                        affiliateStats.map((stat, index) => {
                          const successRate = stat.total_invitations > 0 
                            ? (stat.total_bonuses_paid / stat.total_invitations * 100).toFixed(1)
                            : '0';
                          
                          return (
                            <motion.tr
                              key={stat.inviter_id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="border-t border-gold/10 hover:bg-casino-highlight"
                            >
                              <TableCell className="text-gray-300">{stat.inviter_email}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-gold border-gold/50">
                                  {stat.affiliate_code}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gray-300">{stat.total_invitations}</TableCell>
                              <TableCell className="text-green-400">{stat.total_bonuses_paid}</TableCell>
                              <TableCell className="text-gold font-medium">
                                {(stat.total_bonus_amount / 100).toFixed(0)}€
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={parseFloat(successRate) > 50 ? "default" : "outline"}
                                  className={parseFloat(successRate) > 50 
                                    ? "bg-green-600/30 text-green-400 border-green-500/50" 
                                    : "bg-gray-800/30 text-gray-300 border-gray-500/50"
                                  }
                                >
                                  {successRate}%
                                </Badge>
                              </TableCell>
                            </motion.tr>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
