import { atom, useAtomValue, useSetAtom } from "jotai";

import type { Did } from "./types";

type ResetPasswordForm = {
  did: Did;
};

const resetPasswordFormAtom = atom<ResetPasswordForm | null>(null);

export const RESET_PASSWORD_DIALOG_ID = "reset-password-modal";

export const useResetPasswordForm = () => useAtomValue(resetPasswordFormAtom);

export const useOpenResetPasswordModal = () => {
  const setResetPasswordForm = useSetAtom(resetPasswordFormAtom);
  return (did: Did) => {
    setResetPasswordForm({ did });
    const dialog = document.getElementById(
      RESET_PASSWORD_DIALOG_ID,
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };
};
