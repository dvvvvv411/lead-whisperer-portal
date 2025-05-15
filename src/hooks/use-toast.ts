
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

  return sonnerToast(description || '', {
    id,
    title,
    // Map our variant to sonner's style if needed
    // Sonner will ignore unknown props
    variant: variant === "destructive" ? "error" : "default",
  });
}

// Export the hook from sonner
export { useToast } from "sonner";
