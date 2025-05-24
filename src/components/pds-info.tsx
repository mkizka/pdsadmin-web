import type { MouseEvent } from "react";
import { useState } from "react";

import { useOpenModal } from "../atoms/modal";
import { usePDS, usePDSHostname } from "../atoms/pds";
import { cn } from "../utils/cn";

type PDSButtonProps = {
  type: "request-crawl" | "logout" | "create-account";
  iconClassName: string;
  children: string;
};

function PDSButton({ type, iconClassName, children }: PDSButtonProps) {
  const openModal = useOpenModal();
  return (
    <div
      role="button"
      className={"btn btn-ghost h-12 shadow"}
      onClick={() => openModal({ type })}
      data-testid={
        type === "create-account" ? "create-account-button" : undefined
      }
    >
      <span className={cn("size-4", iconClassName)}></span>
      {children}
    </div>
  );
}

function CreateInviteCodeButton() {
  const pds = usePDS();
  const openModal = useOpenModal();
  const [loading, setLoading] = useState(false);

  const handleCreateInviteCode = async (e: MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const code = await pds.createInviteCode();
      openModal({ type: "invite-code", code });
    } catch (error) {
      alert("Error: " + String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      // button要素を使うとドロップダウンが閉じてしまうのでdivを使う
      role="button"
      className={cn("btn btn-ghost h-12 shadow", {
        "pointer-events-none": loading,
        "pointer-events-auto": !loading,
      })}
      onClick={handleCreateInviteCode}
      data-testid="create-invite-code-button"
    >
      {loading && (
        <div className="loading loading-spinner loading-sm absolute"></div>
      )}
      <span className="i-lucide-ticket size-4"></span>
      <span className={cn(loading && "opacity-0")}>Create Invite Code</span>
    </div>
  );
}

export function PDSInfo() {
  const pdsHostname = usePDSHostname();
  return (
    <div className="card rounded-box bg-base-100 shadow-md">
      <div className="card-body items-center gap-4 text-center">
        <h1 className="card-title text-2xl font-bold">pdsadmin-web</h1>
        <div className="badge badge-neutral">{pdsHostname}</div>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-2 px-2 pb-2">
        <PDSButton type="create-account" iconClassName="i-lucide-user-plus">
          Create Account
        </PDSButton>
        <CreateInviteCodeButton />
        <PDSButton type="request-crawl" iconClassName="i-lucide-refresh-cw">
          Request Crawl
        </PDSButton>
        <PDSButton type="logout" iconClassName="i-lucide-log-out">
          Sign Out
        </PDSButton>
      </div>
    </div>
  );
}
