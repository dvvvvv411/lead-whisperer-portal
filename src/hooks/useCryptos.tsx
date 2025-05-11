
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number | null;
  price_change_24h: number | null;
  price_change_percentage_24h: number | null;
  image_url: string | null;
  last_updated: string | null;
}

export const useCryptos = () => {
  const { toast } = useToast();
  const [cryptos, setCryptos] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchCryptos = async () => {
    try {
      setLoading(true);
      
      // Fetch cryptocurrencies from Supabase
      const { data, error } = await supabase
        .from('crypto_assets')
        .select('*')
        .order('market_cap', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setCryptos(data as CryptoAsset[]);
      }
    } catch (error: any) {
      console.error('Error fetching cryptocurrencies:', error.message);
      toast({
        title: "Fehler beim Laden der Kryptowährungen",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Manually trigger update of crypto prices
  const updateCryptoPrices = async () => {
    try {
      toast({
        title: "Aktualisierung gestartet",
        description: "Kryptowährungsdaten werden aktualisiert..."
      });
      
      const response = await fetch(
        "https://evtlahgiyytcvfeiqwaz.supabase.co/functions/v1/update-crypto-prices",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Fehler: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      toast({
        title: "Aktualisierung erfolgreich",
        description: `${result.message}`
      });
      
      // Fetch updated cryptocurrencies
      fetchCryptos();
    } catch (error: any) {
      console.error('Error updating crypto prices:', error.message);
      toast({
        title: "Aktualisierung fehlgeschlagen",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  useEffect(() => {
    fetchCryptos();
    // Refresh crypto data every 5 minutes
    const interval = setInterval(() => {
      fetchCryptos();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return { 
    cryptos, 
    loading, 
    fetchCryptos, 
    updateCryptoPrices 
  };
};
