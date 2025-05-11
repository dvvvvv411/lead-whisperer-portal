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
  if (cryptoData && cryptoData.length > 0) {
    // Use real crypto data if available
    const randomCrypto = cryptoData[Math.floor(Math.random() * cryptoData.length)];
    return {
      symbol: randomCrypto.symbol,
      price: randomCrypto.current_price,
      change: randomCrypto.price_change_percentage_24h || (Math.random() > 0.5 ? Math.random() * 8 : -Math.random() * 5),
      logoUrl: randomCrypto.image_url
    };
  } else {
    // Fallback to default values if no crypto data is available
    const symbols = ["BTC", "ETH", "ADA", "SOL", "DOT", "AVAX", "MATIC"];
    const prices = [50000, 3500, 1.2, 150, 20, 35, 2.5];
    const idx = Math.floor(Math.random() * symbols.length);
    
    return {
      symbol: symbols[idx],
      price: prices[idx],
      change: Math.random() > 0.5 ? Math.random() * 8 : -Math.random() * 5,
      logoUrl: undefined
    };
  }
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
