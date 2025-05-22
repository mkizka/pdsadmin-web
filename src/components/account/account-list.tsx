import { useEffect } from "react";

import {
  INIT_PAGE_SIZE,
  useAccountList,
  useFetchMoreRepositories,
  useInitRepositories,
} from "../../atoms/account-list";
import { useOpenModal } from "../../atoms/modal";
import type { Repository } from "../../utils/pds";
import { AccountDropdown } from "./account-dropdown";
import { InfiniteScroll } from "./infinite-scroll";

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
  const openModal = useOpenModal();

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
      onClick={() => openModal({ type: "account-info", repo })}
      data-testid="account-list-row"
    >
      <div className="avatar avatar-placeholder">
        <div className="bg-neutral text-neutral-content size-10 rounded-full">
          <span className="i-lucide-circle-user size-6"></span>
        </div>
      </div>
      {/* palce-items-centerで全アイテムを縦横中央揃えした上で、2列目のみ横軸startに上書きする */}
      <div className="justify-self-start">
        <div className="font-bold" data-testid="account-list-row__handle">
          @{repo.accountInfo.handle}
        </div>
        <div className="text-xs font-semibold opacity-60">at://{repo.did}</div>
      </div>
      <AccountDropdown repo={repo} />
    </li>
  );
}

export function AccountList() {
  const accountList = useAccountList();
  const initRepositories = useInitRepositories();
  const fetchMoreRepositories = useFetchMoreRepositories();
  useEffect(() => {
    void initRepositories();
  }, [initRepositories]);

  // リロード時に追加読み込み後の長さでスケルトンを出すため
  const skeltonLength = Math.max(INIT_PAGE_SIZE, accountList.repos.length);
  const skeltonRepos = Array.from({ length: skeltonLength }).map(() => null);

  const listedRepos = [
    ...accountList.repos,
    ...Array.from({
      length: INIT_PAGE_SIZE - accountList.repos.length,
    }).map(() => null),
  ];

  return (
    <ul className="list rounded-box shadow-md">
      <li className="p-4 pb-2 font-bold">Repositories</li>
      {accountList.isInitLoading
        ? skeltonRepos.map((_, i) => <SkeltonListRaw key={i} />)
        : listedRepos.map((repo, i) => (
            <AccountListRaw key={repo?.did ?? i} repo={repo} />
          ))}
      <InfiniteScroll
        onIntersect={() => fetchMoreRepositories()}
        isLoading={accountList.isFetchMoreLoading}
        hasNextPage={accountList.hasNextPage}
      />
    </ul>
  );
}
