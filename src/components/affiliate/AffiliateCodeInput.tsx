
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Gift } from 'lucide-react';

interface AffiliateCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const AffiliateCodeInput = ({ value, onChange, className }: AffiliateCodeInputProps) => {
  const [showBonus, setShowBonus] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toUpperCase();
    onChange(inputValue);
    
    // Show bonus message when user starts typing
    if (inputValue.length > 0 && !showBonus) {
      setShowBonus(true);
    } else if (inputValue.length === 0 && showBonus) {
      setShowBonus(false);
    }
  };

  return (
    <div className={className}>
      <Label htmlFor="affiliateCode" className="text-gray-300">
        Einladungscode (optional)
      </Label>
      <Input
        id="affiliateCode"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="z.B. ABC12345"
        className="mt-1 bg-casino-darker border-gold/30 text-white"
        maxLength={8}
      />
      
      {showBonus && (
        <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center text-green-400 text-sm">
            <Gift className="h-4 w-4 mr-2" />
            <span className="font-medium">Bonus verfügbar!</span>
          </div>
          <p className="text-green-300 text-xs mt-1">
            Mit einem gültigen Einladungscode erhältst du 50€ Bonus bei der Registrierung.
          </p>
        </div>
      )}
    </div>
  );
};

export default AffiliateCodeInput;
