
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
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get user's affiliate code
  const fetchAffiliateCode = async () => {
    try {
      console.log('Fetching affiliate code...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found');
        return;
      }

      const { data, error } = await supabase
        .from('affiliate_codes')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching affiliate code:', error);
        setError('Fehler beim Laden des Affiliate-Codes');
        return;
      }

      if (data) {
        console.log('Affiliate code found:', data);
        setAffiliateCode(data);
        setError(null);
      } else {
        console.log('No affiliate code found, creating one...');
        // Create affiliate code if it doesn't exist
        await createAffiliateCode();
      }
    } catch (error) {
      console.error('Error in fetchAffiliateCode:', error);
      setError('Fehler beim Laden des Affiliate-Codes');
    }
  };

  // Create affiliate code for user - using direct INSERT instead of RPC
  const createAffiliateCode = async () => {
    try {
      console.log('Creating affiliate code...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found for creating affiliate code');
        return;
      }

      // Generate a simple affiliate code
      const code = `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      console.log('Generated code:', code);

      const { data, error } = await supabase
        .from('affiliate_codes')
        .insert({
          user_id: user.id,
          code: code
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating affiliate code:', error);
        setError('Fehler beim Erstellen des Affiliate-Codes');
        toast({
          title: "Fehler",
          description: "Affiliate-Code konnte nicht erstellt werden.",
          variant: "destructive"
        });
        return;
      }

      console.log('Affiliate code created successfully:', data);
      setAffiliateCode(data);
      setError(null);
    } catch (error) {
      console.error('Error in createAffiliateCode:', error);
      setError('Fehler beim Erstellen des Affiliate-Codes');
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
    if (!affiliateCode) {
      toast({
        title: "Fehler",
        description: "Kein Affiliate-Code verfügbar.",
        variant: "destructive"
      });
      return;
    }

    const baseUrl = window.location.origin;
    const affiliateLink = `${baseUrl}/?ref=${affiliateCode.code}`;
    console.log('Copying affiliate link:', affiliateLink);

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
    error,
    fetchAffiliateCode,
    fetchInvitations,
    fetchAffiliateStats,
    processAffiliateInvitation,
    copyAffiliateLink
  };
};
