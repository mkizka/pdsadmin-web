import { modal } from "../../../atoms/modal";
import { useLogout } from "../../../atoms/session";
import { cn } from "../../../utils/cn";
import { useModalHandler } from "../hooks";

export function SignoutModalBody() {
  const logout = useLogout();

  const { loading, handler } = useModalHandler({
    fn: () => logout(),
    toastMessage: "Sign out successfully",
  });

  return (
    <div className="flex flex-col gap-4 items-center">
      <span className="i-lucide-log-out size-12"></span>
      <p className="text-center">Are you sure you want to sign out?</p>
      <div className="flex gap-4">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => modal.close()}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary relative"
          disabled={loading}
          onClick={handler}
        >
          {loading && (
            <div className="loading loading-spinner loading-sm absolute"></div>
          )}
          <span className={cn(loading && "opacity-0")}>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
