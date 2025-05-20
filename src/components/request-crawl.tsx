import { useState } from "react";

import { usePDS } from "../atoms/pds";
import { cn } from "../utils/cn";

export function RequestCrawlButton() {
  const pds = usePDS();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRequestCrawl = async () => {
    setLoading(true);
    try {
      await pds.requestCrawl();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      alert("Error: " + String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-md rounded-box mb-4">
      <div className="card-body p-4">
        <h2 className="card-title text-base">Request Crawl</h2>
        <p className="text-sm">
          Request a relay server to crawl your repository.
        </p>
        <div className="card-actions justify-end mt-2">
          <button
            className="btn btn-primary relative"
            onClick={handleRequestCrawl}
            disabled={loading}
          >
            {loading && (
              <div className="loading loading-spinner loading-sm absolute"></div>
            )}
            {success ? (
              <span className={cn(loading && "opacity-0")}>
                <span className="i-lucide-check size-4 mr-1"></span>
                Requested
              </span>
            ) : (
              <span className={cn(loading && "opacity-0")}>
                <span className="i-lucide-refresh-cw size-4 mr-1"></span>
                Request Crawl
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
