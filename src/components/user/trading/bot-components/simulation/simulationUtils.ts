import { CryptoComparisonProps } from "./CryptoComparison";

// Define algorithm steps with title and description
export const algorithmSteps: { title: string; description: string }[] = [
  { 
    title: "Marktdaten sammeln", 
    description: "Sammle aktuelle Marktdaten aus verschiedenen Quellen" 
  },
  { 
    title: "Technische Analyse", 
    description: "Berechne technische Indikatoren (RSI, MACD, Bollinger Bands)" 
  },
  { 
    title: "Sentiment-Analyse", 
    description: "Analysiere Marktstimmung aus sozialen Medien und Nachrichtenquellen" 
  },
  { 
    title: "Volumen-Analyse", 
    description: "Untersuche Handelsvolumen für Liquiditätsmuster" 
  },
  { 
    title: "Korrelationsanalyse", 
    description: "Vergleiche Korrelation mit anderen Kryptowährungen" 
  },
  { 
    title: "Mustererkennungsalgorithmus", 
    description: "Identifiziere bekannte Chart-Muster und Preisformationen" 
  },
  { 
    title: "Wahrscheinlichkeitsberechnung", 
    description: "Berechne Wahrscheinlichkeiten für verschiedene Preisszenarien" 
  },
  { 
    title: "Risiko-Optimierung", 
    description: "Optimiere die Position basierend auf Risikotoleranz" 
  },
  { 
    title: "Gewinnpotenzial-Berechnung", 
    description: "Berechne erwarteten Return-on-Investment" 
  },
  { 
    title: "Handelsempfehlung", 
    description: "Generiere finale Kauf/Verkauf Empfehlung" 
  }
];

// Format trade date for display
export function formatTradeDate(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Calculate profit from an investment based on percentage
export function calculateProfit(tradeAmount: number, profitPercentage: number): number {
  return (tradeAmount * profitPercentage) / 100;
}

// Calculate buy price that would result in the given profit percentage at current market price
export function calculateBuyPrice(currentPrice: number, profitPercentage: number): number {
  return currentPrice / (1 + (profitPercentage / 100));
}

// Utility function to generate random crypto comparison data
export function generateCryptoComparison(cryptoData: any[]): CryptoComparisonProps {
  // Generate random comparison data
  const symbols = ["BTC", "ETH", "ADA", "SOL", "DOT", "AVAX", "MATIC"];
  const prices = [50000, 3500, 1.2, 150, 20, 35, 2.5];
  const changes = [-3.5, 2.8, 5.2, -1.5, 4.1, -2.3, 1.8];
  
  // Pick two random indexes
  const idx1 = Math.floor(Math.random() * symbols.length);
  let idx2 = Math.floor(Math.random() * symbols.length);
  
  // Make sure idx2 is different from idx1
  while (idx2 === idx1) {
    idx2 = Math.floor(Math.random() * symbols.length);
  }
  
  return {
    symbol: cryptoData && cryptoData.length > 0 
      ? cryptoData[Math.floor(Math.random() * cryptoData.length)].symbol
      : symbols[idx1],
    price: cryptoData && cryptoData.length > 0 
      ? cryptoData[Math.floor(Math.random() * cryptoData.length)].current_price
      : prices[idx1],
    change: Math.random() > 0.5 ? Math.random() * 8 : -Math.random() * 5
  };
}

// Utility to select a random crypto for trading
export function selectRandomCrypto(cryptoData: any[]) {
  if (!cryptoData || cryptoData.length === 0) {
    return {
      symbol: "BTC",
      name: "Bitcoin",
      currentPrice: 50000,
      priceChangePercentage24h: 5.2
    };
  }
  
  // Prefer cryptos with positive movement if available
  const positiveMovers = cryptoData.filter(crypto => 
    crypto.priceChangePercentage24h > 0
  );
  
  const selection = positiveMovers.length > 0
    ? positiveMovers[Math.floor(Math.random() * positiveMovers.length)]
    : cryptoData[Math.floor(Math.random() * cryptoData.length)];
    
  return selection;
}

// Other utility functions can be added here
