
import React from 'react';
import { Loader2 } from 'lucide-react';

const WithdrawalLoading = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="h-6 w-6 animate-spin mr-2 text-accent1" />
      <span className="text-white/80">Auszahlungsverlauf wird geladen...</span>
    </div>
  );
};

export default WithdrawalLoading;
