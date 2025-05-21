import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";

import type { Repository } from "../utils/pds";
import type { Did } from "../utils/types";

type AccountOperationAction = {
  type: "reset-password" | "takedown" | "untakedown" | "delete";
  did: Did;
};

type AccountInfoAction = {
  type: "account-info";
  repo: Repository;
};

type RequestCrawlAction = {
  type: "request-crawl";
};

type InviteCodeAction = {
  type: "invite-code";
  code: string;
};

export type ModalAction =
  | AccountOperationAction
  | AccountInfoAction
  | RequestCrawlAction
  | InviteCodeAction;

const modalActionAtom = atom<ModalAction | null>(null);

class Modal {
  #elementId = "modal";

  getElementId() {
    return this.#elementId;
  }

  #getDialog() {
    const dialog = document.getElementById(
      this.#elementId,
    ) as HTMLDialogElement | null;
    if (!dialog) {
      throw new Error(`Dialog with id ${this.#elementId} not found`);
    }
    return dialog;
  }

  open() {
    this.#getDialog().showModal();
  }

  close() {
    this.#getDialog().close();
  }
}

export const modal = new Modal();

export const useModalAction = () => useAtomValue(modalActionAtom);

export const useOpenModal = () => {
  const setModalAction = useSetAtom(modalActionAtom);
  return useCallback(
    (modalAction: ModalAction) => {
      setModalAction(modalAction);
      modal.open();
    },
    [setModalAction],
  );
};
