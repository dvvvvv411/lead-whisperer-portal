
// Algorithm steps
export const algorithmSteps = [
  "Initialisiere KI-Algorithmus",
  "Analyse historischer Kursdaten",
  "Berechnung optimaler Einstiegspunkte",
  "Sentiment-Analyse der Markttrends",
  "Volumen-Korrelationsanalyse",
  "Prüfung technischer Indikatoren",
  "Bewertung der Handelsvolumina",
  "Erkennung von Marktmustern",
  "Berechnung der Gewinnwahrscheinlichkeit",
  "Finale Handelsempfehlung"
];

// List of stablecoin symbols that should be excluded from trading
const STABLECOIN_SYMBOLS = ['USDT', 'USDC', 'BUSD', 'DAI', 'UST', 'TUSD', 'USDP', 'GUSD', 'FRAX'];

// Generate a realistic crypto comparison from real data
export const generateCryptoComparison = (cryptoData: any[]) => {
  if (!cryptoData || cryptoData.length === 0) {
    return {
      symbol: "BTC",
      price: 42000,
      change: 0.5
    };
  }
  
  // Select random crypto from real data, excluding stablecoins
  const tradableCryptos = cryptoData.filter(crypto => 
    !STABLECOIN_SYMBOLS.includes(crypto.symbol.toUpperCase())
  );
  
  if (tradableCryptos.length === 0) {
    return {
      symbol: "BTC",
      price: 42000,
      change: 0.5
    };
  }
  
  const randomIndex = Math.floor(Math.random() * tradableCryptos.length);
  const selectedCrypto = tradableCryptos[randomIndex];
  
  // Use real price with small variation to simulate live updates
  const priceVariation = selectedCrypto.current_price * (Math.random() * 0.02 - 0.01); // ±1%
  const price = selectedCrypto.current_price + priceVariation;
  
  // Use real data for change if available, otherwise simulate one
  const change = selectedCrypto.price_change_percentage_24h || (Math.random() * 6 - 3);
  
  return {
    symbol: selectedCrypto.symbol,
    price,
    change
  };
};

// Select a random crypto for trading, excluding stablecoins
export const selectRandomCrypto = (cryptoData: any[]) => {
  if (!cryptoData || cryptoData.length === 0) return null;
  
  // Filter out stablecoins
  const tradableCryptos = cryptoData.filter(crypto => 
    !STABLECOIN_SYMBOLS.includes(crypto.symbol.toUpperCase())
  );
  
  if (tradableCryptos.length === 0) return null; // Safety check
  
  const randomIndex = Math.floor(Math.random() * tradableCryptos.length);
  return tradableCryptos[randomIndex];
};

// Generate a profit percentage between 3-7.5%
export const generateProfitPercentage = () => {
  return 3 + Math.random() * 4.5; // Between 3% and 7.5%
};

// Calculate buy price based on current price and profit percentage
export const calculateBuyPrice = (currentPrice: number, profitPercentage: number) => {
  // If we want to make X% profit selling at current price, 
  // we need to buy at a price that is X% lower
  return currentPrice / (1 + (profitPercentage / 100));
};

// Calculate profit amount based on investment amount and profit percentage
export const calculateProfit = (investmentAmount: number, profitPercentage: number) => {
  return investmentAmount * (profitPercentage / 100);
};

// Format a date for display
export const formatTradeDate = (date: Date) => {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
