import { atom, useAtomValue, useSetAtom } from "jotai";

import type { Did } from "../utils/types";

type TakedownForm = {
  did: Did;
};

const baseAtom = atom<TakedownForm | null>(null);

export const TAKEDOWN_DIALOG_ID = "takedown-modal";

export const useTakedownForm = () => useAtomValue(baseAtom);

export const useOpenTakedownModal = () => {
  const setTakedownForm = useSetAtom(baseAtom);
  return (did: Did) => {
    setTakedownForm({ did });
    const dialog = document.getElementById(
      TAKEDOWN_DIALOG_ID,
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };
};
