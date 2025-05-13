
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const RobotCoinAnimation = () => {
  // State for animation and wallet level
  const [isAnimating, setIsAnimating] = useState(false);
  const [walletLevel, setWalletLevel] = useState(1);
  const [coinGroups, setCoinGroups] = useState([0, 1, 2]); // Initial coin groups
  
  // Set up continuous animation cycle
  useEffect(() => {
    // Start animation immediately
    setIsAnimating(true);
    
    // Set up the continuous animation with coin recycling
    const coinRecycleInterval = setInterval(() => {
      // Rotate coin groups to create continuous flow
      setCoinGroups(prev => [...prev.slice(1), prev[0]]);
      
      // Increase wallet level periodically
      if (Math.random() > 0.7) {
        setWalletLevel(prevLevel => {
          const newLevel = prevLevel + 1;
          // Reset level after reaching max to create a cycling effect
          return newLevel > 5 ? 1 : newLevel;
        });
      }
    }, 2000); // Recycle coins every 2 seconds
    
    return () => {
      clearInterval(coinRecycleInterval);
    };
  }, []);
  
  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute w-40 h-40 bg-gold/5 rounded-full filter blur-xl top-0 right-8 animate-pulse opacity-70"></div>
      <div className="absolute w-32 h-32 bg-accent1/5 rounded-full filter blur-xl bottom-4 left-10 animate-pulse opacity-50" style={{ animationDelay: '1s' }}></div>
      
      {/* SVG Animation Container */}
      <div className="relative z-10 w-full max-w-[300px]">
        <svg viewBox="0 0 400 200" className="w-full">
          {/* Circuit Board Background */}
          <g className="text-gold/10">
            <path d="M10,50 L50,50 L50,100 L100,100" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M30,20 L30,80 L80,80 L80,140" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M100,30 L150,30 L150,70" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M200,10 L200,50 L240,50" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M260,70 L300,70 L300,120" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M350,40 L350,100 L320,100" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="50" cy="50" r="3" fill="currentColor" />
            <circle cx="80" cy="80" r="3" fill="currentColor" />
            <circle cx="150" cy="70" r="3" fill="currentColor" />
            <circle cx="240" cy="50" r="3" fill="currentColor" />
            <circle cx="300" cy="120" r="3" fill="currentColor" />
            <circle cx="320" cy="100" r="3" fill="currentColor" />
          </g>

          {/* Robot */}
          <g className={cn("transform-gpu transition-transform duration-700", 
             isAnimating ? "translate-x-[-5px] translate-y-[-2px]" : ""
          )}>
            {/* Robot Body */}
            <rect x="60" y="80" width="60" height="70" rx="10" fill="#1A1F2C" className="stroke-gold/40" strokeWidth="2" />
            
            {/* Robot Head */}
            <rect x="70" y="50" width="40" height="35" rx="8" fill="#21283B" className="stroke-gold/40" strokeWidth="2" />
            
            {/* Robot Eyes */}
            <circle cx="82" cy="65" r="5" className="fill-gold/60 animate-glow-pulse" />
            <circle cx="98" cy="65" r="5" className="fill-gold/60 animate-glow-pulse" style={{ animationDelay: '0.5s' }} />
            
            {/* Robot Antenna */}
            <line x1="90" y1="50" x2="90" y2="40" stroke="#8B5CF6" strokeWidth="2" />
            <circle cx="90" cy="36" r="4" fill="#8B5CF6" className="animate-pulse" />
            
            {/* Robot Arm Base */}
            <rect x="120" y="90" width="20" height="10" fill="#21283B" className="stroke-gold/40" strokeWidth="1" />
          </g>

          {/* Robot Arm (Animated) */}
          <g className={cn(
            "transform-gpu transition-all duration-1000 origin-[130px_95px]",
            isAnimating ? "rotate-[-10deg]" : ""
          )}>
            <rect x="130" y="90" width="70" height="10" rx="5" fill="#21283B" className="stroke-gold/40" strokeWidth="1" />
            
            {/* Robot Hand */}
            <g className={cn(
              "transform-gpu transition-all duration-500",
              isAnimating ? "translate-y-[3px]" : ""
            )}>
              <rect x="190" y="85" width="15" height="20" rx="5" fill="#21283B" className="stroke-gold/40" strokeWidth="1" />
              <rect x="193" y="80" width="3" height="8" rx="1" fill="#21283B" className="stroke-gold/40" strokeWidth="1" />
              <rect x="199" y="80" width="3" height="8" rx="1" fill="#21283B" className="stroke-gold/40" strokeWidth="1" />
            </g>
          </g>

          {/* CONTINUOUS STREAM OF COINS - Group 1 */}
          {coinGroups.map((groupIndex, index) => (
            <g key={groupIndex} className={cn(
              "transform-gpu",
              index === 0 
                ? "animate-[coin-transfer_2000ms_ease-in-out_forwards]" 
                : "opacity-0"
            )}>
              {/* First Coin */}
              <circle cx="200" cy="100" r="12" fill="url(#goldGradient)" className="stroke-gold" strokeWidth="1" />
              <text x="200" y="104" textAnchor="middle" fontSize="12" fill="#000" fontWeight="bold">€</text>
              
              {/* Second Coin - Slightly offset */}
              <circle cx="185" cy="110" r="10" fill="url(#goldGradient)" className="stroke-gold" strokeWidth="1" />
              <text x="185" y="114" textAnchor="middle" fontSize="10" fill="#000" fontWeight="bold">€</text>
              
              {/* Third Coin - More offset */}
              <circle cx="210" cy="110" r="8" fill="url(#goldGradient)" className="stroke-gold" strokeWidth="1" />
              <text x="210" y="113" textAnchor="middle" fontSize="8" fill="#000" fontWeight="bold">€</text>
            </g>
          ))}

          {/* Digital Wallet - Now with level-up effect */}
          <g className={cn(
            "wallet transform-gpu transition-all duration-300",
            `scale-${100 + walletLevel * 3}`,
          )} style={{ transformOrigin: '320px 133px' }}>
            {/* Wallet Base with level-based sizing and glow */}
            <rect 
              x="290" y="110" 
              width="60" height="45" 
              rx="8" 
              fill="#21283B" 
              className={cn(
                "stroke-gold/40 transition-all duration-500",
                walletLevel > 1 ? "animate-pulse" : ""
              )} 
              strokeWidth={1 + walletLevel * 0.2}
              filter={walletLevel > 2 ? "url(#glow)" : ""}
            />
            
            {/* Wallet Screen */}
            <rect 
              x="295" y="120" 
              width="50" height="25" 
              rx="4" 
              fill="#0d1117" 
              className="stroke-gold/20" 
              strokeWidth="1"
            />
            
            {/* Wallet Screen Content */}
            <g className="transition-opacity duration-1000 opacity-100">
              <rect x="300" y="125" width="40" height="3" rx="1" fill="#8B5CF6" className="animate-pulse" />
              <rect x="300" y="131" width="30" height="3" rx="1" fill="#6366F1" />
              <rect x="300" y="137" width="20" height="3" rx="1" fill="#8B5CF6" />
              
              {/* Balance Counter - Shows current level */}
              <rect 
                x="325" y="131" 
                width="15" height="9" 
                rx="2" 
                className={cn(
                  "fill-black/40 stroke-gold/30 transition-all duration-300",
                  walletLevel > 1 ? "animate-pulse" : ""
                )} 
                strokeWidth="1" 
              />
              
              <text 
                x="332" y="138" 
                textAnchor="middle" 
                fontSize="7" 
                className={cn(
                  "fill-gold transition-all duration-300",
                  walletLevel > 1 ? "animate-pulse" : ""
                )}
              >
                {walletLevel}
              </text>
            </g>
            
            {/* Wallet Light Indicator - Brighter with higher levels */}
            <circle 
              cx="320" cy="115" r="2" 
              className={cn(
                "transition-all duration-300",
                walletLevel === 1 ? "fill-gold/50" : 
                walletLevel === 2 ? "fill-gold/70" : 
                walletLevel === 3 ? "fill-gold/90" : 
                "fill-gold animate-pulse"
              )} 
            />

            {/* Level indicator rings that appear at higher levels */}
            {walletLevel >= 3 && (
              <circle 
                cx="320" cy="115" r="4" 
                fill="none"
                className="stroke-gold/30 animate-pulse" 
                strokeWidth="1"
              />
            )}
            {walletLevel >= 4 && (
              <circle 
                cx="320" cy="115" r="6" 
                fill="none"
                className="stroke-gold/20 animate-pulse" 
                strokeWidth="1"
                style={{ animationDelay: '0.2s' }}
              />
            )}
            {walletLevel >= 5 && (
              <circle 
                cx="320" cy="115" r="8" 
                fill="none"
                className="stroke-gold/10 animate-pulse" 
                strokeWidth="1"
                style={{ animationDelay: '0.4s' }}
              />
            )}

            {/* Coin Absorption Effect - Shows when coins arrive */}
            <g className="animate-[wallet-receive_500ms_ease-in-out_infinite]">
              <circle cx="320" cy="133" r="8" className="fill-gold/30 animate-ping" />
            </g>
          </g>

          {/* Gradients and Filters */}
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#FFDF33" />
              <stop offset="100%" stopColor="#E6C200" />
            </linearGradient>
            
            {/* Glow effect for wallet level-up */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feFlood floodColor="#FFD700" floodOpacity="0.3" result="coloredBlur" />
              <feComposite in="coloredBlur" in2="blur" operator="in" result="coloredBlurIn" />
              <feComposite in="SourceGraphic" in2="coloredBlurIn" operator="over" />
            </filter>
            
            {/* Define custom keyframe animations */}
            <style type="text/css">{`
              @keyframes coin-transfer {
                0% { transform: translateX(0) translateY(0); opacity: 1; }
                80% { transform: translateX(100px) translateY(30px); opacity: 1; }
                100% { transform: translateX(100px) translateY(30px); opacity: 0; }
              }
              
              @keyframes wallet-receive {
                0% { opacity: 0; transform: scale(0.2); }
                50% { opacity: 0.5; transform: scale(1.2); }
                100% { opacity: 0; transform: scale(1.5); }
              }
            `}</style>
          </defs>
        </svg>
      </div>
      
      {/* Explanatory Text */}
      <div className="absolute bottom-[-20px] left-0 right-0 text-center text-gold-light opacity-80 text-sm font-medium">
        Automatisierte, sichere Auszahlungen
      </div>
    </div>
  );
};

export default RobotCoinAnimation;
