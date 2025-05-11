
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { BotSettings } from "@/hooks/ai-bot/types";

interface BotSettingsPanelProps {
  settings: BotSettings;
  isActive: boolean;
  userCredit: number;
  updateBotSettings: (settings: Partial<BotSettings>) => void;
  formatCurrency: (amount: number) => string;
}

const BotSettingsPanel = ({
  settings,
  isActive,
  userCredit,
  updateBotSettings,
  formatCurrency
}: BotSettingsPanelProps) => {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Bot-Einstellungen</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
        >
          {showAdvancedSettings ? 'Weniger Optionen' : 'Erweiterte Einstellungen'}
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Handelsfrequenz</label>
          <Select 
            value={settings.tradeFrequency} 
            onValueChange={(value: 'low' | 'medium' | 'high') => 
              updateBotSettings({ tradeFrequency: value })
            }
            disabled={isActive}
          >
            <SelectTrigger>
              <SelectValue placeholder="Frequenz auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Niedrig (alle 3 Min.)</SelectItem>
              <SelectItem value="medium">Mittel (jede Min.)</SelectItem>
              <SelectItem value="high">Hoch (alle 30 Sek.)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {showAdvancedSettings && (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Risikostufe</label>
              <Select 
                value={settings.riskLevel} 
                onValueChange={(value: 'conservative' | 'balanced' | 'aggressive') => 
                  updateBotSettings({ riskLevel: value })
                }
                disabled={isActive}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Risiko auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Konservativ (5-10% Gewinn)</SelectItem>
                  <SelectItem value="balanced">Ausgewogen (5-10% Gewinn)</SelectItem>
                  <SelectItem value="aggressive">Aggressiv (5-10% Gewinn)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium">Max. Handelsbetrag: {formatCurrency(settings.maxTradeAmount)}</label>
              </div>
              <Slider
                value={[settings.maxTradeAmount]}
                min={10}
                max={Math.max(500, userCredit * 0.5)}
                step={10}
                onValueChange={(value) => updateBotSettings({ maxTradeAmount: value[0] })}
                disabled={isActive}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>10€</span>
                <span>{formatCurrency(Math.max(500, userCredit * 0.5))}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BotSettingsPanel;
