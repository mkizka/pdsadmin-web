import { atom, useAtomValue, useSetAtom } from "jotai";

import type { Repository } from "../utils/pds";

type AccountModalForm = {
  repo: Repository;
};

const baseAtom = atom<AccountModalForm | null>(null);

export const ACCOUNT_MODAL_DIALOG_ID = "account-modal";

export const useAccountModalForm = () => useAtomValue(baseAtom);

export const useOpenAccountModal = () => {
  const setAccountModalForm = useSetAtom(baseAtom);
  return (repo: Repository) => {
    setAccountModalForm({ repo });
    const dialog = document.getElementById(
      ACCOUNT_MODAL_DIALOG_ID,
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };
};
