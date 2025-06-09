
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Users, Gift, Euro } from "lucide-react";
import { useAffiliate } from "@/hooks/useAffiliate";
import { motion } from "framer-motion";

interface AffiliateOverviewProps {
  userId: string;
}

const AffiliateOverview = ({ userId }: AffiliateOverviewProps) => {
  const { affiliateData, invitations, loading, copyAffiliateLink } = useAffiliate(userId);

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
      {/* Stats Cards */}
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
                  <p className="text-sm text-gray-400">Einladungen</p>
                  <p className="text-2xl font-bold text-white">{affiliateData?.totalInvitations || 0}</p>
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
                  <p className="text-2xl font-bold text-white">{affiliateData?.totalBonusesPaid || 0}</p>
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
                    {((affiliateData?.totalBonusAmount || 0) / 100).toFixed(2)}€
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Affiliate Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="border-gold/10 bg-casino-card">
          <CardHeader>
            <CardTitle className="text-white">Ihr Affiliate-Link</CardTitle>
            <CardDescription className="text-gray-400">
              Teilen Sie diesen Link mit Freunden und erhalten Sie 50€ für jede erfolgreiche Aktivierung
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="flex-1 p-3 bg-casino-darker rounded border border-gold/10">
                <code className="text-sm text-gray-300">
                  {affiliateData?.code ? `${window.location.origin}/?ref=${affiliateData.code}` : 'Laden...'}
                </code>
              </div>
              <Button 
                onClick={copyAffiliateLink}
                className="bg-gold hover:bg-gold/90 text-casino-darker"
              >
                <Copy className="h-4 w-4 mr-2" />
                Kopieren
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Invitations List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="border-gold/10 bg-casino-card">
          <CardHeader>
            <CardTitle className="text-white">Ihre Einladungen</CardTitle>
            <CardDescription className="text-gray-400">
              Übersicht über alle Ihre Affiliate-Einladungen
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invitations.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Noch keine Einladungen vorhanden.</p>
                <p className="text-sm">Teilen Sie Ihren Affiliate-Link, um zu beginnen!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {invitations.map((invitation) => (
                  <div 
                    key={invitation.id}
                    className="flex items-center justify-between p-4 border border-gold/10 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">{invitation.invitedUserEmail}</p>
                      <p className="text-sm text-gray-400">
                        Eingeladen am {new Date(invitation.invitedAt).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {invitation.bonusPaidToInviter ? (
                        <Badge className="bg-green-600 hover:bg-green-600">
                          Bonus erhalten
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                          Warten auf Aktivierung
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AffiliateOverview;
