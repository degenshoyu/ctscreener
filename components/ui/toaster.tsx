import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className="bg-sidebar border border-zinc-800 rounded-2xl shadow-lg p-4 text-zinc-100"
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="text-lg font-semibold text-zinc-100">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-sm text-zinc-400">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
