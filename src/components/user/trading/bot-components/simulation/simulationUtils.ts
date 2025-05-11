
// Mock crypto data for simulation
export const mockCryptoSymbols = [
  { symbol: "BTC", basePrice: 42000 },
  { symbol: "ETH", basePrice: 2800 },
  { symbol: "SOL", basePrice: 120 },
  { symbol: "ADA", basePrice: 0.45 },
  { symbol: "DOT", basePrice: 6.2 },
  { symbol: "AVAX", basePrice: 32 },
  { symbol: "LINK", basePrice: 15.8 },
  { symbol: "MATIC", basePrice: 0.85 },
  { symbol: "UNI", basePrice: 9.4 },
  { symbol: "ATOM", basePrice: 11.2 }
];

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

// Generate a realistic crypto comparison
export const generateCryptoComparison = () => {
  // Select random mock crypto
  const randomIndex = Math.floor(Math.random() * mockCryptoSymbols.length);
  const mockCrypto = mockCryptoSymbols[randomIndex];
  
  // Generate realistic price fluctuation (±2% of base price)
  const priceVariation = mockCrypto.basePrice * (Math.random() * 0.04 - 0.02);
  const price = mockCrypto.basePrice + priceVariation;
  
  // Generate change percentage (-3% to +3%)
  const change = (Math.random() * 6) - 3;
  
  return {
    symbol: mockCrypto.symbol,
    price,
    change
  };
};
