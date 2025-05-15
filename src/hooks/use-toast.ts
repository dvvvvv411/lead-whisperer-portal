
import { toast as sonnerToast, type ToastOptions as SonnerToastOptions } from "sonner";

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

// Map our variant types to Sonner types
const getToastStyle = (variant?: string) => {
  // Map "destructive" to "error" for backward compatibility
  const mappedType = variant === "error" || variant === "destructive" ? "error" : 
              variant === "success" ? "success" : "default";

  // Return style object based on variant
  return {
    backgroundColor: mappedType === "error" ? "var(--destructive)" : 
                    mappedType === "success" ? "var(--success)" : "var(--background)",
    color: mappedType === "error" ? "var(--destructive-foreground)" :
           mappedType === "success" ? "var(--success-foreground)" : "var(--foreground)"
  };
};

// Create a wrapper function to handle our toast interface
export const useToast = () => {
  const toast = (props: ToastProps | string) => {
    // Handle string case
    if (typeof props === 'string') {
      return sonnerToast(props);
    }

    const { title, description, variant, duration, action } = props;
    
    return sonnerToast(title || "", {
      description,
      duration,
      action,
      style: getToastStyle(variant)
    });
  };

  return {
    toast,
    dismiss: sonnerToast.dismiss,
    clear: sonnerToast.dismiss
  };
};

// For direct use with simple string or with our custom props
export const toast = (props: ToastProps | string) => {
  if (typeof props === 'string') {
    return sonnerToast(props);
  }

  const { title, description, variant, duration, action } = props;

  return sonnerToast(title || "", {
    description,
    duration,
    action,
    style: getToastStyle(variant)
  });
};
