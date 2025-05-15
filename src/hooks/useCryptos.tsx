
import { useState, useEffect, useCallback } from "react";
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

// Fallback mock data for when authentication fails or data can't be fetched
const mockCryptoData: CryptoAsset[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    current_price: 61235.42,
    market_cap: 1198732541247,
    price_change_24h: 1242.32,
    price_change_percentage_24h: 2.1,
    image_url: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    last_updated: new Date().toISOString()
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    current_price: 3475.18,
    market_cap: 417892345671,
    price_change_24h: 87.32,
    price_change_percentage_24h: 2.58,
    image_url: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    last_updated: new Date().toISOString()
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    current_price: 0.48,
    market_cap: 17023456789,
    price_change_24h: 0.02,
    price_change_percentage_24h: 4.35,
    image_url: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    last_updated: new Date().toISOString()
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    current_price: 156.78,
    market_cap: 68923456789,
    price_change_24h: 7.89,
    price_change_percentage_24h: 5.3,
    image_url: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    last_updated: new Date().toISOString()
  },
  {
    id: "ripple",
    symbol: "xrp",
    name: "XRP",
    current_price: 0.52,
    market_cap: 28123456789,
    price_change_24h: 0.01,
    price_change_percentage_24h: 1.96,
    image_url: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    last_updated: new Date().toISOString()
  }
];

export const useCryptos = () => {
  const { toast } = useToast();
  const [cryptos, setCryptos] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);
  
  const fetchCryptos = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch cryptocurrencies from Supabase
      const { data, error } = await supabase
        .from('crypto_assets')
        .select('*')
        .order('market_cap', { ascending: false });
      
      if (error) {
        // For auth errors, silently fall back to mock data
        if (error.code === 'PGRST301' || error.message.includes('auth')) {
          console.log('Authentication issue detected, using mock data');
          setCryptos(mockCryptoData);
          setUsingMockData(true);
          return;
        }
        
        throw error;
      }
      
      if (data && data.length > 0) {
        setCryptos(data as CryptoAsset[]);
        setUsingMockData(false);
      } else {
        // If no data is returned, use mock data
        console.log('No crypto data found, using mock data');
        setCryptos(mockCryptoData);
        setUsingMockData(true);
      }
    } catch (error: any) {
      console.error('Error fetching cryptocurrencies:', error.message);
      
      // Fall back to mock data for any error
      console.log('Using mock data due to error:', error.message);
      setCryptos(mockCryptoData);
      setUsingMockData(true);
      
      // Only show error toast if it's not an authentication error
      if (!error.message.includes('auth') && error.code !== 'PGRST301') {
        toast({
          title: "Fehler beim Laden der Kryptowährungen",
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  // Manually trigger update of crypto prices
  const updateCryptoPrices = useCallback(async () => {
    // If already updating, don't start another update
    if (updating) {
      console.log("Already updating crypto prices, skipping this request");
      return;
    }
    
    try {
      setUpdating(true);
      
      // Get the current session for auth token
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        // If not authenticated, just refresh the mock data with slight variations
        if (usingMockData) {
          const updatedMockData = mockCryptoData.map(crypto => {
            const priceChange = (Math.random() - 0.3) * crypto.current_price * 0.05;
            return {
              ...crypto,
              current_price: crypto.current_price + priceChange,
              price_change_24h: priceChange,
              price_change_percentage_24h: (priceChange / crypto.current_price) * 100,
              last_updated: new Date().toISOString()
            };
          });
          setCryptos(updatedMockData);
          return;
        }
        
        console.log("No active session found, using mock data");
        setCryptos(mockCryptoData);
        setUsingMockData(true);
        return;
      }
      
      // If we're using mock data but now have a session, try to fetch real data
      if (usingMockData) {
        fetchCryptos();
        return;
      }
      
      const response = await fetch(
        "https://evtlahgiyytcvfeiqwaz.supabase.co/functions/v1/update-crypto-prices",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionData.session.access_token}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Fehler: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Fetch updated cryptocurrencies
      fetchCryptos();
    } catch (error: any) {
      console.error('Error updating crypto prices:', error.message);
      
      // If there's an error updating but we're not using mock data yet,
      // switch to mock data
      if (!usingMockData) {
        console.log("Switching to mock data due to update error");
        setCryptos(mockCryptoData);
        setUsingMockData(true);
      }
      
      // Only show toast for non-auth errors
      if (!error.message.includes('auth')) {
        toast({
          title: "Aktualisierung fehlgeschlagen",
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      setUpdating(false);
    }
  }, [toast, fetchCryptos, updating, usingMockData]);
  
  useEffect(() => {
    fetchCryptos();
    // Refresh crypto data every 5 minutes
    const interval = setInterval(() => {
      fetchCryptos();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchCryptos]);
  
  return { 
    cryptos, 
    loading, 
    updating,
    usingMockData,
    fetchCryptos, 
    updateCryptoPrices 
  };
};
