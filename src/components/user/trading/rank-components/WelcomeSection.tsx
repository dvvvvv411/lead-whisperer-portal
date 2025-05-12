
import React from 'react';

interface WelcomeSectionProps {
  userName?: string;
}

const WelcomeSection = ({ userName }: WelcomeSectionProps) => {
  return (
    <div className="text-center space-y-4 py-2">
      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light animate-fade-in">
        Willkommen zurück im Dashboard!
      </h3>
      
      <div className="text-sm text-muted-foreground max-w-[220px] mx-auto">
        <p>Starten Sie den KI-Bot für</p>
        <p>intelligente Trading-Entscheidungen</p>
      </div>
    </div>
  );
};

export default WelcomeSection;
