import { atom, useAtomValue, useSetAtom } from "jotai";

import type { Did } from "../utils/types";

type DeleteAccountForm = {
  did: Did;
};

const baseAtom = atom<DeleteAccountForm | null>(null);

export const DELETE_ACCOUNT_DIALOG_ID = "delete-account-modal";

export const useDeleteAccountForm = () => useAtomValue(baseAtom);

export const useOpenDeleteAccountModal = () => {
  const setDeleteAccountForm = useSetAtom(baseAtom);
  return (did: Did) => {
    setDeleteAccountForm({ did });
    const dialog = document.getElementById(
      DELETE_ACCOUNT_DIALOG_ID,
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };
};
