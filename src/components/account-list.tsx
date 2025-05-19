import type { MouseEvent } from "react";
import { useCallback, useEffect, useState } from "react";

import { useOpenAccountModal } from "../atoms/did-operations";
import { usePDS } from "../atoms/session";
import type { Repository } from "../utils/pds";
import {
  DeleteButton,
  ResetPasswordButton,
  TakedownButton,
  UntakedownButton,
} from "./did-operations";
import { InviteCodeButton } from "./invite-code";

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

function AccountListRaw({ repo }: { repo: Repository | null }) {
  const openAccountModal = useOpenAccountModal();

  const preventClickPropagation = (e: MouseEvent) => {
    e.stopPropagation();
  };

  if (!repo) {
    return (
      <li className="list-row place-items-center h-20">
        <div className="list-col-grow text-center">No account</div>
      </li>
    );
  }

  return (
    <li
      className="list-row place-items-center gap-2 h-20 touch-none select-none hover:bg-base-200 hover:cursor-pointer"
      onClick={() => openAccountModal(repo)}
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
          {repo.status === "takendown" ? (
            <li>
              <UntakedownButton did={repo.did} />
            </li>
          ) : (
            <li>
              <TakedownButton did={repo.did} />
            </li>
          )}
          <li>
            <DeleteButton did={repo.did} />
          </li>
        </ul>
      </div>
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
