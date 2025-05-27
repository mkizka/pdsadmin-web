import type { MouseEvent } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useOpenModal } from "../../atoms/modal";
import { usePDS, usePDSHostname } from "../../atoms/pds";
import { cn } from "../../utils/cn";

type PDSButtonProps = {
  type: "request-crawl" | "logout" | "create-account";
  iconClassName: string;
  children: string;
};

function PDSButton({ type, iconClassName, children }: PDSButtonProps) {
  const openModal = useOpenModal();
  return (
    <button
      className="btn btn-ghost h-12 shadow"
      onClick={() => openModal({ type })}
      data-testid={`${type}-button`}
    >
      <span className={cn("size-4", iconClassName)}></span>
      <span className="truncate">{children}</span>
    </button>
  );
}

function CreateInviteCodeButton() {
  const pds = usePDS();
  const openModal = useOpenModal();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleCreateInviteCode = async (e: MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const code = await pds.createInviteCode();
      openModal({ type: "invite-code", code });
    } catch (error) {
      alert(t("pds-info.alerts.error", { message: String(error) }));
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
      <span className={cn("truncate", loading && "opacity-0")}>
        {t("pds-info.buttons.create-invite-code")}
      </span>
    </div>
  );
}

export function PDSInfo() {
  const pdsHostname = usePDSHostname();
  const { t } = useTranslation();

  return (
    <div className="card rounded-box bg-base-100 p-2 shadow-md">
      <div className="flex justify-center py-4">
        PDS:
        <span className="ml-2 font-bold">{pdsHostname}</span>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-2">
        <PDSButton type="create-account" iconClassName="i-lucide-user-plus">
          {t("pds-info.buttons.create-account")}
        </PDSButton>
        <CreateInviteCodeButton />
        <PDSButton type="request-crawl" iconClassName="i-lucide-refresh-cw">
          {t("pds-info.buttons.request-crawl")}
        </PDSButton>
        <PDSButton type="logout" iconClassName="i-lucide-log-out">
          {t("pds-info.buttons.sign-out")}
        </PDSButton>
      </div>
    </div>
  );
}
