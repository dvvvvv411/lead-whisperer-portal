
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Coins, BarChart3 } from "lucide-react";

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
    name: "Einsteiger", 
    minBalance: 0, 
    maxBalance: 500, 
    tradesPerDay: 5,
    color: "text-gray-300",
    borderColor: "border-gray-400/30",
    bgColor: "bg-gray-400/20"
  },
  { 
    name: "Bronze", 
    minBalance: 500, 
    maxBalance: 2000, 
    tradesPerDay: 10,
    color: "text-amber-700",
    borderColor: "border-amber-700/30",
    bgColor: "bg-amber-700/20"
  },
  { 
    name: "Silber", 
    minBalance: 2000, 
    maxBalance: 5000, 
    tradesPerDay: 15,
    color: "text-gray-400",
    borderColor: "border-gray-400/30",
    bgColor: "bg-gray-400/20"
  },
  { 
    name: "Gold", 
    minBalance: 5000, 
    maxBalance: 10000, 
    tradesPerDay: 20,
    color: "text-gold",
    borderColor: "border-gold/30",
    bgColor: "bg-gold/20"
  },
  { 
    name: "Platin", 
    minBalance: 10000, 
    maxBalance: 25000, 
    tradesPerDay: 30,
    color: "text-blue-300",
    borderColor: "border-blue-300/30",
    bgColor: "bg-blue-300/20"
  },
  { 
    name: "Diamant", 
    minBalance: 25000, 
    maxBalance: null, 
    tradesPerDay: 50,
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
    // Determine current level
    const current = levels.findLast(level => currentBalance >= level.minBalance) || levels[0];
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
      const newValues = levels.map((_, index) => {
        return Math.min(100, index * 20);
      });
      setProgressValues(newValues);
      
      setTimeout(() => {
        setAnimationComplete(true);
      }, 800);
    };
    
    animate();
  }, [currentBalance]);

  return (
    <div className="space-y-6 relative">
      {/* Animated floating element */}
      <div className="absolute top-10 left-4 w-16 h-16 bg-gold/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-10 right-8 w-12 h-12 bg-accent1/20 rounded-full blur-xl animate-float" style={{animationDelay: "1s"}}></div>
      
      <div className="text-center mb-8">
        <div className="text-sm text-muted-foreground mb-2">Ihr aktuelles Level</div>
        <div className="flex justify-center">
          <Badge 
            className={`text-lg py-1 px-4 ${activeLevel?.bgColor} ${activeLevel?.color} ${activeLevel?.borderColor}`}
          >
            <Coins className="h-4 w-4 mr-2" />
            {activeLevel?.name}
          </Badge>
        </div>
      </div>

      {nextLevel && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Fortschritt zum nächsten Level</span>
            <span>{currentBalance}€ / {nextLevel.minBalance}€</span>
          </div>
          <Progress 
            value={progressToNextLevel} 
            className="h-2 bg-gray-800"
            indicatorClassName="bg-gradient-to-r from-accent1/80 to-accent1-light"
          />
        </div>
      )}
      
      <div className="space-y-4 mt-8">
        <div className="text-lg font-medium mb-2">Level & Trading-Limits</div>
        
        {levels.map((level, index) => {
          const isActive = activeLevel?.name === level.name;
          const progressValue = animationComplete ? 100 : progressValues[index] || 0;
          
          return (
            <div key={level.name} className={`rounded-lg border p-3 transition-all duration-300 ${
              isActive 
                ? `border-gold/50 shadow-glow ${level.bgColor}`
                : 'border-gray-700/30'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <div className="font-medium flex items-center">
                  <span className={level.color}>{level.name}</span>
                </div>
                <Badge variant="outline" className={`${level.bgColor} ${level.borderColor}`}>
                  <BarChart3 className="h-3 w-3 mr-1" />
                  <span className={level.color}>{level.tradesPerDay} Trades/Tag</span>
                </Badge>
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Min: {level.minBalance}€</span>
                <span>{level.maxBalance ? `Max: ${level.maxBalance}€` : 'Unbegrenzt'}</span>
              </div>
              
              <Progress 
                value={progressValue} 
                className="h-1 bg-gray-800"
                indicatorClassName={`${isActive ? 'bg-gold' : 'bg-gray-600'} transition-all duration-1000`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LevelProgressChart;
