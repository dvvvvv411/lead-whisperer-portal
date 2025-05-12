
import React from 'react';

interface AccountBalanceProps {
  userCredit: number;
}

const AccountBalance = ({ userCredit }: AccountBalanceProps) => {
  return (
    <div className="mb-4 text-center">
      <span className="text-sm text-muted-foreground">Kontoguthaben</span>
      <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light">
        {userCredit.toLocaleString('de-DE')} €
      </div>
    </div>
  );
};

export default AccountBalance;
