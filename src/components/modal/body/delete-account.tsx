import { usePDS } from "../../../atoms/pds";
import type { Did } from "../../../utils/types";
import { Button } from "../../button";
import { useModalHandler } from "../hooks";

type Props = {
  did: Did;
};

export function DeleteAccountModalBody({ did }: Props) {
  const pds = usePDS();

  const { loading, handler } = useModalHandler({
    fn: () => pds.deleteAccount(did),
    toastMessage: "Account deleted successfully",
    shouldReloadRepos: true,
  });

  return (
    <div className="flex flex-col gap-4 items-center">
      <span className="i-lucide-trash-2 size-12 text-error"></span>
      <p className="text-center">
        Are you sure you want to delete this account? This action cannot be
        undone.
      </p>
      <Button
        type="button"
        className="btn btn-error relative"
        loading={loading}
        loadingClassName="loading-sm"
        onClick={handler}
        data-testid="delete-account-confirm-button"
      >
        Delete Account
      </Button>
    </div>
  );
}
