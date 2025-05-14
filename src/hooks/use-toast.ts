
// Create a local hook to avoid circular dependencies
import { toast as sonnerToast, type ToastT } from "sonner";

interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
}

export function useToast() {
  const toast = ({ title, description, action, variant }: ToastProps) => {
    const options: any = {
      description,
      action,
      className: variant === "destructive" ? "bg-destructive text-destructive-foreground" : 
                 variant === "success" ? "bg-green-500 text-white" : undefined
    };
    
    return sonnerToast(title, options);
  };

  return {
    toast
  };
}

export { sonnerToast as toast };
