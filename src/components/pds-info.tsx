import type { MouseEvent } from "react";
import { useState } from "react";

import { useOpenModal } from "../atoms/modal";
import { usePDS, usePDSHostname } from "../atoms/pds";
import { cn } from "../utils/cn";

function RequestCrawlButton() {
  const openModal = useOpenModal();

  return (
    <div
      role="button"
      className="h-12 btn btn-ghost"
      onClick={(e) => {
        e.stopPropagation();
        openModal({ type: "request-crawl" });
      }}
    >
      <span className="i-lucide-cloud size-4"></span>
      Request Crawl
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
      role="button"
      className="h-12 btn btn-ghost relative"
      onClick={handleCreateInviteCode}
      style={{ pointerEvents: loading ? "none" : "auto" }}
      data-testid="create-invite-code-button"
    >
      {loading && (
        <div className="loading loading-spinner loading-sm absolute"></div>
      )}
      <span className="i-lucide-user-plus size-4"></span>
      <span className={cn(loading && "opacity-0")}>Create Invite Code</span>
    </div>
  );
}

function LogoutButton() {
  const openModal = useOpenModal();

  const handleLogout = (e: MouseEvent) => {
    e.stopPropagation();
    openModal({ type: "logout" });
  };

  return (
    <div
      role="button"
      className="h-12 btn btn-ghost text-error"
      onClick={handleLogout}
    >
      <span className="i-lucide-log-out size-4"></span>
      ログアウト
    </div>
  );
}

function PDSActionsDropdown() {
  const preventClickPropagation = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="dropdown dropdown-end" onClick={preventClickPropagation}>
      <div
        tabIndex={0}
        role="button"
        className="btn btn-circle btn-ghost size-8"
        data-testid="pds-actions-dropdown"
      >
        <span className="i-lucide-more-horizontal size-6"></span>
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content bg-base-100 rounded-box w-48 shadow-md"
        onClick={preventClickPropagation}
      >
        <li>
          <RequestCrawlButton />
        </li>
        <li>
          <CreateInviteCodeButton />
        </li>
        <li>
          <LogoutButton />
        </li>
      </ul>
    </div>
  );
}

export function PDSInfo() {
  const pdsHostname = usePDSHostname();
  return (
    <div className="card shadow-md rounded-box mb-4">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">
            PDS:<span className="ml-2">{pdsHostname}</span>
          </div>
          <PDSActionsDropdown />
        </div>
      </div>
    </div>
  );
}
