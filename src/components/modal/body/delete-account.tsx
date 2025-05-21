import { usePDS } from "../../../atoms/pds";
import { useToast } from "../../../atoms/toast";
import { cn } from "../../../utils/cn";
import type { Did } from "../../../utils/types";
import { useModalHandler } from "../hooks";

type Props = {
  did: Did;
};

export function DeleteAccountModalBody({ did }: Props) {
  const pds = usePDS();
  const toast = useToast();

  const { loading, handler } = useModalHandler(async () => {
    await pds.deleteAccount(did);
    toast.success("Account deleted successfully");
  });

  return (
    <div className="flex flex-col gap-4 items-center">
      <span className="i-lucide-trash-2 size-12 text-error"></span>
      <p className="text-center">
        Are you sure you want to delete this account? This action cannot be
        undone.
      </p>
      <button
        type="button"
        className="btn btn-error relative"
        disabled={loading}
        onClick={handler}
      >
        {loading && (
          <div className="loading loading-spinner loading-sm absolute"></div>
        )}
        <span className={cn(loading && "opacity-0")}>Delete Account</span>
      </button>
    </div>
  );
}
