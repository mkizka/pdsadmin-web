import { modal } from "../../../atoms/modal";
import { useLogout } from "../../../atoms/session";
import { Button } from "../../button";
import { useModalHandler } from "../hooks";

export function SignoutModalBody() {
  const logout = useLogout();

  const { loading, handler } = useModalHandler({
    fn: () => logout(),
    toastMessage: "Sign out successfully",
  });

  return (
    <div className="flex flex-col items-center gap-4">
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
        <Button
          type="button"
          className="btn btn-primary relative"
          loading={loading}
          loadingClassName="loading-sm"
          onClick={handler}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
