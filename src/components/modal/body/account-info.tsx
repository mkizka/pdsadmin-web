import type { Repository } from "../../../utils/pds";

type Props = {
  repo: Repository;
};

export function AccountInfoModalBody({ repo }: Props) {
  const { accountInfo, repoInfo } = repo;
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">@{repo.accountInfo.handle}</h2>
      <h3 className="font-bold">com.atproto.admin.defs#accountView</h3>
      <pre className="bg-base-200 overflow-x-auto rounded-lg p-4">
        <code>{JSON.stringify(repoInfo, null, 2)}</code>
      </pre>
      <h3 className="font-bold">com.atproto.admin.getAccountInfos#repo</h3>
      <pre className="bg-base-200 overflow-x-auto rounded-lg p-4">
        <code>{JSON.stringify(accountInfo, null, 2)}</code>
      </pre>
      <div className="flex gap-2">
        <a
          href={`https://pdsls.dev/at://${repoInfo.did}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-neutral flex-1 whitespace-nowrap"
        >
          <span className="i-lucide-external-link size-4"></span>
          PDSls
        </a>
        <a
          href={`https://bsky.app/profile/${repoInfo.did}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-neutral flex-1 whitespace-nowrap"
        >
          <span className="i-lucide-external-link size-4"></span>
          Bluesky
        </a>
      </div>
    </div>
  );
}
