
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

const RobotCoinAnimation = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative w-full h-64 flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Effects */}
      <div className="absolute w-40 h-40 bg-gold/5 rounded-full filter blur-xl top-0 right-8 animate-pulse opacity-70"></div>
      <div className="absolute w-32 h-32 bg-accent1/5 rounded-full filter blur-xl bottom-4 left-10 animate-pulse opacity-50" style={{ animationDelay: '1s' }}></div>
      
      {/* SVG Animation Container */}
      <div className={cn(
        "relative z-10 w-full max-w-[300px] transition-all duration-500",
        isHovered ? "scale-105" : ""
      )}>
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
             isHovered ? "translate-x-[-10px] translate-y-[-5px]" : ""
          )}>
            {/* Robot Body */}
            <rect x="60" y="80" width="60" height="70" rx="10" fill="#1A1F2C" className="stroke-gold/40" strokeWidth="2" />
            
            {/* Robot Head */}
            <rect x="70" y="50" width="40" height="35" rx="8" fill="#21283B" className="stroke-gold/40" strokeWidth="2" />
            
            {/* Robot Eyes */}
            <circle cx="82" cy="65" r="5" className={cn(
              "fill-gold/60 animate-glow-pulse",
              isHovered ? "fill-gold/90" : ""
            )} />
            <circle cx="98" cy="65" r="5" className={cn(
              "fill-gold/60 animate-glow-pulse",
              isHovered ? "fill-gold/90" : ""
            )} style={{ animationDelay: '0.5s' }} />
            
            {/* Robot Antenna */}
            <line x1="90" y1="50" x2="90" y2="40" stroke="#8B5CF6" strokeWidth="2" />
            <circle cx="90" cy="36" r="4" fill="#8B5CF6" className="animate-pulse" />
            
            {/* Robot Arm Base */}
            <rect x="120" y="90" width="20" height="10" fill="#21283B" className="stroke-gold/40" strokeWidth="1" />
          </g>

          {/* Robot Arm (Animated) */}
          <g className={cn(
            "transform-gpu transition-all duration-1000 origin-[130px_95px]",
            isHovered ? "rotate-[-10deg]" : ""
          )}>
            <rect x="130" y="90" width="70" height="10" rx="5" fill="#21283B" className="stroke-gold/40" strokeWidth="1" />
            
            {/* Robot Hand */}
            <g className={cn(
              "transform-gpu transition-all duration-500",
              isHovered ? "translate-y-[3px]" : ""
            )}>
              <rect x="190" y="85" width="15" height="20" rx="5" fill="#21283B" className="stroke-gold/40" strokeWidth="1" />
              <rect x="193" y="80" width="3" height="8" rx="1" fill="#21283B" className="stroke-gold/40" strokeWidth="1" />
              <rect x="199" y="80" width="3" height="8" rx="1" fill="#21283B" className="stroke-gold/40" strokeWidth="1" />
            </g>
          </g>

          {/* Coins Group - Moving */}
          <g className="coins-group">
            {/* First Coin */}
            <g className={cn(
              "transform-gpu transition-all duration-[1500ms]",
              isHovered ? "translate-x-[100px] translate-y-[30px]" : ""
            )}>
              <circle cx="200" cy="100" r="12" fill="url(#goldGradient)" className="stroke-gold" strokeWidth="1" />
              <text x="200" y="104" textAnchor="middle" fontSize="12" fill="#000" fontWeight="bold">€</text>
            </g>
            
            {/* Second Coin - Delayed */}
            <g className={cn(
              "transform-gpu transition-all duration-[1800ms]",
              isHovered ? "translate-x-[90px] translate-y-[25px]" : ""
            )} style={{ transitionDelay: '300ms' }}>
              <circle cx="185" cy="110" r="10" fill="url(#goldGradient)" className="stroke-gold" strokeWidth="1" />
              <text x="185" y="114" textAnchor="middle" fontSize="10" fill="#000" fontWeight="bold">€</text>
            </g>
            
            {/* Third Coin - More Delayed */}
            <g className={cn(
              "transform-gpu transition-all duration-[2000ms]",
              isHovered ? "translate-x-[110px] translate-y-[35px]" : ""
            )} style={{ transitionDelay: '600ms' }}>
              <circle cx="210" cy="110" r="8" fill="url(#goldGradient)" className="stroke-gold" strokeWidth="1" />
              <text x="210" y="113" textAnchor="middle" fontSize="8" fill="#000" fontWeight="bold">€</text>
            </g>
          </g>

          {/* Digital Wallet */}
          <g className="wallet">
            {/* Wallet Base */}
            <rect x="290" y="110" width="60" height="45" rx="8" fill="#21283B" className="stroke-gold/40" strokeWidth="2" />
            
            {/* Wallet Screen */}
            <rect x="295" y="120" width="50" height="25" rx="4" fill="#0d1117" className="stroke-gold/20" strokeWidth="1" />
            
            {/* Wallet Screen Content */}
            <g className={cn(
              "transition-opacity duration-1000",
              isHovered ? "opacity-100" : "opacity-50"
            )}>
              <rect x="300" y="125" width="40" height="3" rx="1" fill="#8B5CF6" className="animate-pulse" />
              <rect x="300" y="131" width="30" height="3" rx="1" fill="#6366F1" />
              <rect x="300" y="137" width="20" height="3" rx="1" fill="#8B5CF6" />
              
              {/* Balance Counter - Glows when coins arrive */}
              <rect x="325" y="131" width="15" height="9" rx="2" className={cn(
                "fill-black/40 stroke-gold/30", 
                isHovered ? "animate-pulse" : ""
              )} strokeWidth="1" />
              
              <text x="332" y="138" textAnchor="middle" fontSize="7" className={cn(
                "fill-gold/70", 
                isHovered ? "fill-gold" : ""
              )}>+</text>
            </g>
            
            {/* Wallet Light Indicator */}
            <circle cx="320" cy="115" r="2" className={cn(
              "fill-gold/50",
              isHovered ? "animate-pulse fill-gold" : ""
            )} />
          </g>

          {/* Gradients and Filters */}
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#FFDF33" />
              <stop offset="100%" stopColor="#E6C200" />
            </linearGradient>
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
