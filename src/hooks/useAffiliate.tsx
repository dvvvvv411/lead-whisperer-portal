
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AffiliateData {
  code: string;
  totalInvitations: number;
  totalBonusesPaid: number;
  totalBonusAmount: number;
}

interface AffiliateInvitation {
  id: string;
  invitedUserEmail: string;
  invitedAt: string;
  bonusPaidToInviter: boolean;
  bonusPaidToInvited: boolean;
  bonusPaidAt: string | null;
}

export const useAffiliate = (userId?: string) => {
  const { toast } = useToast();
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
  const [invitations, setInvitations] = useState<AffiliateInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAffiliateData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get or create affiliate code
      const { data: codeData, error: codeError } = await supabase.rpc(
        'create_affiliate_code_for_user',
        { user_id_param: userId }
      );

      if (codeError) throw codeError;

      // Get affiliate statistics
      const { data: statsData, error: statsError } = await supabase.rpc('get_affiliate_statistics');
      
      if (statsError) throw statsError;

      // Find current user's stats
      const userStats = statsData?.find(stat => stat.inviter_id === userId) || {
        total_invitations: 0,
        total_bonuses_paid: 0,
        total_bonus_amount: 0
      };

      setAffiliateData({
        code: codeData,
        totalInvitations: userStats.total_invitations,
        totalBonusesPaid: userStats.total_bonuses_paid,
        totalBonusAmount: userStats.total_bonus_amount
      });

      // Get invitation details
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('affiliate_invitations')
        .select(`
          id,
          invited_at,
          bonus_paid_to_inviter,
          bonus_paid_to_invited,
          bonus_paid_at
        `)
        .eq('inviter_id', userId)
        .order('invited_at', { ascending: false });

      if (invitationsError) throw invitationsError;

      // Get user emails for invitations
      const invitationsList: AffiliateInvitation[] = [];
      for (const invitation of invitationsData || []) {
        const { data: userData } = await supabase.auth.admin.getUserById(invitation.invited_user_id);
        invitationsList.push({
          id: invitation.id,
          invitedUserEmail: userData.user?.email || 'Unknown',
          invitedAt: invitation.invited_at,
          bonusPaidToInviter: invitation.bonus_paid_to_inviter,
          bonusPaidToInvited: invitation.bonus_paid_to_invited,
          bonusPaidAt: invitation.bonus_paid_at
        });
      }

      setInvitations(invitationsList);
    } catch (error: any) {
      console.error("Error fetching affiliate data:", error);
      toast({
        title: "Fehler beim Laden der Affiliate-Daten",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    fetchAffiliateData();
  }, [fetchAffiliateData]);

  const copyAffiliateLink = useCallback(() => {
    if (affiliateData?.code) {
      const link = `${window.location.origin}/?ref=${affiliateData.code}`;
      navigator.clipboard.writeText(link);
      toast({
        title: "Link kopiert",
        description: "Der Affiliate-Link wurde in die Zwischenablage kopiert."
      });
    }
  }, [affiliateData?.code, toast]);

  return {
    affiliateData,
    invitations,
    loading,
    fetchAffiliateData,
    copyAffiliateLink
  };
};
