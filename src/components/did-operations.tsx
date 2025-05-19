import type { FormEvent } from "react";
import { useRef, useState } from "react";

import {
  ACCOUNT_MODAL_DIALOG_ID,
  DELETE_ACCOUNT_DIALOG_ID,
  RESET_PASSWORD_DIALOG_ID,
  TAKEDOWN_DIALOG_ID,
  UNTAKEDOWN_DIALOG_ID,
  useDidAccountModalForm,
  useDidDeleteAccountForm,
  useDidResetPasswordForm,
  useDidTakedownForm,
  useDidUntakedownForm,
  useOpenDidDeleteAccountModal,
  useOpenDidResetPasswordModal,
  useOpenDidTakedownModal,
  useOpenDidUntakedownModal,
} from "../atoms/did-operations";
import { usePDS } from "../atoms/session";
import { cn } from "../utils/cn";
import type { Did } from "../utils/types";

export function DidResetPasswordModal() {
  const pds = usePDS();
  const form = useDidResetPasswordForm();
  const newPasswordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form || !newPasswordRef.current) {
      throw new Error("Form or new password reference is missing");
    }
    await pds.resetPassword(form.did, newPasswordRef.current.value);
  };

  return (
    <dialog id={RESET_PASSWORD_DIALOG_ID} className="modal">
      <div className="modal-box">
        {form && (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="input">
              <span className="i-lucide-key-round"></span>
              <input
                type="password"
                required
                placeholder="New Password"
                ref={newPasswordRef}
              />
            </label>
            <button type="submit" className="btn btn-primary">
              Reset Password
            </button>
          </form>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export function DidResetPasswordButton({ did }: { did: Did }) {
  const openDidResetPasswordModal = useOpenDidResetPasswordModal();
  return (
    <div
      role="button"
      className="h-12 btn btn-ghost"
      onClick={(e) => {
        e.stopPropagation();
        openDidResetPasswordModal(did);
      }}
    >
      <span className="i-lucide-key-round size-4"></span>
      Reset Password
    </div>
  );
}

export function DidTakedownModal() {
  const pds = usePDS();
  const form = useDidTakedownForm();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!form) {
      throw new Error("Form is missing");
    }
    setLoading(true);
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      await pds.takedown(form.did, timestamp);
      const dialog = document.getElementById(
        TAKEDOWN_DIALOG_ID,
      ) as HTMLDialogElement | null;
      dialog?.close();
    } catch (error) {
      alert("Error: " + String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id={TAKEDOWN_DIALOG_ID} className="modal">
      <div className="modal-box">
        {form && (
          <div className="flex flex-col gap-4">
            <div className="p-4 text-center">
              <span className="i-lucide-ban size-12 mx-auto mb-4 text-error"></span>
              <p className="mb-4">
                Are you sure you want to takedown this account?
              </p>
              <button
                type="button"
                className="btn btn-error relative"
                disabled={loading}
                onClick={handleClick}
              >
                {loading && (
                  <div className="loading loading-spinner loading-sm absolute"></div>
                )}
                <span className={cn(loading && "opacity-0")}>
                  Takedown Account
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export function DidTakedownButton({ did }: { did: Did }) {
  const openDidTakedownModal = useOpenDidTakedownModal();
  return (
    <div
      role="button"
      className="h-12 btn btn-ghost"
      onClick={(e) => {
        e.stopPropagation();
        openDidTakedownModal(did);
      }}
    >
      <span className="i-lucide-ban size-4"></span>
      Takedown
    </div>
  );
}

export function DidUntakedownModal() {
  const pds = usePDS();
  const form = useDidUntakedownForm();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!form) {
      throw new Error("Form is missing");
    }
    setLoading(true);
    try {
      await pds.untakedown(form.did);
      const dialog = document.getElementById(
        UNTAKEDOWN_DIALOG_ID,
      ) as HTMLDialogElement | null;
      dialog?.close();
    } catch (error) {
      alert("Error: " + String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id={UNTAKEDOWN_DIALOG_ID} className="modal">
      <div className="modal-box">
        {form && (
          <div className="flex flex-col gap-4">
            <div className="p-4 text-center">
              <span className="i-lucide-check-circle size-12 mx-auto mb-4 text-success"></span>
              <p className="mb-4">
                Are you sure you want to untakedown this account?
              </p>
              <button
                type="button"
                className="btn btn-success relative"
                disabled={loading}
                onClick={handleClick}
              >
                {loading && (
                  <div className="loading loading-spinner loading-sm absolute"></div>
                )}
                <span className={cn(loading && "opacity-0")}>
                  Untakedown Account
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export function DidUntakedownButton({ did }: { did: Did }) {
  const openDidUntakedownModal = useOpenDidUntakedownModal();
  return (
    <div
      role="button"
      className="h-12 btn btn-ghost"
      onClick={(e) => {
        e.stopPropagation();
        openDidUntakedownModal(did);
      }}
    >
      <span className="i-lucide-check-circle size-4"></span>
      Untakedown
    </div>
  );
}

export function DidDeleteAccountModal() {
  const pds = usePDS();
  const form = useDidDeleteAccountForm();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!form) {
      throw new Error("Form is missing");
    }
    setLoading(true);
    try {
      await pds.deleteAccount(form.did);
      const dialog = document.getElementById(
        DELETE_ACCOUNT_DIALOG_ID,
      ) as HTMLDialogElement | null;
      dialog?.close();
    } catch (error) {
      alert("Error: " + String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id={DELETE_ACCOUNT_DIALOG_ID} className="modal">
      <div className="modal-box">
        {form && (
          <div className="flex flex-col gap-4">
            <div className="p-4 text-center">
              <span className="i-lucide-trash-2 size-12 mx-auto mb-4 text-error"></span>
              <p className="mb-4">
                Are you sure you want to delete this account? This action cannot
                be undone.
              </p>
              <button
                type="button"
                className="btn btn-error relative"
                disabled={loading}
                onClick={handleClick}
              >
                {loading && (
                  <div className="loading loading-spinner loading-sm absolute"></div>
                )}
                <span className={cn(loading && "opacity-0")}>
                  Delete Account
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export function DidDeleteButton({ did }: { did: Did }) {
  const openDidDeleteAccountModal = useOpenDidDeleteAccountModal();
  return (
    <div
      role="button"
      className="h-12 btn btn-ghost"
      onClick={(e) => {
        e.stopPropagation();
        openDidDeleteAccountModal(did);
      }}
    >
      <span className="i-lucide-trash-2 size-4"></span>
      Delete
    </div>
  );
}

export function DidAccountModal() {
  const form = useDidAccountModalForm();

  return (
    <dialog id={ACCOUNT_MODAL_DIALOG_ID} className="modal">
      <div className="modal-box">
        {form && (
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Account Info</h3>
            <pre className="p-4 bg-base-200 rounded-lg overflow-x-auto">
              <code>{JSON.stringify(form.repo, null, 2)}</code>
            </pre>
            <a
              href={`https://pdsls.dev/at://${form.repo.did}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-link w-full"
            >
              Open in pdsls.dev
            </a>
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
