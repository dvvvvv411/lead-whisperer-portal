
import React from 'react';

interface WelcomeSectionProps {
  userName?: string;
}

const WelcomeSection = ({ userName }: WelcomeSectionProps) => {
  return (
    <div className="text-center py-2">
      <div className="mb-3">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light animate-fade-in">
          Willkommen zurück
        </h3>
        <h4 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-gold/80 to-gold-light/80 mt-1">
          im Dashboard!
        </h4>
      </div>
      
      <div className="text-sm text-muted-foreground max-w-[220px] mx-auto">
        <p>Starten Sie den KI-Bot für</p>
        <p>intelligente Trading-Entscheidungen</p>
      </div>
    </div>
  );
};

export default WelcomeSection;
