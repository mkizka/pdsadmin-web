import type React from "react";
import { useState } from "react";

import { cx } from "../utils/cx";
import { PDS } from "../utils/pds";
import { ErrorAlert, SuccessAlert } from "./AlertMessage";

export const InviteCodeForm: React.FC = () => {
  const [password, setPassword] = useState("");
  const [hostname, setHostname] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateInviteCode = async () => {
    setLoading(true);
    setError("");
    setInviteCode("");

    try {
      const pds = new PDS(hostname, password);
      const { ok, data } = await pds.createInviteCode();
      if (!ok) {
        throw new Error(`リクエストに失敗しました (${data.message})`);
      }
      setInviteCode(data.code);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">招待コード生成</h2>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">ホスト名</span>
          </label>
          <input
            type="text"
            placeholder="例: bsky.social"
            className="input input-bordered w-full"
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">管理者パスワード</span>
          </label>
          <input
            type="password"
            placeholder="管理者パスワードを入力"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="card-actions justify-end mt-4">
          <button
            className={cx("btn btn-primary", loading && "loading")}
            onClick={handleCreateInviteCode}
            disabled={loading || !hostname || !password}
          >
            招待コードを生成
          </button>
        </div>

        <ErrorAlert message={error} />
        <SuccessAlert inviteCode={inviteCode} />
      </div>
    </div>
  );
};
