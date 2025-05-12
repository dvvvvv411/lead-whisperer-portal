
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import * as z from "zod";

interface CryptoWallet {
  id: string;
  currency: string;
  wallet_address: string;
}

interface WalletSelectorProps {
  control: Control<z.infer<any>>;
  wallets: CryptoWallet[];
  onWalletChange: (currency: string) => void;
}

const WalletSelector = ({ control, wallets, onWalletChange }: WalletSelectorProps) => {
  return (
    <FormField
      control={control}
      name="walletCurrency"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white/90">Kryptowährung</FormLabel>
          <Select 
            onValueChange={onWalletChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="bg-black/30 border-accent1/30 text-white/80">
                <SelectValue placeholder="Kryptowährung auswählen" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-casino-darker border-accent1/30">
              {wallets.map((wallet) => (
                <SelectItem key={wallet.id} value={wallet.currency} className="text-white/80 focus:bg-accent1/20 focus:text-white">
                  {wallet.currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default WalletSelector;
