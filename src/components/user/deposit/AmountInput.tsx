
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
          <FormLabel className="text-white/90">Betrag (€)</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              placeholder="100" 
              {...field}
              className="bg-black/30 border-accent1/30 text-white/80 focus-visible:ring-accent1-light focus-visible:border-accent1-light" 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AmountInput;
