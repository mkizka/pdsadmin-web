import { useState } from "react";

import { cn } from "../../../utils/cn";

type Props = {
  code: string;
};

export function InviteCodeModalBody({ code }: Props) {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      alert("クリップボードへのコピーに失敗しました");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div data-testid="invite-code-success-message">
        Invite code has been created!
      </div>
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
