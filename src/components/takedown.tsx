import type { FormEvent } from "react";
import { useRef } from "react";

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
  const reasonRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form || !reasonRef.current) {
      throw new Error("Form or reason reference is missing");
    }
    await pds.takedown(form.did, reasonRef.current.value);
  };

  return (
    <dialog id={TAKEDOWN_DIALOG_ID} className="modal">
      <div className="modal-box">
        {form && (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="input">
              <span className="i-lucide-ban"></span>
              <input
                type="text"
                required
                placeholder="Reason for takedown"
                ref={reasonRef}
              />
            </label>
            <button type="submit" className="btn btn-primary">
              Takedown Account
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
