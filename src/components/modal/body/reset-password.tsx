import { type FormEvent, useState } from "react";

import { usePDS } from "../../../atoms/pds";
import type { Did } from "../../../utils/types";
import { Button } from "../../button";
import { useModalHandler } from "../hooks";

type Props = {
  did: Did;
};

export function ResetPasswordModalBody({ did }: Props) {
  const pds = usePDS();
  const [newPassword, setNewPassword] = useState("");

  const { loading, handler } = useModalHandler({
    fn: () => pds.resetPassword(did, newPassword),
    toastMessage: "Password reset successfully",
    shouldReloadRepos: true,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handler();
    setNewPassword("");
  };

  return (
    <form className="flex flex-col items-center gap-4" onSubmit={handleSubmit}>
      <span className="i-lucide-key-round size-12"></span>
      <p className="text-center">Enter new password</p>
      <label className="input">
        <input
          type="password"
          placeholder="New Password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </label>
      <Button
        type="submit"
        className="btn btn-primary relative"
        loading={loading}
        loadingClassName="loading-sm"
      >
        Reset Password
      </Button>
    </form>
  );
}
