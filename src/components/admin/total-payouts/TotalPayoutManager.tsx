import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Copy, ExternalLink, Search, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface TotalPayout {
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
  unique_url_token: string;
  created_at: string;
  updated_at: string;
}

export const TotalPayoutManager = () => {
  const { toast } = useToast();
  const [payouts, setPayouts] = useState<TotalPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTotalPayouts = async () => {
    try {
      const { data, error } = await supabase
        .from('total_payouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayouts(data || []);
    } catch (error: any) {
      console.error("Error fetching total payouts:", error);
      toast({
        title: "Fehler",
        description: "Gesamtauszahlungen konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalPayouts();
  }, []);

  const handleCopyUrl = async (token: string) => {
    const fullUrl = `${window.location.origin}/gesamtauszahlung/${token}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast({
        title: "URL kopiert",
        description: "Die Auszahlungs-URL wurde in die Zwischenablage kopiert."
      });
    } catch (error) {
      console.error("Failed to copy URL:", error);
      toast({
        title: "Kopieren fehlgeschlagen",
        description: "Die URL konnte nicht kopiert werden.",
        variant: "destructive"
      });
    }
  };

  const handleOpenUrl = (token: string) => {
    const fullUrl = `${window.location.origin}/gesamtauszahlung/${token}`;
    window.open(fullUrl, '_blank');
  };

  const getStatusBadge = (status: string, feePaid: boolean) => {
    if (feePaid) {
      return <Badge className="bg-green-100 text-green-800">Gebühr bezahlt</Badge>;
    }
    
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Ausstehend</Badge>;
      case 'fee_paid':
        return <Badge className="bg-green-100 text-green-800">Gebühr bezahlt</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Abgeschlossen</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Storniert</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredPayouts = payouts.filter(payout =>
    payout.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payout.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-casino-darker flex items-center justify-center">
        <div className="animate-pulse text-gold">Wird geladen...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-casino-darker p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-casino-card border-gold/20">
          <CardHeader>
            <CardTitle className="text-gold flex items-center">
              <DollarSign className="mr-2 h-6 w-6" />
              Gesamtauszahlungen Verwaltung
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="E-Mail oder Status suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-casino-darker border-gold/20 text-white"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredPayouts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                {searchTerm ? "Keine Auszahlungen gefunden." : "Keine Gesamtauszahlungen vorhanden."}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPayouts.map((payout, index) => (
                  <motion.div
                    key={payout.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-casino-darker p-4 rounded-lg border border-gold/10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                      <div>
                        <p className="text-sm text-gray-400">Benutzer</p>
                        <p className="text-white font-medium">{payout.user_email}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(payout.created_at), 'dd.MM.yyyy HH:mm')}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">Guthaben & Gebühr</p>
                        <p className="text-white font-medium">
                          {(payout.user_balance / 100).toFixed(2)}€
                        </p>
                        <p className="text-xs text-gray-400">
                          Gebühr: {payout.fee_percentage}% ({payout.fee_amount ? (payout.fee_amount / 100).toFixed(2) : '0.00'}€)
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">Status & Details</p>
                        <div className="flex flex-col space-y-1">
                          {getStatusBadge(payout.status, payout.fee_paid)}
                          {payout.payout_currency && (
                            <p className="text-xs text-gray-400">
                              Währung: {payout.payout_currency.toUpperCase()}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyUrl(payout.unique_url_token)}
                            className="bg-gold/10 border-gold/30 hover:bg-gold/20 text-gold"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenUrl(payout.unique_url_token)}
                            className="bg-blue-900/20 border-blue-500/30 hover:bg-blue-800/30 text-blue-400"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                        {payout.payout_wallet_address && (
                          <div className="text-xs">
                            <p className="text-gray-400">Wallet:</p>
                            <p className="font-mono text-gray-300 break-all">
                              {payout.payout_wallet_address.substring(0, 20)}...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};