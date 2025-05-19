import type { FormEvent } from "react";
import { useState } from "react";

import { usePDS } from "../atoms/session";
import {
  UNTAKEDOWN_DIALOG_ID,
  useOpenUntakedownModal,
  useUntakedownForm,
} from "../atoms/untakedown";
import { cn } from "../utils/cn";
import type { Did } from "../utils/types";

export function UntakedownModal() {
  const pds = usePDS();
  const form = useUntakedownForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form) {
      throw new Error("Form is missing");
    }
    setLoading(true);
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      await pds.untakedown(form.did, timestamp);
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
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="p-4 text-center">
              <span className="i-lucide-check-circle size-12 mx-auto mb-4 text-success"></span>
              <p className="mb-4">
                Are you sure you want to untakedown this account?
              </p>
              <button
                type="submit"
                className="btn btn-success relative"
                disabled={loading}
              >
                {loading && (
                  <div className="loading loading-spinner loading-sm absolute"></div>
                )}
                <span className={cn(loading && "opacity-0")}>
                  Untakedown Account
                </span>
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

export function UntakedownButton({ did }: { did: Did }) {
  const openUntakedownModal = useOpenUntakedownModal();
  return (
    <div
      role="button"
      className="h-12 btn btn-ghost"
      onClick={(e) => {
        e.stopPropagation();
        openUntakedownModal(did);
      }}
    >
      <span className="i-lucide-check-circle size-4"></span>
      Untakedown
    </div>
  );
}
