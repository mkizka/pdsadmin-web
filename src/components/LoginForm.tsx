import type React from "react";
import { useState } from "react";

import { cx } from "../utils/cx";
import { PDS } from "../utils/pds";
import { useSetSession } from "../utils/session";
import { ErrorAlert } from "./AlertMessage";

const initialForm = {
  service: "",
  adminPassword: "",
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
      formState.adminPassword !== "",
    resetForm: () => setFormState(initialForm),
    setService: (service: string) => {
      setFormState((prev) => ({ ...prev, service }));
    },
    setAdminPassword: (adminPassword: string) => {
      setFormState((prev) => ({ ...prev, adminPassword }));
    },
    setLoading: (loading: boolean) => {
      setFormState((prev) => ({ ...prev, loading }));
    },
    setError: (error: string) => {
      setFormState((prev) => ({ ...prev, error }));
    },
  };
};

const requireHttps = (maybeUrl: string) => {
  return maybeUrl.startsWith("https://") ? maybeUrl : `https://${maybeUrl}`;
};

interface LoginSuccessAlertProps {
  isSuccess: boolean;
}

const LoginSuccessAlert: React.FC<LoginSuccessAlertProps> = ({ isSuccess }) => {
  if (!isSuccess) return null;

  return (
    <div className="alert alert-success mt-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>ログインに成功しました！</span>
    </div>
  );
};

export const LoginForm: React.FC = () => {
  const form = useForm();
  const setSession = useSetSession();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async () => {
    form.setLoading(true);
    form.setError("");
    setIsSuccess(false);

    try {
      const session = {
        service: requireHttps(form.state.service),
        adminPassword: form.state.adminPassword,
      };
      const pds = new PDS(session);
      await pds.getAccounts();
      setSession(session);
      setIsSuccess(true);
      form.resetForm();
    } catch (error) {
      form.setError(String(error));
      setIsSuccess(false);
    } finally {
      form.setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">管理者ログイン</h2>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">PDS URL</span>
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
            value={form.state.adminPassword}
            onChange={(e) => form.setAdminPassword(e.target.value)}
          />
        </div>
        <div className="card-actions justify-end mt-4">
          <button
            className={cx("btn btn-primary", form.state.loading && "loading")}
            onClick={handleLogin}
            disabled={!form.canSubmit}
          >
            ログイン
          </button>
        </div>
        <ErrorAlert message={form.state.error} />
        <LoginSuccessAlert isSuccess={isSuccess} />
      </div>
    </div>
  );
};
