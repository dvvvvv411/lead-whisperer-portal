
import React from 'react';
import { Loader2 } from 'lucide-react';

const WithdrawalLoading = () => {
  return (
    <div className="flex justify-center items-center p-8 bg-black/10 rounded-lg border border-white/10">
      <Loader2 className="h-6 w-6 animate-spin mr-2 text-white/70" />
      <span className="text-white/80">Auszahlungsverlauf wird geladen...</span>
    </div>
  );
};

export default WithdrawalLoading;
