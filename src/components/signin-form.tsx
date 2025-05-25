import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { useSetSession } from "../atoms/session";
import { useToast } from "../atoms/toast";
import { PDS } from "../utils/pds";
import { ErrorAlert } from "./alert-message";
import { Button } from "./button";

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

function Code({ children }: { children: string }) {
  return (
    <code className="bg-base-200 rounded-md px-1 font-mono text-xs font-bold">
      {children}
    </code>
  );
}

export function SigninForm() {
  const { t } = useTranslation();
  const form = useForm();
  const setSession = useSetSession();
  const toast = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.setLoading(true);
    form.setError("");
    try {
      const pds = new PDS(form.state);
      await pds.listRepos();
      setSession(form.state);
      toast.success(t("signin.toast"));
    } catch (error) {
      form.setError(String(error));
    } finally {
      form.setLoading(false);
    }
  };

  return (
    <form className="card bg-base-100 shadow-xl" onSubmit={handleSubmit}>
      <div className="card-body">
        <h2 className="card-title">{t("signin.title")}</h2>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">
              {t("signin.pds-url")} (<Code>{"https://${PDS_HOSTNAME}"}</Code>)
            </span>
          </label>
          <input
            type="url"
            placeholder="https://pds.example.com"
            className="input input-bordered w-full"
            value={form.state.service}
            onChange={(e) => form.setService(e.target.value)}
            data-testid="pds-url-input"
          />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">
              {t("signin.admin-password")} (<Code>PDS_ADMIN_PASSWORD</Code>)
            </span>
          </label>
          <input
            type="password"
            className="input input-bordered w-full"
            value={form.state.adminPassword}
            onChange={(e) => form.setAdminPassword(e.target.value)}
            data-testid="admin-password-input"
          />
        </div>
        <div className="card-actions mt-4 justify-end">
          <Button
            type="submit"
            className="btn btn-primary"
            loading={form.state.loading}
            disabled={!form.canSubmit}
            data-testid="login-button"
          >
            {t("signin.button")}
          </Button>
        </div>
        {form.state.error && <ErrorAlert>{form.state.error}</ErrorAlert>}
      </div>
    </form>
  );
}
