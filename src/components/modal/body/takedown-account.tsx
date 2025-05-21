import { usePDS } from "../../../atoms/pds";
import { cn } from "../../../utils/cn";
import type { Did } from "../../../utils/types";
import { useModalHandler } from "../hooks";

type Props = {
  did: Did;
};

export function TakedownAccountModalBody({ did }: Props) {
  const pds = usePDS();

  const { loading, handler } = useModalHandler({
    fn: async () => {
      const ref = (new Date().getTime() / 1000).toString();
      await pds.takedown(did, ref);
    },
    toastMessage: "Account takedown successfully",
    shouldReloadRepos: true,
  });

  return (
    <div className="flex flex-col gap-4 items-center">
      <span className="i-lucide-ban size-12 text-error"></span>
      <p className="text-center">
        Are you sure you want to takedown this account?
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
        <span className={cn(loading && "opacity-0")}>Takedown Account</span>
      </button>
    </div>
  );
}
