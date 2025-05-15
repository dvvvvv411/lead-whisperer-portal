
import { toast as sonnerToast } from "sonner";
import { ReactNode } from "react";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  id?: string;
}

// Create a wrapper around sonner toast to support our API
export function toast(props: ToastProps) {
  const { title, description, variant, id } = props;

  // In sonner, the first argument is the message (we'll use description)
  // and the second argument is options (we'll include title there)
  return sonnerToast(description || '', {
    id,
    // Pass the title as an option
    ...(title ? { title } : {}),
    // Map our variant to sonner's style if needed
    ...(variant === "destructive" ? { style: "error" } : {})
  });
}

// Export useToast hook that actually comes from sonner
// Sonner exports toast.useToast instead of useToast directly
export const useToast = () => {
  return {
    toast,
    // Add any other methods you might need from sonner's toast
  };
};
