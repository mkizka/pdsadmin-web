import type { MouseEvent } from "react";
import { useCallback, useEffect, useState } from "react";

import type { Repository } from "../utils/pds";
import { usePDS } from "../utils/session";
import { InviteCodeButton } from "./InviteCodeButton";
import { ResetPasswordButton } from "./ResetPasswordButton";

function SkeltonListRaw() {
  return (
    <li className="list-row h-20 place-items-center gap-2">
      <div className="skeleton size-10 rounded-full"></div>
      <div className="flex flex-col gap-2 w-full">
        <div className="skeleton w-full h-4"></div>
        <div className="skeleton w-full h-2"></div>
      </div>
      <div className="btn skeleton rounded-full size-8"></div>
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
      <li className="list-row place-items-center h-20">
        <div className="list-col-grow text-center">No account</div>
      </li>
    );
  }

  const handleModalOpen = () => {
    const modal = document.getElementById(
      `account-modal_${repo.did}`,
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };

  const preventClickPropagation = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <li
      className="list-row place-items-center gap-2 h-20 touch-none select-none hover:bg-base-200 hover:cursor-pointer"
      onClick={handleModalOpen}
    >
      <div className="avatar avatar-placeholder">
        <div className="bg-neutral text-neutral-content size-10 rounded-full">
          <span className="i-lucide-circle-user size-6"></span>
        </div>
      </div>
      {/* palce-items-centerで全アイテムを縦横中央揃えした上で、2列目のみ横軸startに上書きする */}
      <div className="justify-self-start">
        <div className="font-bold">@{repo.accountInfo.handle}</div>
        <div className="text-xs font-semibold opacity-60">at://{repo.did}</div>
      </div>
      <div className="dropdown dropdown-end" onClick={preventClickPropagation}>
        <div
          tabIndex={0}
          role="button"
          className="btn btn-circle btn-ghost size-8"
        >
          <span className="i-lucide-more-horizontal size-6"></span>
        </div>
        <ul
          tabIndex={0}
          className="menu dropdown-content bg-base-100 rounded-box w-48 shadow-md"
          onClick={preventClickPropagation}
        >
          <li>
            <ResetPasswordButton did={repo.did} />
          </li>
          <li>
            <a
              className="h-12 text-error content-center"
              onClick={preventClickPropagation}
            >
              <span className="i-lucide-ban size-4"></span>
              Takedown
            </a>
          </li>
          <li>
            <a
              className="h-12 text-error content-center"
              onClick={preventClickPropagation}
            >
              <span className="i-lucide-trash-2 size-4"></span>
              Delete
            </a>
          </li>
        </ul>
      </div>
      <AccountModal repo={repo} />
    </li>
  );
}

const INIT_PAGE_SIZE = 3;
const FETCH_PAGE_SIZE = 10;

export function AccountList() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [cursor, setCursor] = useState<string>();
  const pds = usePDS();
  const [initLoading, setInitLoading] = useState(true);
  const [fetchLoading, setFetchLoading] = useState(false);

  const initAccountList = useCallback(async () => {
    setInitLoading(true);
    const { repos, cursor: newCursor } = await pds.listRepos({
      limit: INIT_PAGE_SIZE,
    });
    setRepositories(repos);
    setCursor(newCursor);
    setInitLoading(false);
  }, [pds]);

  const fetchAccountList = useCallback(async () => {
    setFetchLoading(true);
    const { repos: newRepos, cursor: newCursor } = await pds.listRepos({
      limit: FETCH_PAGE_SIZE,
      cursor,
    });
    setRepositories((prev) => [...prev, ...newRepos]);
    setCursor(newCursor);
    setFetchLoading(false);
  }, [cursor, pds]);

  useEffect(() => {
    void initAccountList();
  }, [initAccountList]);

  const skeltonRepositories = Array.from({ length: INIT_PAGE_SIZE }).map(
    () => null,
  );

  const listedRepositories = [
    ...repositories,
    ...Array.from({ length: INIT_PAGE_SIZE - repositories.length }).map(
      () => null,
    ),
  ];

  return (
    <ul className="list rounded-box shadow-md">
      <li className="p-4 pb-2 flex items-center">
        <div className="font-bold flex-1">Repositories</div>
        <InviteCodeButton />
      </li>
      {initLoading
        ? skeltonRepositories.map((_, i) => <SkeltonListRaw key={i} />)
        : listedRepositories.map((repo, i) => (
            <AccountListRaw key={repo?.did ?? i} repo={repo} />
          ))}
      {cursor && (
        <li>
          <div className="list-col-grow w-full">
            <button
              className="btn btn-primary h-12 w-full"
              onClick={() => fetchAccountList()}
              disabled={fetchLoading}
            >
              {fetchLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <span>Load More</span>
              )}
            </button>
          </div>
        </li>
      )}
    </ul>
  );
}
