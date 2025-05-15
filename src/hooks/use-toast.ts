
import { Toast, toast as sonnerToast } from "sonner";

type ToastProps = React.ComponentProps<typeof Toast>;

type ToastOptions = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
  action?: {
    label: string;
    onClick: () => void;
  }
};

export function toast({ title, description, variant, action }: ToastOptions) {
  sonnerToast(title, {
    description,
    action: action
      ? {
          label: action.label,
          onClick: action.onClick,
        }
      : undefined,
    className: variant === "destructive" ? "bg-destructive text-destructive-foreground" : undefined,
  });
}

export function useToast() {
  return {
    toast,
  };
}
