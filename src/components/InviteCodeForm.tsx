import type React from "react";
import { useState } from "react";

import { cx } from "../utils/cx";
import { PDS } from "../utils/pds";
import { ErrorAlert, SuccessAlert } from "./AlertMessage";

const initialForm = {
  service: "",
  password: "",
  loading: false,
  error: "",
};

const useForm = () => {
  const [formState, setFormState] = useState(initialForm);
  return {
    state: formState,
    canSubmit:
      !formState.loading &&
      formState.service !== "" &&
      formState.password !== "",
    resetForm: () => setFormState(initialForm),
    setService: (hostname: string) => {
      setFormState((prev) => ({ ...prev, service: hostname }));
    },
    setPassword: (password: string) => {
      setFormState((prev) => ({ ...prev, password }));
    },
    setLoading: (loading: boolean) => {
      setFormState((prev) => ({ ...prev, loading }));
    },
    setError: (error: string) => {
      setFormState((prev) => ({ ...prev, error }));
    },
  };
};

const requireHttps = (maybeHostname: string) => {
  return maybeHostname.startsWith("https://")
    ? maybeHostname
    : `https://${maybeHostname}`;
};

export const InviteCodeForm: React.FC = () => {
  const form = useForm();
  const [inviteCode, setInviteCode] = useState("");

  const handleCreateInviteCode = async () => {
    form.setLoading(true);
    form.setError("");
    const pds = new PDS({
      service: requireHttps(form.state.service),
      adminPassword: form.state.password,
    });
    try {
      const code = await pds.createInviteCode();
      setInviteCode(code);
    } catch (error) {
      form.setError(String(error));
    } finally {
      form.setLoading(false);
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
            value={form.state.service}
            onChange={(e) => form.setService(e.target.value)}
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
            value={form.state.password}
            onChange={(e) => form.setPassword(e.target.value)}
          />
        </div>
        <div className="card-actions justify-end mt-4">
          <button
            className={cx("btn btn-primary", form.state.loading && "loading")}
            onClick={handleCreateInviteCode}
            disabled={!form.canSubmit}
          >
            招待コードを生成
          </button>
        </div>
        <ErrorAlert message={form.state.error} />
        <SuccessAlert inviteCode={inviteCode} />
      </div>
    </div>
  );
};
