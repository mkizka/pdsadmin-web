import { useState } from "react";

import {
  DELETE_ACCOUNT_DIALOG_ID,
  useDeleteAccountForm,
  useOpenDeleteAccountModal,
} from "../atoms/delete-account";
import { usePDS } from "../atoms/session";
import { cn } from "../utils/cn";
import type { Did } from "../utils/types";

export function DeleteAccountModal() {
  const pds = usePDS();
  const form = useDeleteAccountForm();
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

export function DeleteButton({ did }: { did: Did }) {
  const openDeleteAccountModal = useOpenDeleteAccountModal();
  return (
    <div
      role="button"
      className="h-12 btn btn-ghost"
      onClick={(e) => {
        e.stopPropagation();
        openDeleteAccountModal(did);
      }}
    >
      <span className="i-lucide-trash-2 size-4"></span>
      Delete
    </div>
  );
}
