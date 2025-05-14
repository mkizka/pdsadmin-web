import type React from "react";
import { useState } from "react";

import { ErrorAlert, SuccessAlert } from "./AlertMessage";

interface InviteCodeResponse {
  code: string;
}

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
      const response = await fetch(
        `https://${hostname}/xrpc/com.atproto.server.createInviteCode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`admin:${password}`)}`,
          },
          body: JSON.stringify({ useCount: 1 }),
        },
      );

      if (!response.ok) {
        throw new Error(`リクエストに失敗しました (${response.status})`);
      }

      const data = (await response.json()) as InviteCodeResponse;
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
            className={`btn btn-primary ${loading ? "loading" : ""}`}
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
