import type React from "react";
import { useState } from "react";

import { cx } from "../utils/cx";
import { usePDS } from "../utils/session";
import { ErrorAlert, SuccessAlert } from "./AlertMessage";

export const InviteCodeForm: React.FC = () => {
  const pds = usePDS();
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateInviteCode = async () => {
    setLoading(true);
    setError("");
    try {
      const code = await pds.createInviteCode();
      setInviteCode(code);
    } catch (error) {
      setError(String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">招待コード生成</h2>
        <div className="card-actions justify-end mt-4">
          <button
            className={cx("btn btn-primary", loading && "loading")}
            onClick={handleCreateInviteCode}
            disabled={loading}
          >
            招待コードを生成
          </button>
        </div>
        {error && <ErrorAlert>{error}</ErrorAlert>}
        {inviteCode && (
          <SuccessAlert>
            <div>
              <div className="text-sm">招待コード：</div>
              <code className="text-lg font-bold">{inviteCode}</code>
            </div>
          </SuccessAlert>
        )}
      </div>
    </div>
  );
};
