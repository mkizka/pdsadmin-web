import { useCallback, useEffect, useState } from "react";

import type { AccountInfo } from "../utils/pds";
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

function AccountListRaw({ account }: { account: AccountInfo | null }) {
  if (!account) {
    return (
      <li className="list-row place-items-center">
        <div className="list-col-grow w-full">
          <span className="btn btn-ghost h-16 w-full">No account</span>
        </div>
      </li>
    );
  }
  return (
    <li className="list-row place-items-center">
      <div className="list-col-grow w-full">
        <a
          className="btn btn-ghost gap-4 h-16 w-full"
          href={`https://pdsls.dev/at://${account.did}`}
          target="_blank"
          rel="noreferrer"
        >
          <div className="avatar avatar-placeholder">
            <div className="bg-neutral text-neutral-content size-10 rounded-full">
              <span className="i-lucide-circle-user size-6"></span>
            </div>
          </div>
          <div className="flex-1 text-start">
            <div className="font-bold">@{account.handle}</div>
            <div className="text-xs font-semibold opacity-60">
              at://{account.did}
            </div>
          </div>
        </a>
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
    </li>
  );
}

export function AccountList() {
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const pds = usePDS();
  const [loading, setLoading] = useState(true);

  const updateAccountList = useCallback(async () => {
    setLoading(true);
    const accounts = await pds.getAccounts();
    setAccounts(accounts);
    setLoading(false);
  }, [pds]);

  useEffect(() => {
    void updateAccountList();
  }, [updateAccountList]);

  const skeltonAccounts = Array.from({ length: PAGE_SIZE }).map(() => null);
  const listedAccounts = [
    ...accounts,
    ...Array.from({ length: PAGE_SIZE - accounts.length }).map(() => null),
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
        ? skeltonAccounts.map((_, i) => <SkeltonListRaw key={i} />)
        : listedAccounts.map((account, i) => (
            <AccountListRaw key={account?.did ?? i} account={account} />
          ))}
    </ul>
  );
}
