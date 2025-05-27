import { useTranslation } from "react-i18next";

import { modal } from "../../../atoms/modal";
import { useLogout } from "../../../atoms/session";
import { Button } from "../../ui/button";
import { useModalHandler } from "../hooks";

export function SignoutModalBody() {
  const { t } = useTranslation();
  const logout = useLogout();

  const { loading, handler } = useModalHandler({
    fn: () => logout(),
    toastMessage: t("modal.signout.toast"),
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="i-lucide-log-out size-12"></span>
      <p className="text-center">{t("modal.signout.message")}</p>
      <div className="flex gap-4">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => modal.close()}
        >
          {t("modal.signout.cancel")}
        </button>
        <Button
          type="button"
          className="btn btn-primary relative"
          loading={loading}
          loadingClassName="loading-sm"
          onClick={handler}
        >
          {t("modal.signout.button")}
        </Button>
      </div>
    </div>
  );
}
