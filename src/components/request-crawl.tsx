import { useOpenModal } from "../atoms/modal";

export function RequestCrawl() {
  const openModal = useOpenModal();
  return (
    <div className="card shadow-md rounded-box">
      <div className="card-body">
        <h2 className="card-title text-base">Request Crawl</h2>
        <p>Request a relay server to crawl your repository.</p>
        <div className="card-actions justify-end mt-2">
          <button
            className="btn btn-primary"
            onClick={() => openModal({ type: "request-crawl" })}
          >
            <span className="i-lucide-cloud size-4 mr-1"></span>
            Request Crawl
          </button>
        </div>
      </div>
    </div>
  );
}
