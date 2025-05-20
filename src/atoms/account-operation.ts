import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";

import type { Repository } from "../utils/pds";
import type { Did } from "../utils/types";

type SimpleAccountOperation = {
  type: "reset-password" | "takedown" | "untakedown" | "delete";
  did: Did;
};

type AccountInfoOperation = {
  type: "account-info";
  repo: Repository;
};

type RequestCrawlOperation = {
  type: "request-crawl";
};

export type AccountOperation =
  | SimpleAccountOperation
  | AccountInfoOperation
  | RequestCrawlOperation;

const baseAtom = atom<AccountOperation | null>(null);

class AccountOperationDialog {
  #elementId = "account-operation";

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

export const accountOperationDialog = new AccountOperationDialog();

export const useAccountOperation = () => useAtomValue(baseAtom);

export const useOpenAccountOperationModal = () => {
  const setAccountOperation = useSetAtom(baseAtom);
  return useCallback(
    (operation: AccountOperation) => {
      setAccountOperation(operation);
      accountOperationDialog.showModal();
    },
    [setAccountOperation],
  );
};
