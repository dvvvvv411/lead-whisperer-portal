
import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";

interface WalletAddressInputProps {
  control: Control<z.infer<any>>;
}

const WalletAddressInput = ({ control }: WalletAddressInputProps) => {
  return (
    <FormField
      control={control}
      name="walletAddress"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Ihre Wallet-Adresse</FormLabel>
          <FormControl>
            <Input 
              placeholder="z.B. 0x1234..." 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default WalletAddressInput;
