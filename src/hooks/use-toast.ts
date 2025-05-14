
import { toast as sonnerToast, type ToastT } from "sonner";

export interface ToastProps {
  description?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
}

export function toast(props: ToastProps) {
  const { description, variant, duration } = props;
  
  return sonnerToast(description, {
    duration: duration,
    className: variant === "destructive" ? "bg-red-500" : undefined
  });
}

export const useToast = () => {
  return {
    toast
  };
};
