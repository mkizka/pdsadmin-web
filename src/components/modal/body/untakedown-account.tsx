import { usePDS } from "../../../atoms/pds";
import type { Did } from "../../../utils/types";
import { Button } from "../../button";
import { useModalHandler } from "../hooks";

type Props = {
  did: Did;
};

export function UntakedownAccountModalBody({ did }: Props) {
  const pds = usePDS();

  const { loading, handler } = useModalHandler({
    fn: () => pds.untakedown(did),
    toastMessage: "Account untakedown successfully",
    shouldReloadRepos: true,
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="i-lucide-check-circle text-success size-12"></span>
      <p className="text-center">
        Are you sure you want to untakedown this account?
      </p>
      <Button
        type="button"
        className="btn btn-success relative"
        loading={loading}
        loadingClassName="loading-sm"
        onClick={handler}
        data-testid="untakedown-account-confirm-button"
      >
        Untakedown Account
      </Button>
    </div>
  );
}
