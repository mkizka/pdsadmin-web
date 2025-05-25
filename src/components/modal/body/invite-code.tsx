import { useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "../../../utils/cn";

type Props = {
  code: string;
};

export function InviteCodeModalBody({ code }: Props) {
  const { t } = useTranslation();
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      alert(t("modal.invite-code.clipboard-error"));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-center" data-testid="invite-code-success-message">
        {t("modal.invite-code.message")}
      </p>
      <div className="bg-base-200 relative h-20 rounded-md">
        <div className="flex h-full items-center justify-center overflow-x-auto">
          <pre
            className="max-w-full px-4 text-lg font-bold whitespace-pre"
            data-testid="invite-code-text"
          >
            {code}
          </pre>
        </div>
        <button
          className="btn btn-square absolute top-0 right-4 bottom-0 my-auto"
          onClick={copyToClipboard}
        >
          <span
            className={cn(
              copySuccess ? "i-lucide-check" : "i-lucide-clipboard",
              "size-5",
            )}
          ></span>
        </button>
      </div>
    </div>
  );
}
