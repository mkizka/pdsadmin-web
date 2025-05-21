import { type FormEvent, useState } from "react";

import { usePDS } from "../../../atoms/pds";
import { cn } from "../../../utils/cn";
import { useModalHandler } from "../hooks";

export function RequestCrawlModalBody() {
  const pds = usePDS();
  const [hostname, setHostname] = useState("");
  const { loading, handler } = useModalHandler(() =>
    pds.requestCrawl(hostname),
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handler();
    setHostname("");
  };

  return (
    <form className="flex flex-col gap-4 items-center" onSubmit={handleSubmit}>
      <span className="i-lucide-refresh-cw size-12"></span>
      <p className="text-center">Enter relay address to request crawl</p>
      <label className="input">
        <input
          type="text"
          placeholder="https://bsky.network"
          required
          value={hostname}
          onChange={(e) => setHostname(e.target.value)}
        />
      </label>
      <button
        type="submit"
        className="btn btn-primary relative"
        disabled={loading}
      >
        {loading && (
          <div className="loading loading-spinner loading-sm absolute"></div>
        )}
        <span className={cn(loading && "opacity-0")}>Request Crawl</span>
      </button>
    </form>
  );
}
