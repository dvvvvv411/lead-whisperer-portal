
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminStats {
  leads: {
    total: number;
    today: number;
  };
  users: {
    total: number;
    today: number;
  };
  credits: {
    totalEur: number;
  };
  payments: {
    total: number;
    todayCount: number;
    totalAmount: number;
    todayAmount: number;
  };
  withdrawals: {
    pendingCount: number;
  };
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

// Define a type for the lead data returned from Supabase
interface LeadData {
  created_at: string;
  // Add other fields that might be present in your leads table if needed
}

// Define a type for the user data returned from Supabase auth admin
interface UserData {
  created_at: string;
  // Add other fields that might be present in the user data if needed
}

export function useAdminStats(): AdminStats {
  const [stats, setStats] = useState<Omit<AdminStats, 'isLoading' | 'error' | 'refresh'>>({
    leads: { total: 0, today: 0 },
    users: { total: 0, today: 0 },
    credits: { totalEur: 0 },
    payments: { total: 0, todayCount: 0, totalAmount: 0, todayAmount: 0 },
    withdrawals: { pendingCount: 0 }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch leads stats
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('created_at', { count: 'exact' });
      
      if (leadsError) throw new Error(`Leads error: ${leadsError.message}`);
      
      const totalLeads = leadsData ? leadsData.length : 0;
      const todayLeads = leadsData ? leadsData.filter(
        (lead: LeadData) => new Date(lead.created_at).toDateString() === new Date().toDateString()
      ).length : 0;
      
      // Fetch users stats
      const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) throw new Error(`Users error: ${usersError.message}`);

      const totalUsers = usersData ? usersData.users.length : 0;
      const todayUsers = usersData ? usersData.users.filter(
        (user: UserData) => new Date(user.created_at).toDateString() === new Date().toDateString()
      ).length : 0;
      
      // Fetch credits stats
      const { data: creditsData, error: creditsError } = await supabase
        .from('user_credits')
        .select('amount');
      
      if (creditsError) throw new Error(`Credits error: ${creditsError.message}`);
      
      const totalCredits = creditsData ? creditsData.reduce(
        (sum, record) => sum + (record.amount || 0), 0
      ) / 100 : 0; // Convert cents to EUR
      
      // Fetch payments stats
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('amount, created_at, status');
      
      if (paymentsError) throw new Error(`Payments error: ${paymentsError.message}`);
      
      const completedPayments = paymentsData ? paymentsData.filter(
        payment => payment.status === 'completed'
      ) : [];
      
      const totalPayments = completedPayments.length;
      const totalPaymentsAmount = completedPayments.reduce(
        (sum, payment) => sum + (payment.amount || 0), 0
      ) / 100; // Convert cents to EUR
      
      const todayPayments = completedPayments.filter(
        payment => new Date(payment.created_at).toDateString() === new Date().toDateString()
      );
      
      const todayPaymentsCount = todayPayments.length;
      const todayPaymentsAmount = todayPayments.reduce(
        (sum, payment) => sum + (payment.amount || 0), 0
      ) / 100; // Convert cents to EUR
      
      // Fetch withdrawals stats
      const { data: withdrawalsData, error: withdrawalsError } = await supabase
        .from('withdrawals')
        .select('status', { count: 'exact' })
        .eq('status', 'pending');
      
      if (withdrawalsError) throw new Error(`Withdrawals error: ${withdrawalsError.message}`);
      
      const pendingWithdrawals = withdrawalsData ? withdrawalsData.length : 0;
      
      // Update stats
      setStats({
        leads: {
          total: totalLeads,
          today: todayLeads
        },
        users: {
          total: totalUsers,
          today: todayUsers
        },
        credits: {
          totalEur: totalCredits
        },
        payments: {
          total: totalPayments,
          todayCount: todayPaymentsCount,
          totalAmount: totalPaymentsAmount,
          todayAmount: todayPaymentsAmount
        },
        withdrawals: {
          pendingCount: pendingWithdrawals
        }
      });
      
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    ...stats,
    isLoading,
    error,
    refresh: fetchStats
  };
}
