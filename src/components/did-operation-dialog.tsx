import { useState } from "react";

import {
  type DidOperation,
  didOperationDialog,
  useDidOperation,
  useOpenDidOperationModal,
} from "../atoms/did-operation";
import { usePDS } from "../atoms/session";
import { cn } from "../utils/cn";
import type { Did } from "../utils/types";

const useWithLoading = (fn: () => Promise<void>) => {
  const [loading, setLoading] = useState(false);
  const handler = async () => {
    setLoading(true);
    try {
      await fn();
      didOperationDialog.close();
    } catch (error) {
      alert("Error: " + String(error));
    } finally {
      setLoading(false);
    }
  };
  return { loading, handler };
};

type OperationBodyProps = {
  did: Did;
};

function TakedownOperationBody({ did }: OperationBodyProps) {
  const pds = usePDS();
  const { loading, handler } = useWithLoading(async () => {
    const ref = (new Date().getTime() / 1000).toString();
    await pds.takedown(did, ref);
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 text-center">
        <span className="i-lucide-ban size-12 mx-auto mb-4 text-error"></span>
        <p className="mb-4">Are you sure you want to takedown this account?</p>
        <button
          type="button"
          className="btn btn-error relative"
          disabled={loading}
          onClick={handler}
        >
          {loading && (
            <div className="loading loading-spinner loading-sm absolute"></div>
          )}
          <span className={cn(loading && "opacity-0")}>Takedown Account</span>
        </button>
      </div>
    </div>
  );
}

function UntakedownOperationBody({ did }: OperationBodyProps) {
  const pds = usePDS();
  const { loading, handler } = useWithLoading(() => pds.untakedown(did));
  return (
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
          onClick={handler}
        >
          {loading && (
            <div className="loading loading-spinner loading-sm absolute"></div>
          )}
          <span className={cn(loading && "opacity-0")}>Untakedown Account</span>
        </button>
      </div>
    </div>
  );
}

function DeleteOperationBody({ did }: OperationBodyProps) {
  const pds = usePDS();
  const { loading, handler } = useWithLoading(() => pds.deleteAccount(did));
  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 text-center">
        <span className="i-lucide-trash-2 size-12 mx-auto mb-4 text-error"></span>
        <p className="mb-4">
          Are you sure you want to delete this account? This action cannot be
          undone.
        </p>
        <button
          type="button"
          className="btn btn-error relative"
          disabled={loading}
          onClick={handler}
        >
          {loading && (
            <div className="loading loading-spinner loading-sm absolute"></div>
          )}
          <span className={cn(loading && "opacity-0")}>Delete Account</span>
        </button>
      </div>
    </div>
  );
}

function OperationBody({
  didOperation: { type, ...bodyProps },
}: {
  didOperation: DidOperation;
}) {
  switch (type) {
    case "takedown":
      return <TakedownOperationBody {...bodyProps} />;
    case "untakedown":
      return <UntakedownOperationBody {...bodyProps} />;
    case "delete":
      return <DeleteOperationBody {...bodyProps} />;
    default:
      throw new Error("Unknown operation type");
  }
}

export function DidOperationDialog() {
  const didOperation = useDidOperation();

  // idを指定してopenModalするのでdialog要素は常に必要
  return (
    <dialog id={didOperationDialog.getElementId()} className="modal">
      {didOperation && (
        <div className="modal-box">
          <OperationBody didOperation={didOperation} />
        </div>
      )}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export function DeleteAccountButton({ did }: { did: Did }) {
  const openDidOperationModal = useOpenDidOperationModal();
  return (
    <div
      role="button"
      className="h-12 btn btn-ghost text-error"
      onClick={(e) => {
        e.stopPropagation();
        openDidOperationModal({ type: "delete", did });
      }}
    >
      <span className="i-lucide-trash-2 size-4"></span>
      Delete
    </div>
  );
}

export function TakedownAccountButton({ did }: { did: Did }) {
  const openDidOperationModal = useOpenDidOperationModal();
  return (
    <div
      role="button"
      className="h-12 btn btn-ghost text-error"
      onClick={(e) => {
        e.stopPropagation();
        openDidOperationModal({ type: "takedown", did });
      }}
    >
      <span className="i-lucide-ban size-4"></span>
      Takedown
    </div>
  );
}

export function UntakedownAccountButton({ did }: { did: Did }) {
  const openDidOperationModal = useOpenDidOperationModal();
  return (
    <div
      role="button"
      className="h-12 btn btn-ghost text-success"
      onClick={(e) => {
        e.stopPropagation();
        openDidOperationModal({ type: "untakedown", did });
      }}
    >
      <span className="i-lucide-check-circle size-4"></span>
      Untakedown
    </div>
  );
}
