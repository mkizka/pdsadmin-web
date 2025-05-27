import { useEffect } from "react";
import { useTranslation } from "react-i18next";

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

function SkeltonListRow() {
  return (
    <li className="list-row h-20 place-items-center gap-4">
      <div className="skeleton size-10 rounded-full"></div>
      <div className="flex w-full flex-col gap-2">
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-2 w-full"></div>
      </div>
      <div className="btn skeleton size-8 rounded-full"></div>
    </li>
  );
}

function AccountListRow({ repo }: { repo: Repository | null }) {
  const openModal = useOpenModal();
  const { t } = useTranslation();

  if (!repo) {
    return (
      <li className="list-row h-20 place-items-center">
        <div className="list-col-grow text-center">
          {t("account.list.no-account")}
        </div>
      </li>
    );
  }

  return (
    <li
      className="list-row hover:bg-base-300 h-20 w-full items-center gap-4 hover:cursor-pointer"
      onClick={() => openModal({ type: "account-info", repo })}
      data-testid="account-list-row"
    >
      <div className="avatar avatar-placeholder size-10">
        <div className="bg-neutral text-neutral-content rounded-full">
          <span className="i-lucide-circle-user size-6"></span>
        </div>
      </div>
      {/* min-w-0がないとflexの子要素が横幅いっぱいに広がってしまう */}
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2">
          <div
            className="truncate font-bold"
            data-testid="account-list-row__handle"
          >
            @{repo.accountInfo.handle}
          </div>
          {repo.repoInfo.status === "takendown" && (
            <div
              className="badge badge-error badge-sm font-bold whitespace-nowrap"
              data-testid="account-list-row__takedown-badge"
            >
              Takedown
            </div>
          )}
        </div>
        <div className="truncate text-xs font-semibold opacity-60">
          at://{repo.repoInfo.did}
        </div>
      </div>
      <AccountDropdown repo={repo} />
    </li>
  );
}

const nullArray = (length: number) => {
  return Array.from({ length }).map(() => null);
};

export function AccountList() {
  const accountList = useAccountList();
  const initRepositories = useInitRepositories();
  const fetchMoreRepositories = useFetchMoreRepositories();

  useEffect(() => {
    void initRepositories();
  }, [initRepositories]);

  const reposLength = accountList.repos?.length ?? 0;
  // リロード時に追加読み込み後の長さでスケルトンを出すために、
  // reposLengthが初回読み込みより長ければそちらを使う
  const skeltons = nullArray(Math.max(INIT_PAGE_SIZE, reposLength));

  // 初回読み込みサイズより小さい場合は余った行数を「アカウントなし」で埋める
  const noAccounts = nullArray(INIT_PAGE_SIZE - reposLength);
  const listedRepos = [...(accountList.repos ?? []), ...noAccounts];

  return (
    <ul
      className="list rounded-box bg-base-100 shadow-md"
      data-testid="account-list"
    >
      {accountList.isInitLoading
        ? skeltons.map((_, i) => <SkeltonListRow key={i} />)
        : listedRepos.map((repo, i) => (
            <AccountListRow key={repo?.repoInfo.did ?? i} repo={repo} />
          ))}
      <InfiniteScroll
        onIntersect={() => fetchMoreRepositories()}
        isLoading={accountList.isFetchMoreLoading}
        hasNextPage={accountList.hasNextPage}
      />
    </ul>
  );
}
