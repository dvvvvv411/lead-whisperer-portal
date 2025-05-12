
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Diamond } from "lucide-react";

interface LevelProgressChartProps {
  currentBalance: number;
}

interface Level {
  name: string;
  minBalance: number;
  maxBalance: number | null;
  tradesPerDay: number;
  color: string;
  borderColor: string;
  bgColor: string;
}

const levels: Level[] = [
  { 
    name: "Anfänger", 
    minBalance: 250, 
    maxBalance: 1000, 
    tradesPerDay: 2,
    color: "text-gray-300",
    borderColor: "border-gray-400/30",
    bgColor: "bg-gray-400/20"
  },
  { 
    name: "Profi", 
    minBalance: 1000, 
    maxBalance: 5000, 
    tradesPerDay: 4,
    color: "text-amber-600",
    borderColor: "border-amber-600/30",
    bgColor: "bg-amber-600/20"
  },
  { 
    name: "Experte", 
    minBalance: 5000, 
    maxBalance: 10000, 
    tradesPerDay: 6,
    color: "text-gold",
    borderColor: "border-gold/30",
    bgColor: "bg-gold/20"
  },
  { 
    name: "Platin", 
    minBalance: 10000, 
    maxBalance: 100000, 
    tradesPerDay: 8,
    color: "text-blue-300",
    borderColor: "border-blue-300/30",
    bgColor: "bg-blue-300/20"
  },
  { 
    name: "Diamant", 
    minBalance: 100000, 
    maxBalance: null, 
    tradesPerDay: 10,
    color: "text-accent1-light",
    borderColor: "border-accent1/30",
    bgColor: "bg-accent1/20"
  }
];

const LevelProgressChart: React.FC<LevelProgressChartProps> = ({ currentBalance }) => {
  const [progressValues, setProgressValues] = useState<number[]>([]);
  const [activeLevel, setActiveLevel] = useState<Level | null>(null);
  const [nextLevel, setNextLevel] = useState<Level | null>(null);
  const [progressToNextLevel, setProgressToNextLevel] = useState<number>(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Find the current level (using reverse loop instead of findLast)
    let current = levels[0]; // Default to first level
    for (let i = levels.length - 1; i >= 0; i--) {
      if (currentBalance >= levels[i].minBalance) {
        current = levels[i];
        break;
      }
    }
    setActiveLevel(current);

    // Find next level
    const nextLevelIndex = levels.findIndex(level => level.name === current.name) + 1;
    const next = nextLevelIndex < levels.length ? levels[nextLevelIndex] : null;
    setNextLevel(next);

    // Calculate progress to next level
    if (next) {
      const progressValue = ((currentBalance - current.minBalance) / (next.minBalance - current.minBalance)) * 100;
      setProgressToNextLevel(Math.min(Math.max(0, progressValue), 100));
    } else {
      setProgressToNextLevel(100); // Already at max level
    }

    // Animate all levels loading
    const animate = () => {
      const newValues = levels.map((level, index) => {
        // If current balance is higher than level minimum, fill to 100%
        if (currentBalance >= level.minBalance) {
          return 100;
        }
        // If it's the next level, show partial progress
        if (level.minBalance > currentBalance && index === levels.findIndex(l => l.minBalance > currentBalance)) {
          const prevLevel = index > 0 ? levels[index - 1] : { minBalance: 0 };
          return ((currentBalance - prevLevel.minBalance) / (level.minBalance - prevLevel.minBalance)) * 100;
        }
        // Future levels start at 0
        return 0;
      });
      setProgressValues(newValues);
      
      setTimeout(() => {
        setAnimationComplete(true);
      }, 800);
    };
    
    animate();
  }, [currentBalance]);

  return (
    <div className="space-y-6 relative p-2">
      {/* Animated floating elements */}
      <div className="absolute top-10 left-4 w-16 h-16 bg-gold/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-10 right-8 w-12 h-12 bg-accent1/20 rounded-full blur-xl animate-float" style={{animationDelay: "1s"}}></div>
      
      <div className="text-center mb-8">
        <div className="text-sm text-muted-foreground mb-2">Ihr Trading Level</div>
        <div className="flex justify-center">
          <Badge 
            className={`text-lg py-1 px-4 ${activeLevel?.bgColor} ${activeLevel?.color} ${activeLevel?.borderColor}`}
          >
            {activeLevel?.name === "Diamant" ? (
              <Diamond className="h-4 w-4 mr-2" />
            ) : activeLevel?.name === "Platin" || activeLevel?.name === "Experte" ? (
              <Trophy className="h-4 w-4 mr-2" />
            ) : (
              <TrendingUp className="h-4 w-4 mr-2" />
            )}
            {activeLevel?.name}
          </Badge>
        </div>
      </div>

      {nextLevel && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Fortschritt zum nächsten Level</span>
            <span>{currentBalance.toLocaleString('de-DE')}€ / {nextLevel.minBalance.toLocaleString('de-DE')}€</span>
          </div>
          <Progress 
            value={progressToNextLevel} 
            className="h-2 bg-gray-800"
            indicatorClassName="bg-gradient-to-r from-accent1/80 to-accent1-light"
          />
        </div>
      )}
      
      <div className="space-y-4 mt-8">
        <div className="text-lg font-medium mb-2 flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-accent1-light" />
          <span>Verfügbare Trades & Level</span>
        </div>
        
        {levels.map((level, index) => {
          const isActive = activeLevel?.name === level.name;
          const isCompleted = currentBalance >= level.minBalance;
          const progressValue = animationComplete ? (isCompleted ? 100 : progressValues[index]) : progressValues[index] || 0;
          
          return (
            <div 
              key={level.name} 
              className={`rounded-lg border p-4 transition-all duration-300 ${
                isActive 
                  ? `border-gold/50 shadow-glow ${level.bgColor}`
                  : isCompleted
                    ? 'border-gold/30 bg-gold/5'
                    : 'border-gray-700/30'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium flex items-center">
                  {isCompleted && <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />}
                  <span className={isCompleted ? 'text-gold' : level.color}>
                    {level.name}
                  </span>
                </div>
                <Badge variant="outline" className={`${isActive ? level.bgColor : ''} ${level.borderColor}`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span className={isActive ? level.color : ''}>
                    {level.tradesPerDay} Trades/Tag
                  </span>
                </Badge>
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>{level.minBalance.toLocaleString('de-DE')}€</span>
                <span>{level.maxBalance ? `${level.maxBalance.toLocaleString('de-DE')}€` : 'Unbegrenzt'}</span>
              </div>
              
              <Progress 
                value={progressValue} 
                className="h-1.5 bg-gray-800"
                indicatorClassName={`${
                  isCompleted 
                    ? 'bg-green-500' 
                    : isActive 
                      ? 'bg-gold' 
                      : 'bg-gray-600'
                } transition-all duration-1000`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LevelProgressChart;
