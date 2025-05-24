import { usePDS } from "../../../atoms/pds";
import type { Did } from "../../../utils/types";
import { Button } from "../../button";
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
    <div className="flex flex-col items-center gap-4">
      <span className="i-lucide-ban text-error size-12"></span>
      <p className="text-center">
        Are you sure you want to takedown this account?
      </p>
      <Button
        type="button"
        className="btn btn-error relative"
        loading={loading}
        loadingClassName="loading-sm"
        onClick={handler}
        data-testid="takedown-account-confirm-button"
      >
        Takedown Account
      </Button>
    </div>
  );
}
