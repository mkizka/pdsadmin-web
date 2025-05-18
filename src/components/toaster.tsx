import { useToasts } from "../atoms/toast";
import { cn } from "../utils/cn";

export function Toaster() {
  const toasts = useToasts();
  return (
    <div className="toast">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn("alert", {
            "alert-success": toast.level === "success",
            "alert-error": toast.level === "error",
          })}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
