import { useTranslation } from "react-i18next";

import { usePDS } from "../../../atoms/pds";
import type { Did } from "../../../utils/types";
import { Button } from "../../button";
import { useModalHandler } from "../hooks";

type Props = {
  did: Did;
};

export function DeleteAccountModalBody({ did }: Props) {
  const pds = usePDS();
  const { t } = useTranslation();

  const { loading, handler } = useModalHandler({
    fn: () => pds.deleteAccount(did),
    toastMessage: t("modal.delete.toast"),
    shouldReloadRepos: true,
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="i-lucide-trash-2 text-error size-12"></span>
      <p className="text-center">{t("modal.delete.message")}</p>
      <Button
        type="button"
        className="btn btn-error relative"
        loading={loading}
        loadingClassName="loading-sm"
        onClick={handler}
        data-testid="delete-account-confirm-button"
      >
        {t("modal.delete.button")}
      </Button>
    </div>
  );
}
