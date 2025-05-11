
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
          <FormLabel>Kryptowährung</FormLabel>
          <Select 
            onValueChange={onWalletChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Kryptowährung auswählen" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {wallets.map((wallet) => (
                <SelectItem key={wallet.id} value={wallet.currency}>
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
