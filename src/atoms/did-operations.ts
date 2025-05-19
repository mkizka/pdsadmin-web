import { atom, useAtomValue, useSetAtom } from "jotai";

import type { Repository } from "../utils/pds";
import type { Did } from "../utils/types";

type DidResetPasswordForm = {
  did: Did;
};

const resetPasswordAtom = atom<DidResetPasswordForm | null>(null);

export const RESET_PASSWORD_DIALOG_ID = "reset-password-modal";

export const useDidResetPasswordForm = () => useAtomValue(resetPasswordAtom);

export const useOpenDidResetPasswordModal = () => {
  const setResetPasswordForm = useSetAtom(resetPasswordAtom);
  return (did: Did) => {
    setResetPasswordForm({ did });
    const dialog = document.getElementById(
      RESET_PASSWORD_DIALOG_ID,
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };
};

type DidTakedownForm = {
  did: Did;
};

const takedownAtom = atom<DidTakedownForm | null>(null);

export const TAKEDOWN_DIALOG_ID = "takedown-modal";

export const useDidTakedownForm = () => useAtomValue(takedownAtom);

export const useOpenDidTakedownModal = () => {
  const setTakedownForm = useSetAtom(takedownAtom);
  return (did: Did) => {
    setTakedownForm({ did });
    const dialog = document.getElementById(
      TAKEDOWN_DIALOG_ID,
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };
};

type DidUntakedownForm = {
  did: Did;
};

const untakedownAtom = atom<DidUntakedownForm | null>(null);

export const UNTAKEDOWN_DIALOG_ID = "untakedown-modal";

export const useDidUntakedownForm = () => useAtomValue(untakedownAtom);

export const useOpenDidUntakedownModal = () => {
  const setUntakedownForm = useSetAtom(untakedownAtom);
  return (did: Did) => {
    setUntakedownForm({ did });
    const dialog = document.getElementById(
      UNTAKEDOWN_DIALOG_ID,
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };
};

type DidDeleteAccountForm = {
  did: Did;
};

const deleteAccountAtom = atom<DidDeleteAccountForm | null>(null);

export const DELETE_ACCOUNT_DIALOG_ID = "delete-account-modal";

export const useDidDeleteAccountForm = () => useAtomValue(deleteAccountAtom);

export const useOpenDidDeleteAccountModal = () => {
  const setDeleteAccountForm = useSetAtom(deleteAccountAtom);
  return (did: Did) => {
    setDeleteAccountForm({ did });
    const dialog = document.getElementById(
      DELETE_ACCOUNT_DIALOG_ID,
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };
};

type DidAccountModalForm = {
  repo: Repository;
};

const accountModalAtom = atom<DidAccountModalForm | null>(null);

export const ACCOUNT_MODAL_DIALOG_ID = "account-modal";

export const useDidAccountModalForm = () => useAtomValue(accountModalAtom);

export const useOpenDidAccountModal = () => {
  const setAccountModalForm = useSetAtom(accountModalAtom);
  return (repo: Repository) => {
    setAccountModalForm({ repo });
    const dialog = document.getElementById(
      ACCOUNT_MODAL_DIALOG_ID,
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  };
};
