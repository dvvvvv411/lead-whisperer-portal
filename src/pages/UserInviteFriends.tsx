
import { useState, useEffect } from "react";
import { useUserAuth } from "@/hooks/useUserAuth";
import UserNavbar from "@/components/user/UserNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Users, Gift, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const UserInviteFriends = () => {
  const { user, loading } = useUserAuth(true);
  const { toast } = useToast();
  const [affiliateCode, setAffiliateCode] = useState<string>("");
  const [invitationStats, setInvitationStats] = useState({
    totalInvitations: 0,
    totalBonuses: 0,
    totalAmount: 0
  });
  const [loadingCode, setLoadingCode] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchAffiliateCode();
      fetchInvitationStats();
    }
  }, [user?.id]);

  const fetchAffiliateCode = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingCode(true);
      
      // First try to get existing code
      const { data: existingCode, error: fetchError } = await supabase
        .from('affiliate_codes')
        .select('code')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingCode) {
        setAffiliateCode(existingCode.code);
      } else {
        // Create new code if none exists
        const { data: newCode, error: createError } = await supabase
          .rpc('create_affiliate_code_for_user', { user_id_param: user.id });

        if (createError) throw createError;
        setAffiliateCode(newCode);
      }
    } catch (error: any) {
      console.error('Error fetching affiliate code:', error);
      toast({
        title: "Fehler beim Laden des Einladungscodes",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoadingCode(false);
    }
  };

  const fetchInvitationStats = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('affiliate_invitations')
        .select('bonus_paid_to_inviter')
        .eq('inviter_id', user.id);

      if (error) throw error;

      const totalInvitations = data?.length || 0;
      const totalBonuses = data?.filter(inv => inv.bonus_paid_to_inviter).length || 0;
      const totalAmount = totalBonuses * 50; // 50€ per bonus

      setInvitationStats({
        totalInvitations,
        totalBonuses,
        totalAmount
      });
    } catch (error: any) {
      console.error('Error fetching invitation stats:', error);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Kopiert!",
        description: `${type} wurde in die Zwischenablage kopiert.`
      });
    } catch (error) {
      toast({
        title: "Fehler beim Kopieren",
        description: "Konnte nicht in die Zwischenablage kopieren.",
        variant: "destructive"
      });
    }
  };

  const inviteUrl = `${window.location.origin}/?invite=${affiliateCode}`;

  if (loading) {
    return <div className="min-h-screen bg-casino-darker flex items-center justify-center">
      <div className="text-white">Lädt...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-casino-darker">
      <UserNavbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Freunde einladen</h1>
          <p className="text-gray-300">Teile deinen Einladungscode und erhalte 50€ für jeden neuen Nutzer!</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Affiliate Code Card */}
          <Card className="bg-casino-card border-gold/20">
            <CardHeader>
              <CardTitle className="text-gold flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Dein Einladungscode
              </CardTitle>
              <CardDescription className="text-gray-300">
                Teile diesen Code mit deinen Freunden
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={loadingCode ? "Lädt..." : affiliateCode}
                  readOnly
                  className="bg-casino-darker border-gold/30 text-white font-mono text-lg"
                />
                <Button
                  onClick={() => copyToClipboard(affiliateCode, "Einladungscode")}
                  variant="outline"
                  size="icon"
                  className="border-gold/30 text-gold hover:bg-gold/10"
                  disabled={loadingCode}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Oder teile diesen Link:</p>
                <div className="flex gap-2">
                  <Input
                    value={loadingCode ? "Lädt..." : inviteUrl}
                    readOnly
                    className="bg-casino-darker border-gold/30 text-white text-sm"
                  />
                  <Button
                    onClick={() => copyToClipboard(inviteUrl, "Einladungslink")}
                    variant="outline"
                    size="icon"
                    className="border-gold/30 text-gold hover:bg-gold/10"
                    disabled={loadingCode}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card className="bg-casino-card border-gold/20">
            <CardHeader>
              <CardTitle className="text-gold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Deine Statistiken
              </CardTitle>
              <CardDescription className="text-gray-300">
                Übersicht deiner Einladungen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{invitationStats.totalInvitations}</div>
                  <div className="text-xs text-gray-400">Einladungen</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">{invitationStats.totalBonuses}</div>
                  <div className="text-xs text-gray-400">Boni erhalten</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gold">{invitationStats.totalAmount}€</div>
                  <div className="text-xs text-gray-400">Verdient</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How it works */}
        <Card className="bg-casino-card border-gold/20 mt-6">
          <CardHeader>
            <CardTitle className="text-gold flex items-center gap-2">
              <Gift className="h-5 w-5" />
              So funktioniert's
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="bg-gold/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-gold font-bold">1</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Teilen</h3>
                <p className="text-sm text-gray-300">Teile deinen Einladungscode oder Link mit Freunden</p>
              </div>
              <div className="text-center">
                <div className="bg-gold/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-gold font-bold">2</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Registrierung</h3>
                <p className="text-sm text-gray-300">Dein Freund registriert sich mit deinem Code</p>
              </div>
              <div className="text-center">
                <div className="bg-gold/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-gold font-bold">3</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Bonus erhalten</h3>
                <p className="text-sm text-gray-300">Ihr erhaltet beide 50€ nach der ersten Einzahlung</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserInviteFriends;
