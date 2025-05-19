import { atom, useAtomValue, useSetAtom } from "jotai";

import type { Repository } from "../utils/pds";
import type { Did } from "../utils/types";

export const RESET_PASSWORD_DIALOG_ID = "reset-password-modal";
export const TAKEDOWN_DIALOG_ID = "takedown-modal";
export const UNTAKEDOWN_DIALOG_ID = "untakedown-modal";
export const DELETE_ACCOUNT_DIALOG_ID = "delete-account-modal";
export const ACCOUNT_MODAL_DIALOG_ID = "account-modal";

export type OperationType =
  | "reset-password"
  | "takedown"
  | "untakedown"
  | "delete-account"
  | "account-modal";

type DidOperationForm =
  | { type: "reset-password"; did: Did }
  | { type: "takedown"; did: Did }
  | { type: "untakedown"; did: Did }
  | { type: "delete-account"; did: Did }
  | { type: "account-modal"; repo: Repository };

const didOperationAtom = atom<DidOperationForm | null>(null);

/*
const getDialogId = (type: OperationType): string => {
  switch (type) {
    case "reset-password":
      return RESET_PASSWORD_DIALOG_ID;
    case "takedown":
      return TAKEDOWN_DIALOG_ID;
    case "untakedown":
      return UNTAKEDOWN_DIALOG_ID;
    case "delete-account":
      return DELETE_ACCOUNT_DIALOG_ID;
    case "account-modal":
      return ACCOUNT_MODAL_DIALOG_ID;
  }
};
*/

export const useResetPasswordForm = () => {
  const form = useAtomValue(didOperationAtom);
  return form?.type === "reset-password" ? form : null;
};

export const useTakedownForm = () => {
  const form = useAtomValue(didOperationAtom);
  return form?.type === "takedown" ? form : null;
};

export const useUntakedownForm = () => {
  const form = useAtomValue(didOperationAtom);
  return form?.type === "untakedown" ? form : null;
};

export const useDeleteAccountForm = () => {
  const form = useAtomValue(didOperationAtom);
  return form?.type === "delete-account" ? form : null;
};

export const useAccountModalForm = () => {
  const form = useAtomValue(didOperationAtom);
  return form?.type === "account-modal" ? form : null;
};

/*
const openDidOperationModal = (
  type: Exclude<OperationType, "account-modal">,
  did: Did,
  dialogId?: string
) => {
  const setForm = useSetAtom(didOperationAtom);
  const actualDialogId = dialogId || getDialogId(type);
  
  setForm({ type, did });
  const dialog = document.getElementById(actualDialogId) as HTMLDialogElement | null;
  dialog?.showModal();
};
*/

export const useOpenResetPasswordModal = () => {
  const setForm = useSetAtom(didOperationAtom);
  return (did: Did, dialogId = RESET_PASSWORD_DIALOG_ID) => {
    setForm({ type: "reset-password", did });
    const dialog = document.getElementById(
      dialogId,
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };
};

export const useOpenTakedownModal = () => {
  const setForm = useSetAtom(didOperationAtom);
  return (did: Did, dialogId = TAKEDOWN_DIALOG_ID) => {
    setForm({ type: "takedown", did });
    const dialog = document.getElementById(
      dialogId,
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };
};

export const useOpenUntakedownModal = () => {
  const setForm = useSetAtom(didOperationAtom);
  return (did: Did, dialogId = UNTAKEDOWN_DIALOG_ID) => {
    setForm({ type: "untakedown", did });
    const dialog = document.getElementById(
      dialogId,
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };
};

export const useOpenDeleteAccountModal = () => {
  const setForm = useSetAtom(didOperationAtom);
  return (did: Did, dialogId = DELETE_ACCOUNT_DIALOG_ID) => {
    setForm({ type: "delete-account", did });
    const dialog = document.getElementById(
      dialogId,
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };
};

export const useOpenAccountModal = () => {
  const setForm = useSetAtom(didOperationAtom);
  return (repo: Repository, dialogId = ACCOUNT_MODAL_DIALOG_ID) => {
    setForm({ type: "account-modal", repo });
    const dialog = document.getElementById(
      dialogId,
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };
};
