import { type FormEvent, useState } from "react";

import { useReloadRepositories } from "../atoms/account-list";
import { modal, type ModalAction, useModalAction } from "../atoms/modal";
import { usePDS } from "../atoms/pds";
import { useToast } from "../atoms/toast";
import { cn } from "../utils/cn";
import type { Repository } from "../utils/pds";
import type { Did } from "../utils/types";

const useWithLoading = (fn: () => Promise<void>) => {
  const [loading, setLoading] = useState(false);
  const reloadRepos = useReloadRepositories();
  const handler = async () => {
    setLoading(true);
    try {
      await fn();
      modal.close();
      await reloadRepos();
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

type AccountInfoModalBodyProps = {
  repo: Repository;
};

function AccountInfoModalBody({ repo }: AccountInfoModalBodyProps) {
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

type AccountOperationModalBodyProps = {
  did: Did;
};

function ResetPasswordModalBody({ did }: AccountOperationModalBodyProps) {
  const pds = usePDS();
  const [newPassword, setNewPassword] = useState("");
  const toast = useToast();

  const { loading, handler } = useWithLoading(async () => {
    await pds.resetPassword(did, newPassword);
    toast.success("Password reset successfully");
    setNewPassword("");
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handler();
  };

  return (
    <form className="flex flex-col gap-4 items-center" onSubmit={handleSubmit}>
      <span className="i-lucide-key-round size-12"></span>
      <p className="text-center">Enter new password</p>
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

function TakedownModalBody({ did }: AccountOperationModalBodyProps) {
  const pds = usePDS();
  const toast = useToast();

  const { loading, handler } = useWithLoading(async () => {
    const ref = (new Date().getTime() / 1000).toString();
    await pds.takedown(did, ref);
    toast.success("Account takedown successfully");
  });

  return (
    <div className="flex flex-col gap-4 items-center">
      <span className="i-lucide-ban size-12 text-error"></span>
      <p className="text-center">
        Are you sure you want to takedown this account?
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
        <span className={cn(loading && "opacity-0")}>Takedown Account</span>
      </button>
    </div>
  );
}

function UntakedownModalBody({ did }: AccountOperationModalBodyProps) {
  const pds = usePDS();
  const toast = useToast();

  const { loading, handler } = useWithLoading(async () => {
    await pds.untakedown(did);
    toast.success("Account untakedown successfully");
  });

  return (
    <div className="flex flex-col gap-4 items-center">
      <span className="i-lucide-check-circle size-12 text-success"></span>
      <p className="text-center">
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
  );
}

function DeleteModalBody({ did }: AccountOperationModalBodyProps) {
  const pds = usePDS();
  const toast = useToast();

  const { loading, handler } = useWithLoading(async () => {
    await pds.deleteAccount(did);
    toast.success("Account deleted successfully");
  });

  return (
    <div className="flex flex-col gap-4 items-center">
      <span className="i-lucide-trash-2 size-12 text-error"></span>
      <p className="text-center">
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
  );
}

function RequestCrawlModalBody() {
  const pds = usePDS();
  const [hostname, setHostname] = useState("");
  const { loading, handler } = useWithLoading(() => pds.requestCrawl(hostname));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handler();
    setHostname("");
  };

  return (
    <form className="flex flex-col gap-4 items-center" onSubmit={handleSubmit}>
      <span className="i-lucide-refresh-cw size-12"></span>
      <p className="text-center">Enter relay address to request crawl</p>
      <label className="input">
        <input
          type="text"
          placeholder="https://bsky.network"
          required
          value={hostname}
          onChange={(e) => setHostname(e.target.value)}
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
        <span className={cn(loading && "opacity-0")}>Request Crawl</span>
      </button>
    </form>
  );
}

function ModalBody({ modalAction }: { modalAction: ModalAction }) {
  if (modalAction.type === "account-info") {
    return <AccountInfoModalBody {...modalAction} />;
  }
  if (modalAction.type === "reset-password") {
    return <ResetPasswordModalBody {...modalAction} />;
  }
  if (modalAction.type === "takedown") {
    return <TakedownModalBody {...modalAction} />;
  }
  if (modalAction.type === "untakedown") {
    return <UntakedownModalBody {...modalAction} />;
  }
  if (modalAction.type === "request-crawl") {
    return <RequestCrawlModalBody />;
  }
  return <DeleteModalBody {...modalAction} />;
}

export function ModalDialog() {
  const modalAction = useModalAction();
  return (
    <dialog id={modal.getElementId()} className="modal">
      {modalAction && (
        <div className="modal-box">
          <ModalBody modalAction={modalAction} />
        </div>
      )}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
