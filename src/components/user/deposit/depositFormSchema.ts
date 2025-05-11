
import * as z from "zod";

export const depositFormSchema = z.object({
  amount: z.coerce
    .number()
    .min(10, { message: "Mindesteinzahlung beträgt 10€" })
    .max(10000, { message: "Maximale Einzahlung beträgt 10.000€" }),
  walletCurrency: z.string().min(1, { message: "Bitte wählen Sie eine Kryptowährung" })
});

export type DepositFormValues = z.infer<typeof depositFormSchema>;
