import { type FormEvent, useState } from "react";

import {
  type DidOperation,
  didOperationDialog,
  useDidOperation,
} from "../atoms/did-operation";
import { usePDS } from "../atoms/session";
import { cn } from "../utils/cn";
import type { Repository } from "../utils/pds";
import type { Did } from "../utils/types";

const useWithLoading = (fn: () => Promise<void>) => {
  const [loading, setLoading] = useState(false);
  const handler = async () => {
    setLoading(true);
    try {
      await fn();
      didOperationDialog.close();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      alert("Error: " + String(error));
    } finally {
      setLoading(false);
    }
  };
  return { loading, handler };
};

type AccountInfoOperationBodyProps = {
  repo: Repository;
};

function AccountInfoOperationBody({ repo }: AccountInfoOperationBodyProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-bold text-lg">Account Info</h3>
      <pre className="p-4 bg-base-200 rounded-lg overflow-x-auto">
        <code>{JSON.stringify(repo, null, 2)}</code>
      </pre>
      <a
        href={`https://pdsls.dev/at://${repo.did}`}
        target="_blank"
        rel="noreferrer"
        className="btn btn-link w-full"
      >
        Open in pdsls.dev
      </a>
    </div>
  );
}

type OperationBodyProps = {
  did: Did;
};

function ResetPasswordOperationBody({ did }: OperationBodyProps) {
  const pds = usePDS();
  const [newPassword, setNewPassword] = useState("");
  const { loading, handler } = useWithLoading(() =>
    pds.resetPassword(did, newPassword),
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handler();
    setNewPassword("");
  };

  return (
    <form className="flex flex-col gap-4 items-center" onSubmit={handleSubmit}>
      <span className="i-lucide-key-round size-12"></span>
      <p>Enter new password</p>
      <label className="input">
        <input
          type="password"
          placeholder="New Password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </label>
      <button
        type="submit"
        className="btn btn-primary relative"
        disabled={loading}
      >
        {loading && (
          <div className="loading loading-spinner loading-sm absolute"></div>
        )}
        <span className={cn(loading && "opacity-0")}>Reset Password</span>
      </button>
    </form>
  );
}

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

function OperationBody({ didOperation }: { didOperation: DidOperation }) {
  if (didOperation.type === "account-info") {
    return <AccountInfoOperationBody {...didOperation} />;
  }
  if (didOperation.type === "reset-password") {
    return <ResetPasswordOperationBody {...didOperation} />;
  }
  if (didOperation.type === "takedown") {
    return <TakedownOperationBody {...didOperation} />;
  }
  if (didOperation.type === "untakedown") {
    return <UntakedownOperationBody {...didOperation} />;
  }
  return <DeleteOperationBody {...didOperation} />;
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
