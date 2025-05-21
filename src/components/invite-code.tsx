import { useState } from "react";

import { useOpenModal } from "../atoms/modal";
import { usePDS } from "../atoms/pds";
import { cn } from "../utils/cn";

export function InviteCodeButton() {
  const pds = usePDS();
  const openModal = useOpenModal();
  const [loading, setLoading] = useState(false);

  const handleCreateInviteCode = async () => {
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
  );
}
