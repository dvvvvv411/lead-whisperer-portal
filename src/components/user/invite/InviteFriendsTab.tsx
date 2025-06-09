
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Share2, Users, Gift, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface InviteFriendsTabProps {
  userId: string;
}

export const InviteFriendsTab = ({ userId }: InviteFriendsTabProps) => {
  const { toast } = useToast();
  const [affiliateCode, setAffiliateCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [inviteStats, setInviteStats] = useState({
    totalInvitations: 0,
    bonusesPaid: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    fetchAffiliateCode();
    fetchInviteStats();
  }, [userId]);

  const fetchAffiliateCode = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('create_affiliate_code_for_user', {
        user_id_param: userId
      });

      if (error) throw error;
      setAffiliateCode(data);
    } catch (error) {
      console.error('Error fetching affiliate code:', error);
      toast({
        title: "Fehler",
        description: "Affiliatecode konnte nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchInviteStats = async () => {
    try {
      // Get user's invitations as inviter
      const { data: invitationsData, error } = await supabase
        .from('affiliate_invitations')
        .select('*')
        .eq('inviter_id', userId);

      if (error) throw error;

      const totalInvitations = invitationsData?.length || 0;
      const bonusesPaid = invitationsData?.filter(inv => inv.bonus_paid_to_inviter).length || 0;
      const totalEarnings = bonusesPaid * 50; // 50€ per successful invitation

      setInviteStats({
        totalInvitations,
        bonusesPaid,
        totalEarnings
      });
    } catch (error) {
      console.error('Error fetching invite stats:', error);
    }
  };

  const copyToClipboard = () => {
    const inviteUrl = `${window.location.origin}/?invite=${affiliateCode}`;
    navigator.clipboard.writeText(inviteUrl);
    toast({
      title: "Kopiert!",
      description: "Einladungslink wurde in die Zwischenablage kopiert.",
    });
  };

  const shareViaWhatsApp = () => {
    const inviteUrl = `${window.location.origin}/?invite=${affiliateCode}`;
    const message = `Hallo! Ich nutze diese fantastische KI-Trading Plattform und verdiene damit richtig gutes Geld. Mit meinem Einladungscode erhältst du 50€ Startbonus! Schau es dir an: ${inviteUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="h-8 w-8 rounded-full border-2 border-t-gold border-casino-card animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent mb-2">
          Freunde einladen & Verdienen
        </h2>
        <p className="text-gray-300">
          Lade Freunde ein und erhalte 50€ für jede erfolgreiche Anmeldung!
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-casino-card to-casino-dark border-gold/20">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{inviteStats.totalInvitations}</div>
              <div className="text-sm text-gray-400">Einladungen gesendet</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-casino-card to-casino-dark border-gold/20">
            <CardContent className="p-4 text-center">
              <Gift className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{inviteStats.bonusesPaid}</div>
              <div className="text-sm text-gray-400">Erfolgreiche Einladungen</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-casino-card to-casino-dark border-gold/20">
            <CardContent className="p-4 text-center">
              <Sparkles className="h-8 w-8 text-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-gold">{inviteStats.totalEarnings}€</div>
              <div className="text-sm text-gray-400">Verdiente Boni</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Invitation Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-casino-card to-casino-dark border-gold/20">
          <CardHeader>
            <CardTitle className="text-gold flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Dein Einladungslink
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="affiliate-code" className="text-white">Dein Affiliatecode</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="affiliate-code"
                  value={affiliateCode}
                  readOnly
                  className="bg-casino-darker border-gold/30 text-white"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="icon"
                  className="border-gold/30 hover:bg-gold/10"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="invite-url" className="text-white">Vollständiger Einladungslink</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="invite-url"
                  value={`${window.location.origin}/?invite=${affiliateCode}`}
                  readOnly
                  className="bg-casino-darker border-gold/30 text-white"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="icon"
                  className="border-gold/30 hover:bg-gold/10"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={shareViaWhatsApp}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Via WhatsApp teilen
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-casino-card to-casino-dark border-gold/20">
          <CardHeader>
            <CardTitle className="text-gold">So funktioniert es</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold text-black text-sm flex items-center justify-center font-bold mt-0.5">1</div>
                <div>
                  <div className="font-medium text-white">Teile deinen Link</div>
                  <div className="text-sm">Sende deinen Einladungslink an Freunde und Familie</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold text-black text-sm flex items-center justify-center font-bold mt-0.5">2</div>
                <div>
                  <div className="font-medium text-white">Freund registriert sich</div>
                  <div className="text-sm">Dein Freund registriert sich über deinen Link und erhält sofort 50€ Bonus</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold text-black text-sm flex items-center justify-center font-bold mt-0.5">3</div>
                <div>
                  <div className="font-medium text-white">Du erhältst deinen Bonus</div>
                  <div className="text-sm">Sobald dein Freund seine erste Einzahlung macht, erhältst du 50€ auf dein Konto</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
