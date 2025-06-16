import { useTranslation } from "react-i18next";

import { useOpenModal } from "../../atoms/modal";
import type { Did } from "../../utils/types";

export function ResetPasswordButton({ did }: { did: Did }) {
  const openModal = useOpenModal();
  const { t } = useTranslation();
  return (
    <div
      role="button"
      className="btn btn-ghost h-12 justify-start whitespace-nowrap"
      onClick={(e) => {
        e.stopPropagation();
        openModal({ type: "reset-password", did });
      }}
    >
      <span className="i-lucide-key-round size-4"></span>
      {t("account.buttons.reset-password")}
    </div>
  );
}

export function DeleteAccountButton({
  did,
  handle,
}: {
  did: Did;
  handle: string;
}) {
  const openModal = useOpenModal();
  const { t } = useTranslation();
  return (
    <div
      role="button"
      className="btn btn-ghost text-error h-12 justify-start whitespace-nowrap"
      data-testid="delete-account-button"
      onClick={(e) => {
        e.stopPropagation();
        openModal({ type: "delete", did, handle });
      }}
    >
      <span className="i-lucide-trash-2 size-4"></span>
      {t("account.buttons.delete")}
    </div>
  );
}

export function TakedownAccountButton({ did }: { did: Did }) {
  const openModal = useOpenModal();
  const { t } = useTranslation();
  return (
    <div
      role="button"
      className="btn btn-ghost text-error h-12 justify-start whitespace-nowrap"
      data-testid="takedown-account-button"
      onClick={(e) => {
        e.stopPropagation();
        openModal({ type: "takedown", did });
      }}
    >
      <span className="i-lucide-ban size-4"></span>
      {t("account.buttons.takedown")}
    </div>
  );
}

export function UntakedownAccountButton({ did }: { did: Did }) {
  const openModal = useOpenModal();
  const { t } = useTranslation();
  return (
    <div
      role="button"
      className="btn btn-ghost text-success h-12 justify-start whitespace-nowrap"
      data-testid="untakedown-account-button"
      onClick={(e) => {
        e.stopPropagation();
        openModal({ type: "untakedown", did });
      }}
    >
      <span className="i-lucide-check-circle size-4"></span>
      {t("account.buttons.untakedown")}
    </div>
  );
}
