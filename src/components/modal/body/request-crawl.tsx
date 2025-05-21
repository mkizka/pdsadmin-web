import { type FormEvent, useState } from "react";

import { usePDS } from "../../../atoms/pds";
import { cn } from "../../../utils/cn";
import { useModalHandler } from "../hooks";

export function RequestCrawlModalBody() {
  const pds = usePDS();
  const [relayService, setRelayService] = useState("");
  const { loading, handler } = useModalHandler(() =>
    pds.requestCrawl(relayService),
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handler();
    setRelayService("");
  };

  return (
    <form className="flex flex-col gap-4 items-center" onSubmit={handleSubmit}>
      <span className="i-lucide-cloud size-12"></span>
      <p className="text-center">Enter relay address to request crawl</p>
      <label className="input">
        <input
          type="url"
          placeholder="https://bsky.network"
          required
          value={relayService}
          onChange={(e) => setRelayService(e.target.value)}
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
