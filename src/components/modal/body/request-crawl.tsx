import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { usePDS } from "../../../atoms/pds";
import { Button } from "../../button";
import { useModalHandler } from "../hooks";

export function RequestCrawlModalBody() {
  const { t } = useTranslation();
  const pds = usePDS();
  const [relayService, setRelayService] = useState("");

  const { loading, handler } = useModalHandler({
    fn: () => pds.requestCrawl(relayService),
    toastMessage: t("modal.request-crawl.toast"),
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handler();
    setRelayService("");
  };

  return (
    <form className="flex flex-col items-center gap-4" onSubmit={handleSubmit}>
      <span className="i-lucide-cloud size-12"></span>
      <p className="text-center">{t("modal.request-crawl.title")}</p>
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
        {t("modal.request-crawl.button")}
      </Button>
    </form>
  );
}
