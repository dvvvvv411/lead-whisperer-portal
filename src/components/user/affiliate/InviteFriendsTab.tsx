
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAffiliate } from '@/hooks/useAffiliate';
import { Copy, Users, Gift, TrendingUp, Share2 } from 'lucide-react';

const InviteFriendsTab = () => {
  const { affiliateCode, invitations, copyAffiliateLink } = useAffiliate();
  const [affiliateLink, setAffiliateLink] = useState('');

  useEffect(() => {
    if (affiliateCode) {
      const baseUrl = window.location.origin;
      setAffiliateLink(`${baseUrl}/?ref=${affiliateCode.code}`);
    }
  }, [affiliateCode]);

  const totalInvitations = invitations.length;
  const paidBonuses = invitations.filter(inv => inv.bonus_paid_to_inviter).length;
  const pendingBonuses = totalInvitations - paidBonuses;
  const totalEarned = paidBonuses * 50; // 50€ per bonus

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">Freunde einladen</h2>
        <p className="text-gray-400">
          Verdiene 50€ für jeden Freund, der sich registriert und seine erste Einzahlung tätigt.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="bg-casino-card border-gold/20">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Einladungen</p>
                <p className="text-2xl font-bold text-white">{totalInvitations}</p>
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
                <p className="text-2xl font-bold text-white">{paidBonuses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-casino-card border-gold/20">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-yellow-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Ausstehend</p>
                <p className="text-2xl font-bold text-white">{pendingBonuses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-casino-card border-gold/20">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Gift className="h-8 w-8 text-gold" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Verdient</p>
                <p className="text-2xl font-bold text-white">€{totalEarned}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Affiliate Link Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-casino-card border-gold/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Share2 className="mr-2 h-5 w-5 text-gold" />
              Dein Einladungslink
            </CardTitle>
            <CardDescription>
              Teile diesen Link mit deinen Freunden. Sie erhalten 50€ bei der Registrierung, 
              und du erhältst 50€ nach ihrer ersten Einzahlung.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={affiliateLink}
                readOnly
                className="bg-casino-darker border-gold/30 text-white"
              />
              <Button
                onClick={copyAffiliateLink}
                className="bg-gold hover:bg-gold-light text-black font-medium"
              >
                <Copy className="h-4 w-4 mr-2" />
                Kopieren
              </Button>
            </div>
            
            {affiliateCode && (
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Dein Einladungscode:</p>
                <Badge variant="outline" className="text-gold border-gold/50 text-lg px-4 py-2">
                  {affiliateCode.code}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-casino-card border-gold/20">
          <CardHeader>
            <CardTitle className="text-white">Wie funktioniert es?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-400">1</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Link teilen</h3>
                <p className="text-gray-400 text-sm">
                  Sende deinen Einladungslink an Freunde oder teile deinen Code.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-400">2</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Registrierung</h3>
                <p className="text-gray-400 text-sm">
                  Dein Freund registriert sich und erhält sofort 50€ Bonus.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-gold/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-gold">3</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Du verdienst</h3>
                <p className="text-gray-400 text-sm">
                  Nach der ersten Einzahlung deines Freundes erhältst du 50€.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Invitations List */}
      {invitations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-casino-card border-gold/20">
            <CardHeader>
              <CardTitle className="text-white">Deine Einladungen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invitations.map((invitation, index) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between p-4 bg-casino-darker rounded-lg border border-white/10"
                  >
                    <div>
                      <p className="text-white font-medium">Einladung #{index + 1}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(invitation.invited_at).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={invitation.bonus_paid_to_inviter ? "default" : "secondary"}
                        className={invitation.bonus_paid_to_inviter ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}
                      >
                        {invitation.bonus_paid_to_inviter ? "Bezahlt" : "Ausstehend"}
                      </Badge>
                      {invitation.bonus_paid_to_inviter && (
                        <p className="text-green-400 text-sm mt-1">+50€</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default InviteFriendsTab;
