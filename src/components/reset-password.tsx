import type { FormEvent } from "react";
import { useRef } from "react";

import {
  RESET_PASSWORD_DIALOG_ID,
  useOpenResetPasswordModal,
  useResetPasswordForm,
} from "../atoms/reset-password";
import { usePDS } from "../atoms/session";
import type { Did } from "../utils/types";

export function ResetPasswordModal() {
  const pds = usePDS();
  const form = useResetPasswordForm();
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

export function ResetPasswordButton({ did }: { did: Did }) {
  const openPasswordResetModal = useOpenResetPasswordModal();
  return (
    <div
      role="button"
      className="h-12 btn btn-ghost"
      onClick={(e) => {
        e.stopPropagation();
        openPasswordResetModal(did);
      }}
    >
      <span className="i-lucide-key-round size-4"></span>
      Reset Password
    </div>
  );
}
