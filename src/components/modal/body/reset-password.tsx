import { type FormEvent, useState } from "react";

import { usePDS } from "../../../atoms/pds";
import { cn } from "../../../utils/cn";
import type { Did } from "../../../utils/types";
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
    <form className="flex flex-col gap-4 items-center" onSubmit={handleSubmit}>
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
      <button
        type="submit"
        className="btn btn-primary relative"
        disabled={loading}
      >
        {loading && (
          <div className="loading loading-spinner loading-sm absolute"></div>
        )}
        <span className={cn(loading && "opacity-0")}>Reset Password</span>
      </button>
    </form>
  );
}
