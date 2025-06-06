import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod/v4";

import { useRememberLogin, useSetSession } from "../../atoms/session";
import { useToast } from "../../atoms/toast";
import { PDS } from "../../utils/pds";
import { Button } from "../ui/button";

const createSchema = (t: (key: string) => string) =>
  z.object({
    service: z
      .string({ message: t("validation.required") })
      .refine(
        (url) => url.startsWith("http://") || url.startsWith("https://"),
        { message: t("signin.errors.service-protocol") },
      )
      .pipe(z.url({ message: t("signin.errors.service-invalid") })),
    adminPassword: z.string({ message: t("validation.required") }),
  });

function Code({ children }: { children: string }) {
  return (
    <code className="bg-base-200 rounded-md px-1 font-mono text-xs font-bold">
      {children}
    </code>
  );
}

export function SigninForm() {
  const { t } = useTranslation();
  const setSession = useSetSession();
  const toast = useToast();
  const [rememberLogin, setRememberLogin] = useRememberLogin();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createSchema(t) });
    },
    onSubmit: async (event, { submission }) => {
      event.preventDefault();
      if (submission?.status === "success") {
        setLoading(true);
        setSubmitError("");
        try {
          const pds = new PDS({
            service: submission.value.service,
            adminPassword: submission.value.adminPassword,
          });
          await pds.listRepos();
          setSession({
            service: submission.value.service,
            adminPassword: submission.value.adminPassword,
          });
          toast.success(t("signin.toast"));
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
          setSubmitError(t("signin.errors.login-failed"));
        } finally {
          setLoading(false);
        }
      }
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onBlur",
  });

  return (
    <form
      {...getFormProps(form)}
      className="card bg-base-100 shadow-md"
      data-testid="signin-form"
    >
      <div className="card-body">
        <h2 className="card-title">{t("signin.title")}</h2>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">{t("signin.pds-url")}</legend>
          <input
            {...getInputProps(fields.service, { type: "text" })}
            className="input input-bordered w-full"
            data-testid="pds-url-input"
            autoComplete="username"
          />
          <p className="label">
            <Code>{"https://${PDS_HOSTNAME}"}</Code>
          </p>
          {fields.service.errors && (
            <p className="label text-error">{fields.service.errors[0]}</p>
          )}
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">
            {t("signin.admin-password")}
          </legend>
          <input
            {...getInputProps(fields.adminPassword, { type: "password" })}
            className="input input-bordered w-full"
            data-testid="admin-password-input"
            autoComplete="current-password"
          />
          <p className="label">
            <Code>{"${PDS_ADMIN_PASSWORD}"}</Code>
          </p>
          {fields.adminPassword.errors && (
            <p className="label text-error">{fields.adminPassword.errors[0]}</p>
          )}
        </fieldset>
        <fieldset className="fieldset">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              className="checkbox"
              checked={rememberLogin}
              onChange={(e) => setRememberLogin(e.target.checked)}
              data-testid="remember-login-checkbox"
            />
            <span>{t("signin.remember-login")}</span>
          </label>
        </fieldset>
        <div className="card-actions justify-end">
          <Button
            type="submit"
            className="btn btn-primary"
            loading={loading}
            data-testid="login-button"
          >
            {t("signin.button")}
          </Button>
        </div>
        {submitError && (
          <div className="alert alert-error mt-4" data-testid="signin-error">
            <span>{submitError}</span>
          </div>
        )}
      </div>
    </form>
  );
}
