
import { toast as sonnerToast } from "sonner";

type ToasterToast = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "success" | "error" | "destructive"; // Added "destructive" for backward compatibility
  duration?: number;
  action?: React.ReactNode;
};

const TOAST_LIMIT = 5;

export const useToast = () => {
  // Using the Sonner toast API
  const toast = (props: ToastProps) => {
    const { title, description, variant, duration, action } = props;

    // Map our variant types to Sonner types
    // Map "destructive" to "error" for backward compatibility
    const type = variant === "error" || variant === "destructive" ? "error" : 
                variant === "success" ? "success" : "default";
    
    return sonnerToast(title, {
      description,
      duration,
      action,
      // Use the type property instead of variant
      // This matches Sonner's API
      type
    });
  };

  return {
    toast,
    dismiss: sonnerToast.dismiss,
    clear: sonnerToast.dismiss
  };
};

// Re-export Sonner's toast function for direct use
export const toast = sonnerToast;
