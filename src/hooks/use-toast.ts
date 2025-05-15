
import { toast as sonnerToast, type ToastOptions } from "sonner";

// We will modify the type to make id optional
export type ToastProps = ToastOptions & {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function toast(props: ToastProps) {
  const { title, description, variant, ...rest } = props;

  return sonnerToast(title || "", {
    description,
    classNames: {
      toast: variant === "destructive" ? "bg-rose-800 border-rose-600" : "",
      title: variant === "destructive" ? "text-white" : "",
      description: variant === "destructive" ? "text-white" : "",
    },
    ...rest,
  });
}

export const useToast = () => {
  return {
    toast,
  };
};
