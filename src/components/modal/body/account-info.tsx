import type { Repository } from "../../../utils/pds";

type Props = {
  repo: Repository;
};

export function AccountInfoModalBody({ repo }: Props) {
  const { accountInfo, repoInfo } = repo;
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-lg">@{repo.accountInfo.handle}</h2>
      <h3 className="font-bold">com.atproto.sync.listRepos</h3>
      <pre className="p-4 bg-base-200 rounded-lg overflow-x-auto">
        <code>{JSON.stringify(repoInfo, null, 2)}</code>
      </pre>
      <h3 className="font-bold">com.atproto.admin.getAccountInfos</h3>
      <pre className="p-4 bg-base-200 rounded-lg overflow-x-auto">
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
