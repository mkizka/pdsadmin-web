import { useState } from "react";

import { usePDS } from "../atoms/session";
import { cn } from "../utils/cn";

const INVITE_CODE_DIALOG_ID = "create-invite-code";

export function InviteCodeButton() {
  const pds = usePDS();
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCreateInviteCode = async () => {
    setLoading(true);
    try {
      const code = await pds.createInviteCode();
      setInviteCode(code);
      const dialog = document.getElementById(
        INVITE_CODE_DIALOG_ID,
      ) as HTMLDialogElement | null;
      dialog?.showModal();
    } catch (error) {
      alert("Error: " + String(error));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      alert("クリップボードへのコピーに失敗しました");
    }
  };

  return (
    <>
      <button
        className="btn btn-sm btn-primary relative"
        onClick={handleCreateInviteCode}
        disabled={loading}
      >
        {loading && (
          <div className="loading loading-spinner loading-sm absolute"></div>
        )}
        <span className={cn(loading && "opacity-0")}>Create Invite Code</span>
      </button>
      <dialog id={INVITE_CODE_DIALOG_ID} className="modal">
        <div className="modal-box flex flex-col gap-2">
          <div>Invite code has been created!</div>
          <div className="relative h-20 rounded-md bg-base-200">
            <div className="flex items-center justify-center h-full overflow-x-auto">
              <pre className="font-bold text-lg whitespace-pre px-4 max-w-full">
                {inviteCode}
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
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
