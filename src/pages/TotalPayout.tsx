import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { TotalPayoutForm } from "@/components/user/total-payout/TotalPayoutForm";
import AuthLogo from "@/components/auth/AuthLogo";

interface PayoutData {
  id: string;
  user_id: string;
  user_email: string;
  fee_percentage: number;
  user_balance: number;
  payout_currency: string | null;
  payout_wallet_address: string | null;
  fee_paid: boolean;
  fee_amount: number | null;
  fee_payment_currency: string | null;
  status: string;
}

const TotalPayout = () => {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [payoutData, setPayoutData] = useState<PayoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayoutData = async () => {
      if (!token) {
        setError("Ungültiger Auszahlungslink");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('total_payouts')
          .select('*')
          .eq('unique_url_token', token)
          .single();

        if (error) {
          console.error("Error fetching payout data:", error);
          setError("Auszahlungsanfrage nicht gefunden");
          return;
        }

        if (!data) {
          setError("Auszahlungsanfrage nicht gefunden");
          return;
        }

        setPayoutData(data);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Ein unerwarteter Fehler ist aufgetreten");
      } finally {
        setLoading(false);
      }
    };

    fetchPayoutData();
  }, [token]);

  const handlePayoutUpdate = async () => {
    // Refresh payout data
    if (token) {
      const { data } = await supabase
        .from('total_payouts')
        .select('*')
        .eq('unique_url_token', token)
        .single();
      
      if (data) {
        setPayoutData(data);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-casino-darker flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="animate-pulse flex flex-col items-center"
        >
          <div className="h-12 w-12 bg-gold/20 rounded-full mb-4 flex items-center justify-center">
            <div className="h-6 w-6 bg-gold rounded-full animate-ping"></div>
          </div>
          <p className="text-gray-300">Wird geladen...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !payoutData) {
    return (
      <div className="min-h-screen bg-casino-darker flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-casino-card p-8 rounded-lg border border-gold/10 shadow-lg max-w-md w-full mx-4"
        >
          <AuthLogo />
          <div className="text-center mt-6">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Fehler</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <a 
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition-colors"
            >
              Zur Startseite
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-casino-darker relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-casino-darker via-casino-dark to-casino-darker"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-500/5 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <AuthLogo />
            </div>
            
            <TotalPayoutForm 
              payoutData={payoutData} 
              onUpdate={handlePayoutUpdate}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TotalPayout;