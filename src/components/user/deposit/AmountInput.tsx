
import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";

interface AmountInputProps {
  control: Control<z.infer<any>>;
}

const AmountInput = ({ control }: AmountInputProps) => {
  return (
    <FormField
      control={control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Betrag (€)</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              placeholder="100" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AmountInput;
