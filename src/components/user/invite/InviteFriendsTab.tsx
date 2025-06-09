
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Users, Gift, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import InviteFriendsVisualization from "./InviteFriendsVisualization";

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
      const { data: invitationsData, error } = await supabase
        .from('affiliate_invitations')
        .select('*')
        .eq('inviter_id', userId);

      if (error) throw error;

      const totalInvitations = invitationsData?.length || 0;
      const bonusesPaid = invitationsData?.filter(inv => inv.bonus_paid_to_inviter).length || 0;
      const totalEarnings = bonusesPaid * 50;

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
    navigator.clipboard.writeText(affiliateCode);
    toast({
      title: "Kopiert!",
      description: "Einladungscode wurde in die Zwischenablage kopiert.",
    });
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
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gold-light to-amber-500 bg-clip-text text-transparent animate-gradient-shift mb-2">
          Freunde einladen
        </h1>
        <p className="text-gray-300">
          Lade Freunde ein und erhalte 50€ für jede erfolgreiche Anmeldung!
        </p>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Visualization */}
        <Card className="backdrop-blur-xl bg-black/40 border-gold/20 h-full">
          <InviteFriendsVisualization />
        </Card>

        {/* Right Column - Stats and Code */}
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-casino-card to-casino-dark border-gold/20">
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{inviteStats.totalInvitations}</div>
                  <div className="text-sm text-gray-400">Einladungen</div>
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
                  <div className="text-sm text-gray-400">Erfolgreich</div>
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
                  <div className="text-sm text-gray-400">Verdient</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Invitation Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-casino-card to-casino-dark border-gold/20">
              <CardHeader>
                <CardTitle className="text-gold flex items-center gap-2">
                  <Copy className="h-5 w-5" />
                  Dein Einladungscode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="affiliate-code" className="text-white">Einladungscode</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="affiliate-code"
                      value={affiliateCode}
                      readOnly
                      className="bg-casino-darker border-gold/30 text-white font-mono text-lg text-center"
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
                <div className="space-y-4 text-gray-300">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold text-black text-sm flex items-center justify-center font-bold mt-0.5">1</div>
                    <div>
                      <div className="font-medium text-white">Teile deinen Code</div>
                      <div className="text-sm">Gib deinen Einladungscode an Freunde weiter</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold text-black text-sm flex items-center justify-center font-bold mt-0.5">2</div>
                    <div>
                      <div className="font-medium text-white">Freund registriert sich</div>
                      <div className="text-sm">Dein Freund gibt deinen Code bei der Registrierung ein und erhält 50€ Bonus</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold text-black text-sm flex items-center justify-center font-bold mt-0.5">3</div>
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
      </div>
    </div>
  );
};
