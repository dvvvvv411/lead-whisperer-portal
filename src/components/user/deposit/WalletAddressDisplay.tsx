
interface WalletAddressDisplayProps {
  currency: string;
  address: string;
  amount: number;
}

const WalletAddressDisplay = ({ currency, address, amount }: WalletAddressDisplayProps) => {
  if (!currency || !address) return null;
  
  return (
    <div className="p-4 bg-gray-50 rounded-md border">
      <h4 className="font-medium mb-2">Wallet Adresse für {currency}:</h4>
      <div className="bg-white p-3 rounded border break-all">
        <code>{address}</code>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        Bitte senden Sie genau {amount}€ in {currency} an die oben angegebene Adresse.
      </p>
    </div>
  );
};

export default WalletAddressDisplay;
