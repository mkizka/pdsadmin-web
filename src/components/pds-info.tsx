import { useOpenModal } from "../atoms/modal";
import { usePDSHostname } from "../atoms/pds";
import { InviteCodeButton } from "./invite-code";

function RequestCrawlButton() {
  const openModal = useOpenModal();
  return (
    <button
      className="btn btn-primary"
      onClick={() => openModal({ type: "request-crawl" })}
    >
      <span className="i-lucide-cloud size-4 mr-1"></span>
      Request Crawl
    </button>
  );
}

export function PDSInfo() {
  const pdsHostname = usePDSHostname();
  return (
    <div className="card shadow-md rounded-box mb-4">
      <div className="card-body p-4">
        <h2 className="card-title text-xl">
          PDS:<span className="font-mono">{pdsHostname}</span>
        </h2>
        <div className="card-actions justify-end">
          <RequestCrawlButton />
          <InviteCodeButton />
        </div>
      </div>
    </div>
  );
}
