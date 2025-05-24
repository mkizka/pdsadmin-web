import { type FormEvent, useState } from "react";

import { usePDS } from "../../../atoms/pds";
import { Button } from "../../button";
import { useModalHandler } from "../hooks";

export function RequestCrawlModalBody() {
  const pds = usePDS();
  const [relayService, setRelayService] = useState("");

  const { loading, handler } = useModalHandler({
    fn: () => pds.requestCrawl(relayService),
    toastMessage: "Crawl request sent successfully",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handler();
    setRelayService("");
  };

  return (
    <form className="flex flex-col items-center gap-4" onSubmit={handleSubmit}>
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
      <Button
        type="submit"
        className="btn btn-primary relative"
        loading={loading}
        loadingClassName="loading-sm"
      >
        Request Crawl
      </Button>
    </form>
  );
}
