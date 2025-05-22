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
      <div className="relative h-20 rounded-md bg-base-200">
        <div className="flex items-center justify-center h-full overflow-x-auto">
          <pre
            className="font-bold text-lg whitespace-pre px-4 max-w-full"
            data-testid="invite-code-text"
          >
            {code}
          </pre>
        </div>
        <button
          className="btn btn-square absolute right-4 bottom-0 top-0 my-auto"
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
