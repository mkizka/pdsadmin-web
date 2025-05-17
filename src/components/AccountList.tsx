import { useCallback, useEffect, useState } from "react";

import type { Repository } from "../utils/pds";
import { usePDS } from "../utils/session";

const PAGE_SIZE = 10;

function SkeltonListRaw() {
  return (
    <li className="list-row place-items-center">
      <div className="list-col-grow w-full">
        <span className="btn btn-ghost gap-4 h-16 w-full">
          <div className="skeleton size-10 rounded-full"></div>
          <div className="flex flex-col gap-2 flex-1">
            <div className="skeleton w-full h-4"></div>
            <div className="skeleton w-full h-2"></div>
          </div>
        </span>
      </div>
      <div className="btn skeleton w-16 h-10"></div>
      <div className="btn skeleton w-16 h-10"></div>
    </li>
  );
}

function AccountModal({ repo }: { repo: Repository }) {
  return (
    <dialog id={`account-modal_${repo.did}`} className="modal">
      <div className="modal-box">
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
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

function AccountListRaw({ repo }: { repo: Repository | null }) {
  if (!repo) {
    return (
      <li className="list-row place-items-center">
        <div className="list-col-grow w-full">
          <span className="btn btn-ghost h-16 w-full">No account</span>
        </div>
      </li>
    );
  }

  const handleModalOpen = () => {
    const modal = document.getElementById(
      `account-modal_${repo.did}`,
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };

  return (
    <li className="list-row place-items-center">
      <div className="list-col-grow w-full">
        <button
          className="btn btn-ghost gap-4 h-16 w-full"
          onClick={handleModalOpen}
        >
          <div className="avatar avatar-placeholder">
            <div className="bg-neutral text-neutral-content size-10 rounded-full">
              <span className="i-lucide-circle-user size-6"></span>
            </div>
          </div>
          <div className="flex-1 text-start">
            <div className="font-bold">@{repo.accountInfo.handle}</div>
            <div className="text-xs font-semibold opacity-60">
              at://{repo.did}
            </div>
          </div>
        </button>
      </div>
      <div className="tooltip" data-tip="Takedown">
        <button className="btn btn-error">
          <span className="i-lucide-circle-alert size-6"></span>
        </button>
      </div>
      <div className="tooltip" data-tip="Delete">
        <button className="btn btn-error">
          <span className="i-lucide-trash-2 size-6"></span>
        </button>
      </div>
      <AccountModal repo={repo} />
    </li>
  );
}

export function AccountList() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const pds = usePDS();
  const [loading, setLoading] = useState(true);

  const updateAccountList = useCallback(async () => {
    setLoading(true);
    const { repos, cursor } = await pds.listRepos();
    setRepositories(repos);
    setCursor(cursor ?? null);
    setLoading(false);
  }, [pds]);

  useEffect(() => {
    void updateAccountList();
  }, [updateAccountList]);

  const skeltonRepositories = Array.from({ length: PAGE_SIZE }).map(() => null);
  const listedRepositories = [
    ...repositories,
    ...Array.from({ length: PAGE_SIZE - repositories.length }).map(() => null),
  ];

  return (
    <ul className="list rounded-box shadow-md">
      <li className="p-4 pb-2 flex items-center">
        <div className="font-bold flex-1">Repositories</div>
        <button
          className="btn btn-ghost btn-square"
          onClick={updateAccountList}
          disabled={loading}
        >
          <span className="i-lucide-refresh-ccw size-6"></span>
        </button>
      </li>
      {loading
        ? skeltonRepositories.map((_, i) => <SkeltonListRaw key={i} />)
        : listedRepositories.map((repo, i) => (
            <AccountListRaw key={repo?.did ?? i} repo={repo} />
          ))}
    </ul>
  );
}
