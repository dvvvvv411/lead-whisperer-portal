
import React from 'react';
import { Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const SecurityNotice = () => {
  return (
    <Card className="backdrop-blur-xl bg-black/30 border-gold/10 overflow-hidden transform transition-all duration-300 hover:translate-y-[-2px] shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-accent1/20 to-accent1/10 p-3">
              <Shield className="w-8 h-8 text-gold" />
            </div>
          </div>
          <div className="flex-grow text-center md:text-left">
            <h3 className="text-gold-light text-lg font-medium mb-2">Datensicherheit</h3>
            <p className="text-white/70">
              Alle Ihre persönlichen Daten werden sicher in verschlüsselter Form gespeichert und vertraulich behandelt. 
              Wir verwenden modernste Sicherheitstechnologien, um Ihre Informationen zu schützen.
            </p>
            <p className="text-gold/60 text-sm mt-2 italic">
              Wir geben Ihre Daten niemals an Dritte weiter und halten uns strikt an die DSGVO.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityNotice;
