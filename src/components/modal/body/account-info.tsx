import type { Repository } from "../../../utils/pds";

type Props = {
  repo: Repository;
};

export function AccountInfoModalBody({ repo }: Props) {
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
