
import * as z from "zod";

export const withdrawalFormSchema = z.object({
  amount: z.coerce
    .number()
    .min(50, { message: "Mindestbetrag für Auszahlungen ist 50€" })
    .max(10000, { message: "Maximale Auszahlung beträgt 10.000€" }),
  walletCurrency: z.string().min(1, { message: "Bitte wählen Sie eine Kryptowährung" }),
  walletAddress: z.string().min(5, { message: "Bitte geben Sie eine gültige Wallet-Adresse ein" })
});

export type WithdrawalFormValues = z.infer<typeof withdrawalFormSchema>;
