import { useState } from "react";

import { usePDS } from "../atoms/session";
import {
  TAKEDOWN_DIALOG_ID,
  useOpenTakedownModal,
  useTakedownForm,
} from "../atoms/takedown";
import { cn } from "../utils/cn";
import type { Did } from "../utils/types";

export function TakedownModal() {
  const pds = usePDS();
  const form = useTakedownForm();
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

export function TakedownButton({ did }: { did: Did }) {
  const openTakedownModal = useOpenTakedownModal();
  return (
    <div
      role="button"
      className="h-12 btn btn-ghost"
      onClick={(e) => {
        e.stopPropagation();
        openTakedownModal(did);
      }}
    >
      <span className="i-lucide-ban size-4"></span>
      Takedown
    </div>
  );
}
