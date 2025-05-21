import { usePDS } from "../../../atoms/pds";
import { useToast } from "../../../atoms/toast";
import { cn } from "../../../utils/cn";
import type { Did } from "../../../utils/types";
import { useModalHandler } from "../hooks";

type Props = {
  did: Did;
};

export function UntakedownAccountModalBody({ did }: Props) {
  const pds = usePDS();
  const toast = useToast();

  const { loading, handler } = useModalHandler(async () => {
    await pds.untakedown(did);
    toast.success("Account untakedown successfully");
  });

  return (
    <div className="flex flex-col gap-4 items-center">
      <span className="i-lucide-check-circle size-12 text-success"></span>
      <p className="text-center">
        Are you sure you want to untakedown this account?
      </p>
      <button
        type="button"
        className="btn btn-success relative"
        disabled={loading}
        onClick={handler}
      >
        {loading && (
          <div className="loading loading-spinner loading-sm absolute"></div>
        )}
        <span className={cn(loading && "opacity-0")}>Untakedown Account</span>
      </button>
    </div>
  );
}
