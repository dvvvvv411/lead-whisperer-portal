
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AffiliateCode {
  id: string;
  code: string;
  created_at: string;
}

interface AffiliateInvitation {
  id: string;
  inviter_id: string;
  invited_user_id: string;
  affiliate_code: string;
  invited_at: string;
  bonus_paid_to_inviter: boolean;
  bonus_paid_to_invited: boolean;
  bonus_paid_at: string | null;
}

interface AffiliateStats {
  inviter_email: string;
  inviter_id: string;
  affiliate_code: string;
  total_invitations: number;
  total_bonuses_paid: number;
  total_bonus_amount: number;
}

export const useAffiliate = () => {
  const [affiliateCode, setAffiliateCode] = useState<AffiliateCode | null>(null);
  const [invitations, setInvitations] = useState<AffiliateInvitation[]>([]);
  const [stats, setStats] = useState<AffiliateStats[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Get user's affiliate code
  const fetchAffiliateCode = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('affiliate_codes')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching affiliate code:', error);
        return;
      }

      if (data) {
        setAffiliateCode(data);
      } else {
        // Create affiliate code if it doesn't exist
        await createAffiliateCode();
      }
    } catch (error) {
      console.error('Error in fetchAffiliateCode:', error);
    }
  };

  // Create affiliate code for user
  const createAffiliateCode = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.rpc('create_affiliate_code_for_user', {
        user_id_param: user.id
      });

      if (error) {
        console.error('Error creating affiliate code:', error);
        return;
      }

      // Fetch the created code
      await fetchAffiliateCode();
    } catch (error) {
      console.error('Error in createAffiliateCode:', error);
    }
  };

  // Get user's invitations (as inviter)
  const fetchInvitations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('affiliate_invitations')
        .select('*')
        .eq('inviter_id', user.id)
        .order('invited_at', { ascending: false });

      if (error) {
        console.error('Error fetching invitations:', error);
        return;
      }

      setInvitations(data || []);
    } catch (error) {
      console.error('Error in fetchInvitations:', error);
    }
  };

  // Process affiliate invitation (for registration)
  const processAffiliateInvitation = async (invitedUserId: string, affiliateCode: string) => {
    try {
      const { data, error } = await supabase.rpc('process_affiliate_invitation', {
        invited_user_id_param: invitedUserId,
        affiliate_code_param: affiliateCode
      });

      if (error) {
        console.error('Error processing affiliate invitation:', error);
        return { success: false, message: 'Failed to process invitation' };
      }

      return data;
    } catch (error) {
      console.error('Error in processAffiliateInvitation:', error);
      return { success: false, message: 'Failed to process invitation' };
    }
  };

  // Get affiliate statistics (admin only)
  const fetchAffiliateStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_affiliate_statistics');

      if (error) {
        console.error('Error fetching affiliate stats:', error);
        toast({
          title: "Fehler",
          description: "Affiliate-Statistiken konnten nicht geladen werden.",
          variant: "destructive"
        });
        return;
      }

      setStats(data || []);
    } catch (error) {
      console.error('Error in fetchAffiliateStats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Copy affiliate link to clipboard
  const copyAffiliateLink = async () => {
    if (!affiliateCode) return;

    const baseUrl = window.location.origin;
    const affiliateLink = `${baseUrl}/?ref=${affiliateCode.code}`;

    try {
      await navigator.clipboard.writeText(affiliateLink);
      toast({
        title: "Link kopiert",
        description: "Der Affiliate-Link wurde in die Zwischenablage kopiert.",
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Fehler",
        description: "Link konnte nicht kopiert werden.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchAffiliateCode();
    fetchInvitations();
  }, []);

  return {
    affiliateCode,
    invitations,
    stats,
    loading,
    fetchAffiliateCode,
    fetchInvitations,
    fetchAffiliateStats,
    processAffiliateInvitation,
    copyAffiliateLink
  };
};
