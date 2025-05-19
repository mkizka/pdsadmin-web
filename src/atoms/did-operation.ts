import { atom, useAtomValue, useSetAtom } from "jotai";

import type { Did } from "../utils/types";

export type DidOperation = {
  type: "reset-password" | "takedown" | "untakedown" | "delete";
  did: Did;
};

const baseAtom = atom<DidOperation | null>(null);

class DidOperationDialog {
  #elementId = "did-operation";

  getElementId() {
    return this.#elementId;
  }

  getElement() {
    const dialog = document.getElementById(
      this.#elementId,
    ) as HTMLDialogElement | null;
    if (!dialog) {
      throw new Error(`Dialog with id ${this.#elementId} not found`);
    }
    return dialog;
  }

  showModal() {
    this.getElement().showModal();
  }

  close() {
    this.getElement().close();
  }
}

export const didOperationDialog = new DidOperationDialog();

export const useDidOperation = () => useAtomValue(baseAtom);

export const useOpenDidOperationModal = () => {
  const setDidOperation = useSetAtom(baseAtom);
  return (operation: DidOperation) => {
    setDidOperation(operation);
    didOperationDialog.showModal();
  };
};
