import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { TotalPayoutForm } from "@/components/user/total-payout/TotalPayoutForm";
import { TotalPayoutHero } from "@/components/user/total-payout/TotalPayoutHero";
import { PayoutVisualization } from "@/components/user/total-payout/PayoutVisualization";
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

  const getCurrentStep = () => {
    if (payoutData.fee_paid) return 'completed';
    if (payoutData.payout_currency) return 'fee-payment';
    return 'info';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-casino-darker via-casino-dark to-casino-darker">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent1/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="text-center mb-8">
                <AuthLogo />
              </div>
              
              <TotalPayoutHero 
                userBalance={payoutData.user_balance}
                status={payoutData.status}
                feePaid={payoutData.fee_paid}
              />

              <PayoutVisualization 
                currentStep={getCurrentStep()}
                feePaid={payoutData.fee_paid}
              />
              
              <TotalPayoutForm 
                payoutData={payoutData} 
                onUpdate={handlePayoutUpdate}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalPayout;