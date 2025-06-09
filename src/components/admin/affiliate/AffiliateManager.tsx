
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAffiliate } from '@/hooks/useAffiliate';
import { Users, Gift, TrendingUp, RefreshCw } from 'lucide-react';

const AffiliateManager = () => {
  const { stats, loading, fetchAffiliateStats } = useAffiliate();

  useEffect(() => {
    fetchAffiliateStats();
  }, []);

  const totalStats = stats.reduce((acc, stat) => ({
    totalInvitations: acc.totalInvitations + Number(stat.total_invitations),
    totalBonusesPaid: acc.totalBonusesPaid + Number(stat.total_bonuses_paid),
    totalBonusAmount: acc.totalBonusAmount + stat.total_bonus_amount
  }), { totalInvitations: 0, totalBonusesPaid: 0, totalBonusAmount: 0 });

  const formatCurrency = (cents: number) => {
    return `€${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Affiliate-Verwaltung</h1>
          <p className="text-gray-400 mt-1">
            Übersicht über alle Affiliate-Aktivitäten und Statistiken
          </p>
        </div>
        <Button
          onClick={fetchAffiliateStats}
          disabled={loading}
          className="bg-gold hover:bg-gold-light text-black font-medium"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Aktualisieren
        </Button>
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-casino-card border-gold/20">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Gesamt Einladungen</p>
                <p className="text-2xl font-bold text-white">{totalStats.totalInvitations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-casino-card border-gold/20">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Gift className="h-8 w-8 text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Bezahlte Boni</p>
                <p className="text-2xl font-bold text-white">{totalStats.totalBonusesPaid}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-casino-card border-gold/20">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-gold" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Gesamt ausgezahlt</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(totalStats.totalBonusAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Stats Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-casino-card border-gold/20">
          <CardHeader>
            <CardTitle className="text-white">Affiliate-Übersicht</CardTitle>
            <CardDescription>
              Detaillierte Statistiken für alle Benutzer mit Affiliate-Aktivität
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <RefreshCw className="h-8 w-8 animate-spin text-gold" />
              </div>
            ) : stats.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Keine Affiliate-Aktivitäten gefunden</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Benutzer</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Code</th>
                      <th className="text-center py-3 px-4 text-gray-300 font-medium">Einladungen</th>
                      <th className="text-center py-3 px-4 text-gray-300 font-medium">Bezahlte Boni</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-medium">Verdient</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((stat) => (
                      <tr key={stat.inviter_id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-white font-medium">{stat.inviter_email}</p>
                            <p className="text-gray-400 text-xs">{stat.inviter_id}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-gold border-gold/50">
                            {stat.affiliate_code}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-white font-medium">{stat.total_invitations}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-green-400 font-medium">{stat.total_bonuses_paid}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-gold font-bold">
                            {formatCurrency(stat.total_bonus_amount)}
                          </span>
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

export default AffiliateManager;
