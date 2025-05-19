import { atom, useAtomValue, useSetAtom } from "jotai";

import type { Did } from "../utils/types";

type UntakedownForm = {
  did: Did;
};

const baseAtom = atom<UntakedownForm | null>(null);

export const UNTAKEDOWN_DIALOG_ID = "untakedown-modal";

export const useUntakedownForm = () => useAtomValue(baseAtom);

export const useOpenUntakedownModal = () => {
  const setUntakedownForm = useSetAtom(baseAtom);
  return (did: Did) => {
    setUntakedownForm({ did });
    const dialog = document.getElementById(
      UNTAKEDOWN_DIALOG_ID,
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };
};
