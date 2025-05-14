
// Import toast from Sonner
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function toast({ title, description, variant = "default" }: ToastProps) {
  sonnerToast[variant === "destructive" ? "error" : "success"](title, {
    description,
  });
}

export const useToast = () => {
  return {
    toast,
  };
};
