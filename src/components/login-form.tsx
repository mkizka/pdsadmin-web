import { type FormEvent, useState } from "react";

import { useSetSession } from "../atoms/session";
import { cn } from "../utils/cn";
import { PDS } from "../utils/pds";
import { ErrorAlert } from "./alert-message";

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

export function LoginForm() {
  const form = useForm();
  const setSession = useSetSession();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.setLoading(true);
    form.setError("");
    try {
      const session = {
        service: requireHttps(form.state.service),
        adminPassword: form.state.adminPassword,
      };
      const pds = new PDS(session);
      await pds.listRepos();
      setSession(session);
      form.resetForm();
    } catch (error) {
      form.setError(String(error));
    } finally {
      form.setLoading(false);
    }
  };

  return (
    <form className="card bg-base-100 shadow-xl" onSubmit={handleSubmit}>
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
            type="submit"
            className={cn("btn btn-primary", form.state.loading && "loading")}
            disabled={!form.canSubmit}
          >
            ログイン
          </button>
        </div>
        {form.state.error && <ErrorAlert>{form.state.error}</ErrorAlert>}
      </div>
    </form>
  );
}
