import { type FormEvent, useState } from "react";

import { useSetSession } from "../atoms/session";
import { useToast } from "../atoms/toast";
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
    <code className="font-mono text-xs bg-base-200 rounded-md px-1 font-bold">
      {children}
    </code>
  );
}

export function SigninForm() {
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
      toast.success("Sign in successfully");
    } catch (error) {
      form.setError(String(error));
    } finally {
      form.setLoading(false);
    }
  };

  return (
    <form className="card bg-base-100 shadow-xl" onSubmit={handleSubmit}>
      <div className="card-body">
        <h2 className="card-title">Sign in to PDS</h2>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">
              PDS URL (<Code>{"https://${PDS_HOSTNAME}"}</Code>)
            </span>
          </label>
          <input
            type="url"
            placeholder="https://pds.example.com"
            className="input input-bordered w-full"
            value={form.state.service}
            onChange={(e) => form.setService(e.target.value)}
          />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">
              Admin Password (<Code>PDS_ADMIN_PASSWORD</Code>)
            </span>
          </label>
          <input
            type="password"
            placeholder="Enter Admin Password"
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
            Sign In
          </button>
        </div>
        {form.state.error && <ErrorAlert>{form.state.error}</ErrorAlert>}
      </div>
    </form>
  );
}
