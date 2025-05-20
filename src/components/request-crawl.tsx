import { useOpenAccountOperationModal } from "../atoms/account-operation";

export function RequestCrawlButton() {
  const openModal = useOpenAccountOperationModal();

  const handleRequestCrawl = () => {
    openModal({ type: "request-crawl" });
  };

  return (
    <div className="card shadow-md rounded-box mb-4">
      <div className="card-body p-4">
        <h2 className="card-title text-base">Request Crawl</h2>
        <p className="text-sm">
          Request a relay server to crawl your repository.
        </p>
        <div className="card-actions justify-end mt-2">
          <button className="btn btn-primary" onClick={handleRequestCrawl}>
            <span className="i-lucide-refresh-cw size-4 mr-1"></span>
            Request Crawl
          </button>
        </div>
      </div>
    </div>
  );
}
