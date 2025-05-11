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

// Utility function to generate random crypto comparison data
export function generateCryptoComparison(cryptoData: any[]): CryptoComparisonProps {
  // Generate random comparison data
  const metrics = ["Volatilität", "Momentum", "Handelsvolumen", "Korrelation", "Markttiefe"];
  const metric = metrics[Math.floor(Math.random() * metrics.length)];
  
  // Use real crypto data if available, otherwise fallback to defaults
  const cryptos = cryptoData && cryptoData.length >= 2 
    ? [cryptoData[Math.floor(Math.random() * cryptoData.length)], cryptoData[Math.floor(Math.random() * cryptoData.length)]]
    : [{ name: "Bitcoin", symbol: "BTC" }, { name: "Ethereum", symbol: "ETH" }];
  
  // Ensure we don't compare the same crypto
  if (cryptos[0].symbol === cryptos[1].symbol) {
    cryptos[1] = { name: "Cardano", symbol: "ADA" };
  }
  
  // Generate random scores ensuring the first one is usually higher (for visual effect)
  const score1 = Math.floor(Math.random() * 40) + 60; // 60-99
  const score2 = Math.floor(Math.random() * 60) + 30; // 30-89
  
  return {
    metric,
    crypto1: {
      name: cryptos[0].name,
      symbol: cryptos[0].symbol,
      score: score1
    },
    crypto2: {
      name: cryptos[1].name,
      symbol: cryptos[1].symbol,
      score: score2
    }
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
