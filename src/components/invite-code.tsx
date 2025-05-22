import { useState } from "react";

import { useOpenModal } from "../atoms/modal";
import { usePDS } from "../atoms/pds";
import { Button } from "./button";

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
    <Button
      className="btn btn-primary relative"
      onClick={handleCreateInviteCode}
      loading={loading}
      loadingClassName="loading-sm"
      data-testid="create-invite-code-button"
    >
      Create Invite Code
    </Button>
  );
}
