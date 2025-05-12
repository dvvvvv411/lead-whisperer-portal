
interface WalletAddressDisplayProps {
  currency: string;
  address: string;
  amount: number;
}

const WalletAddressDisplay = ({ currency, address, amount }: WalletAddressDisplayProps) => {
  if (!currency || !address) return null;
  
  return (
    <div className="p-4 bg-black/20 backdrop-blur-xl rounded-md border border-gold/30">
      <h4 className="font-medium mb-2 text-gold-light">Wallet Adresse für {currency}:</h4>
      <div className="bg-black/30 p-3 rounded border border-gold/20 break-all">
        <code className="text-white/90">{address}</code>
      </div>
      <p className="mt-2 text-sm text-white/70">
        Bitte senden Sie genau {amount}€ in {currency} an die oben angegebene Adresse.
      </p>
    </div>
  );
};

export default WalletAddressDisplay;
