
import { toast as sonnerToast, type ToastT } from "sonner";

export interface ToastProps {
  title?: React.ReactNode;  // Make title optional but still accepted
  description?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
}

export function toast(props: ToastProps) {
  const { title, description, variant, duration } = props;
  
  // Use title as the main message if provided, otherwise use description
  const message = title || description;
  
  // Use description as options.description only if both title and description are provided
  const options: Record<string, any> = {
    duration: duration,
    className: variant === "destructive" ? "bg-red-500" : undefined
  };
  
  // Only add description to options if both title and description are provided
  if (title && description) {
    options.description = description;
  }
  
  return sonnerToast(message as string, options);
}

export const useToast = () => {
  return {
    toast
  };
};
