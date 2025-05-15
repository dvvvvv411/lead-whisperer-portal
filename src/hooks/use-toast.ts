
import { toast as sonnerToast, type ToastT } from "sonner";

export type ToastProps = ToastT;

export function toast(props: ToastProps) {
  return sonnerToast(props);
}

export { toast };
export { useToast } from "sonner";
