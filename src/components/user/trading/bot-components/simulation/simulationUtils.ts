
import { CryptoComparisonProps } from "./CryptoComparison";

// Algorithm steps shown during simulation
export const algorithmSteps = [
  { title: "Initializing", description: "Starte Marktdatenanalyse" },
  { title: "Market Scan", description: "Scanne nach profitablen Trading-Paaren" },
  { title: "Pattern Analysis", description: "Analysiere Kurs-Muster und Trends" },
  { title: "Risk Assessment", description: "Bewerte Marktrisiken und Volatilität" },
  { title: "Signal Generation", description: "Generiere Buy/Sell Signale" },
  { title: "Backtesting", description: "Teste Strategie gegen historische Daten" },
  { title: "Optimization", description: "Optimiere Handelsparameter" },
  { title: "Strategy Selection", description: "Wähle optimale Handelsstrategie" },
  { title: "Trade Execution", description: "Bereite Handelsausführung vor" },
  { title: "Final Confirmation", description: "Finalisiere Handelsentscheidung" }
];

// Function to select a random cryptocurrency for the trade
export const selectRandomCrypto = (cryptoData: any[]) => {
  if (!cryptoData || cryptoData.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * cryptoData.length);
  return cryptoData[randomIndex];
};

// Generate crypto comparison data for the simulation
export const generateCryptoComparison = (cryptoData: any[]): CryptoComparisonProps => {
  if (!cryptoData || cryptoData.length === 0) {
    // Generate fallback data if no crypto data is available
    return {
      symbol: "BTC",
      name: "Bitcoin",
      price: 50000 + Math.random() * 5000,
      change: (Math.random() * 10) - 5,
      logoUrl: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png"
    };
  }

  // Choose a random cryptocurrency from the data
  const randomCrypto = selectRandomCrypto(cryptoData);
  
  // Calculate a semi-random price change percentage
  const changeDirection = Math.random() > 0.5 ? 1 : -1;
  const changePercent = changeDirection * (Math.random() * 5);
  
  return {
    symbol: randomCrypto.symbol?.toUpperCase() || "BTC",
    name: randomCrypto.name || "Bitcoin",
    price: randomCrypto.current_price || 50000,
    change: changePercent,
    logoUrl: randomCrypto.image || null
  };
};

// Format trade date for display
export const formatTradeDate = (date: Date): string => {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Calculate buy price with a small random variation (adjusted to match the expected signature)
export const calculateBuyPrice = (basePrice: number, profitPercentage?: number): number => {
  // Add a small random variation (±2%)
  const variation = (Math.random() * 4 - 2) / 100;
  return basePrice * (1 + variation);
};

// Calculate profit based on trade amount and profit percentage - FIXED to not divide by 100 again
export const calculateProfit = (tradeAmount: number, profitPercentage: number): number => {
  return tradeAmount * profitPercentage;
};

// Generate detailed simulation data for a trade
export const generateTradeSimulationData = (cryptoData: any[], tradeAmount: number) => {
  // Select a cryptocurrency for this trade
  const selectedCrypto = selectRandomCrypto(cryptoData);
  
  if (!selectedCrypto) {
    return null;
  }
  
  // Generate a profit percentage between 3-7.5%
  const profitPercentage = (Math.random() * 4.5 + 3) / 100;
  
  // Calculate buy price (current market price with small variation)
  const buyPrice = calculateBuyPrice(selectedCrypto.current_price);
  
  // Calculate quantity based on trade amount and buy price
  const quantity = tradeAmount / buyPrice;
  
  // Calculate profit amount
  const profitAmount = calculateProfit(tradeAmount, profitPercentage);
  
  // Calculate sell price based on buy price and profit
  const sellPrice = buyPrice * (1 + profitPercentage);
  
  return {
    crypto: {
      id: selectedCrypto.id,
      symbol: selectedCrypto.symbol?.toUpperCase() || "BTC",
      name: selectedCrypto.name || "Bitcoin",
      image: selectedCrypto.image || null
    },
    tradeDetails: {
      buyPrice,
      sellPrice,
      quantity,
      tradeAmount,
      profitAmount,
      profitPercentage,
      tradeDate: new Date()
    },
    strategy: `bot_optimal_${selectedCrypto.symbol?.toUpperCase() || "BTC"}_${Math.floor(Math.random() * 1000)}`
  };
};
