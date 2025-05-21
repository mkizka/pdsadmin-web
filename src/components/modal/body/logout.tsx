import { modal } from "../../../atoms/modal";
import { useLogout } from "../../../atoms/session";
import { cn } from "../../../utils/cn";
import { useModalHandler } from "../hooks";

export function LogoutModalBody() {
  const logout = useLogout();

  const { loading, handler } = useModalHandler({
    fn: () => logout(),
    toastMessage: "ログアウトしました",
  });

  return (
    <div className="flex flex-col gap-4 items-center">
      <span className="i-lucide-log-out size-12"></span>
      <p className="text-center">ログアウトしますか？</p>
      <div className="flex gap-4">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => modal.close()}
        >
          キャンセル
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
          <span className={cn(loading && "opacity-0")}>ログアウト</span>
        </button>
      </div>
    </div>
  );
}
