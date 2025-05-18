import { useToasts } from "../atoms/toast";
import { cx } from "../utils/cx";

export function Toaster() {
  const toasts = useToasts();
  return (
    <div className="toast">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cx("alert", {
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
