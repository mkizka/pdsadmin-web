import type { FormEvent } from "react";

import { usePDS } from "../atoms/session";
import {
  TAKEDOWN_DIALOG_ID,
  useOpenTakedownModal,
  useTakedownForm,
} from "../atoms/takedown";
import type { Did } from "../utils/types";

export function TakedownModal() {
  const pds = usePDS();
  const form = useTakedownForm();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form) {
      throw new Error("Form is missing");
    }
    const timestamp = Math.floor(Date.now() / 1000).toString();
    await pds.takedown(form.did, timestamp);
  };

  return (
    <dialog id={TAKEDOWN_DIALOG_ID} className="modal">
      <div className="modal-box">
        {form && (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="p-4 text-center">
              <span className="i-lucide-ban size-12 mx-auto mb-4 text-error"></span>
              <p className="mb-4">
                Are you sure you want to takedown this account?
              </p>
              <button type="submit" className="btn btn-error">
                Takedown Account
              </button>
            </div>
          </form>
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
