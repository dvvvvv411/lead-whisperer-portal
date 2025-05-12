import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Award, Medal } from "lucide-react";

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
  icon: React.ReactNode;
  benefits: string[];
}

const levels: Level[] = [
  { 
    name: "Anfänger", 
    minBalance: 250, 
    maxBalance: 1000, 
    tradesPerDay: 2,
    color: "text-amber-300",
    borderColor: "border-amber-400/30",
    bgColor: "bg-amber-400/20",
    icon: <Award className="h-4 w-4 mr-1 text-amber-400" />,
    benefits: ["Zugang zum Trading Bot", "2 Trades pro Tag"]
  },
  { 
    name: "Profi", 
    minBalance: 1000, 
    maxBalance: 5000, 
    tradesPerDay: 4,
    color: "text-gray-300",
    borderColor: "border-gray-400/30",
    bgColor: "bg-gray-400/20",
    icon: <Medal className="h-4 w-4 mr-1 text-gray-300" />,
    benefits: ["4 Trades pro Tag", "Höhere Gewinnchancen"]
  },
  { 
    name: "Experte", 
    minBalance: 5000, 
    maxBalance: 10000, 
    tradesPerDay: 6,
    color: "text-yellow-400",
    borderColor: "border-yellow-400/30",
    bgColor: "bg-yellow-400/20",
    icon: <Medal className="h-4 w-4 mr-1 text-yellow-400" />,
    benefits: ["6 Trades pro Tag", "Verbesserte Analyse", "Erweiterte Handelszeiten"]
  },
  { 
    name: "Platin", 
    minBalance: 10000, 
    maxBalance: 100000, 
    tradesPerDay: 8,
    color: "text-blue-300",
    borderColor: "border-blue-300/30",
    bgColor: "bg-blue-300/20",
    icon: <Trophy className="h-4 w-4 mr-1 text-blue-300" />,
    benefits: ["8 Trades pro Tag", "Persönlicher Support", "Exklusive Assets"]
  },
  { 
    name: "Diamant", 
    minBalance: 100000, 
    maxBalance: null, 
    tradesPerDay: 10,
    color: "text-purple-300",
    borderColor: "border-purple-300/30",
    bgColor: "bg-purple-300/20",
    icon: <Trophy className="h-4 w-4 mr-1 text-purple-300" />,
    benefits: ["Unbegrenzte Trades", "VIP Support", "Maximale Gewinne"]
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

  // Get badge element based on level
  const getLevelBadge = (level: Level, isActive: boolean) => {
    const baseClasses = "flex items-center text-lg py-2 px-4 rounded-full mx-auto mb-4 border";
    
    let badgeClasses = baseClasses;
    let iconElement;
    
    if (isActive) {
      // Active level styling
      badgeClasses += ` animate-pulse ${level.bgColor} ${level.borderColor} shadow-[0_0_15px_rgba(255,215,0,0.3)]`;
      
      // Select icon based on level name
      if (level.name === "Diamant" || level.name === "Platin") {
        iconElement = <Trophy className="h-6 w-6 mr-2 text-gold" />;
      } else if (level.name === "Experte") {
        iconElement = <Medal className="h-6 w-6 mr-2 text-yellow-400" />;
      } else if (level.name === "Profi") {
        iconElement = <Medal className="h-6 w-6 mr-2 text-gray-300" />;
      } else {
        iconElement = <Award className="h-6 w-6 mr-2 text-amber-400" />;
      }
    } else {
      // Inactive level styling
      badgeClasses += " bg-black/20 border-gray-700/30 opacity-50";
      iconElement = level.icon;
    }
    
    return (
      <div className={badgeClasses}>
        {iconElement}
        <span className={isActive ? "text-gold font-semibold" : "text-white/70"}>
          {level.name}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6 relative p-2">
      {/* Animated floating elements */}
      <div className="absolute top-10 left-4 w-16 h-16 bg-gold/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-10 right-8 w-12 h-12 bg-accent1/20 rounded-full blur-xl animate-float" style={{animationDelay: "1s"}}></div>
      
      <div className="text-center mb-8">
        <div className="text-sm text-white/60 mb-2">Ihr Trading Level</div>
        <div className="flex justify-center">
          {activeLevel && getLevelBadge(activeLevel, true)}
        </div>
      </div>

      {nextLevel && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2 text-white/70">
            <span>Fortschritt zum nächsten Level</span>
            <span>{currentBalance.toLocaleString('de-DE')}€ / {nextLevel.minBalance.toLocaleString('de-DE')}€</span>
          </div>
          <Progress 
            value={progressToNextLevel} 
            className="h-2 bg-gray-800"
            indicatorClassName="bg-gradient-to-r from-gold/80 to-amber-500"
          />
        </div>
      )}
      
      <div className="space-y-4 mt-8">
        <div className="text-lg font-medium mb-2 flex items-center text-white/90">
          <Trophy className="mr-2 h-5 w-5 text-gold-light" />
          <span>Verfügbare Trades & Level</span>
        </div>
        
        {levels.map((level, index) => {
          const isActive = activeLevel?.name === level.name;
          const isCompleted = currentBalance >= level.minBalance;
          const progressValue = animationComplete ? (isCompleted ? 100 : progressValues[index]) : progressValues[index] || 0;
          
          return (
            <div 
              key={level.name} 
              className={`rounded-lg border backdrop-blur-sm p-4 transition-all duration-300 ${
                isActive 
                  ? `border-gold/50 shadow-[0_0_15px_rgba(255,215,0,0.15)] ${level.bgColor}`
                  : isCompleted
                    ? 'border-gold/30 bg-gold/5'
                    : 'border-gray-700/30 bg-black/20'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium flex items-center">
                  {isCompleted && <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />}
                  <span className={isCompleted ? 'text-gold-light' : level.color}>
                    {level.name}
                  </span>
                </div>
                <Badge variant="outline" className={`${isActive ? level.bgColor : ''} ${level.borderColor}`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span className={isActive ? level.color : 'text-white/70'}>
                    {level.tradesPerDay} Trades/Tag
                  </span>
                </Badge>
              </div>
              
              <div className="flex justify-between text-xs text-white/50 mb-2">
                <span>{level.minBalance.toLocaleString('de-DE')}€</span>
                <span>{level.maxBalance ? `${level.maxBalance.toLocaleString('de-DE')}€` : 'Unbegrenzt'}</span>
              </div>
              
              <Progress 
                value={progressValue} 
                className="h-1.5 bg-gray-800"
                indicatorClassName={`${
                  isCompleted 
                    ? 'bg-gradient-to-r from-green-500 to-green-400' 
                    : isActive 
                      ? 'bg-gradient-to-r from-gold to-amber-500' 
                      : 'bg-gray-600'
                } transition-all duration-1000`}
              />
              
              {/* Level benefits */}
              {isActive && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {level.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center text-xs bg-black/30 p-2 rounded border border-gold/10">
                      <div className="h-2 w-2 rounded-full bg-gold/70 mr-2"></div>
                      <span className="text-white/70">{benefit}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Animated "Keep trading" encouragement text */}
        <div className="text-center py-4 text-sm text-gold/80 animate-pulse mt-6">
          Handeln Sie regelmäßig um Ihr Level zu erhöhen und mehr Vorteile freizuschalten!
        </div>
      </div>
    </div>
  );
};

export default LevelProgressChart;
