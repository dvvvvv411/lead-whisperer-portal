
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

// Generate a realistic crypto comparison from real data
export const generateCryptoComparison = (cryptoData: any[]) => {
  if (!cryptoData || cryptoData.length === 0) {
    return {
      symbol: "BTC",
      price: 42000,
      change: 0.5
    };
  }
  
  // Select random crypto from real data
  const randomIndex = Math.floor(Math.random() * cryptoData.length);
  const selectedCrypto = cryptoData[randomIndex];
  
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

// Select a random crypto for trading
export const selectRandomCrypto = (cryptoData: any[]) => {
  if (!cryptoData || cryptoData.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * cryptoData.length);
  return cryptoData[randomIndex];
};

// Generate a profit percentage between 5-10%
export const generateProfitPercentage = () => {
  return 5 + Math.random() * 5; // Between 5% and 10%
};
