
import { Bot, ChevronRight, TrendingUp, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const BotInfoCard = () => {
  return (
    <div className="rounded-lg border border-accent1/20 bg-gradient-to-br from-accent1/10 to-accent1/5 p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent1/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold/10 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-2">
          <Bot className="h-5 w-5 text-accent1-light mr-2" />
          <h4 className="font-bold text-lg text-accent1-light">KI-Trading Bot</h4>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-foreground/90">
            Unser KI-Trading Bot analysiert kontinuierlich den Kryptomarkt und nutzt fortschrittliche 
            Algorithmen, um profitable Trading-Gelegenheiten zu identifizieren.
          </p>
          
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="flex items-center bg-accent1/10 p-2 rounded-md border border-accent1/20">
              <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
              <div className="text-xs">
                <div className="font-semibold text-green-400">90%+ Erfolgsquote</div>
                <div className="text-muted-foreground">bei Marktsimulationen</div>
              </div>
            </div>
            
            <div className="flex items-center bg-accent1/10 p-2 rounded-md border border-accent1/20">
              <Award className="h-4 w-4 text-gold mr-2" />
              <div className="text-xs">
                <div className="font-semibold text-gold">3-8% Gewinn</div>
                <div className="text-muted-foreground">pro erfolgreicher Trade</div>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground mt-2 p-2 bg-black/20 rounded border border-white/5">
            Die Ergebnisse können je nach Marktbedingungen variieren. Die historische Performance ist kein 
            Indikator für zukünftige Ergebnisse.
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotInfoCard;
