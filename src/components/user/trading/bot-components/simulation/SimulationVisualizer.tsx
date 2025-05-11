
import React, { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp, Zap, Star } from "lucide-react";

interface SimulationVisualizerProps {
  progress: number;
  currentStep: number;
  totalSteps: number;
}

const SimulationVisualizer: React.FC<SimulationVisualizerProps> = ({
  progress,
  currentStep,
  totalSteps
}) => {
  // Generate random chart data that updates as simulation progresses
  const [chartData, setChartData] = useState<any[]>([]);
  const [animationPhase, setAnimationPhase] = useState<number>(0);
  
  // Update chart data with simulation progress
  useEffect(() => {
    const dataPoints = 12;
    const lastValue = chartData.length > 0 ? chartData[chartData.length - 1]?.value || 5000 : 5000;
    
    // Generate next data point with slight randomness
    // More variation as progress increases
    const volatility = Math.min(5, 1 + (progress / 25));
    const change = (Math.random() - 0.45) * volatility * 100; // Slight upward bias
    const newValue = Math.max(4000, Math.min(7000, lastValue + change));
    
    // Create new chart data
    const timestamp = Date.now();
    const newPoint = { timestamp, value: newValue };
    
    setChartData(prev => {
      const newData = [...prev, newPoint];
      // Keep only the last dataPoints entries
      return newData.slice(-dataPoints);
    });
    
    // Update animation phase for different visual effects
    setAnimationPhase((prev) => (prev + 1) % 4);
  }, [progress, currentStep]);
  
  // Formatted data for the chart
  const formattedChartData = chartData.map((point, i) => ({
    index: i,
    value: point.value,
    valueFormatted: new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(point.value)
  }));
  
  // Get the phase-based animations
  const getPhaseEffect = () => {
    switch (animationPhase) {
      case 1: return "from-gold/30 to-accent1/30";
      case 2: return "from-accent1/30 to-blue-500/30";
      case 3: return "from-blue-500/30 to-gold/30";
      default: return "from-gold/20 to-accent1/20";
    }
  };
  
  // Get progress-based animation speed
  const getAnimationSpeed = () => {
    if (progress > 80) return "animate-pulse";
    if (progress > 50) return "animate-glow-pulse";
    return "";
  };
  
  // Get message based on progress
  const getMessage = () => {
    if (progress < 25) return "Initializing data analysis...";
    if (progress < 50) return "Pattern recognition in progress...";
    if (progress < 75) return "Optimization algorithm running...";
    return "Finalizing trade recommendation...";
  };
  
  return (
    <div className="relative h-[200px] bg-gradient-to-br from-casino-darker to-casino-card rounded-lg p-4 overflow-hidden border border-gold/10 shadow-inner">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNDcsMTIxLDI0NywwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+PC9zdmc+')] opacity-20"></div>
      
      {/* Glowing background effect */}
      <div className={`absolute top-0 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${getPhaseEffect()} blur-3xl ${getAnimationSpeed()}`}></div>
      <div className={`absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br ${getPhaseEffect()} blur-3xl ${getAnimationSpeed()}`}></div>
      
      {/* Status message */}
      <div className="absolute top-0 left-0 right-0 p-2 text-center">
        <p className="text-sm text-gold/90 animate-fade-in">
          {getMessage()}
        </p>
      </div>
      
      {/* Chart */}
      <div className="h-full pt-6 relative z-10">
        {formattedChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedChartData}>
              <XAxis dataKey="index" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-casino-darker/90 border border-gold/20 rounded p-2 text-xs">
                        <p className="text-gold">{payload[0].payload.valueFormatted}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone"
                dataKey="value"
                stroke="#FFD700"
                strokeWidth={2}
                dot={false}
                animationDuration={300}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gold" />
              <span className="text-muted-foreground">Analyzing market data...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Crypto Trader Logo - Bottom left */}
      <div className="absolute bottom-2 left-2 opacity-70 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-gold to-accent1 shadow-glow flex items-center justify-center">
            <span className="text-xs font-bold text-black">CT</span>
          </div>
          <span className="text-xs font-medium text-gold/80">Crypto Trader</span>
        </div>
      </div>
      
      {/* Floating indicator icons */}
      <div className={`absolute bottom-2 right-2 ${progress > 50 ? "visible animate-fade-in" : "invisible"}`}>
        <div className="flex items-center gap-2">
          <Zap className={`h-5 w-5 text-accent1 ${progress > 75 ? "animate-pulse" : ""}`} />
          <Star className={`h-5 w-5 text-gold ${progress > 90 ? "animate-pulse" : ""}`} />
        </div>
      </div>
    </div>
  );
};

export default SimulationVisualizer;
