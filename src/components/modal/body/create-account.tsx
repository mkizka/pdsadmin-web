import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { usePDS, usePDSHostname } from "../../../atoms/pds";
import { Button } from "../../button";
import { useModalHandler } from "../hooks";

const createAccountSchema = z.object({
  handle: z.string().min(1, "Handle is required").includes(".", "Handle must contain a dot"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export function CreateAccountModalBody() {
  const { t } = useTranslation();
  const pds = usePDS();
  const pdsHostname = usePDSHostname();

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createAccountSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const { loading, handler } = useModalHandler({
    fn: () =>
      pds.createAccount({
        handle: fields.handle.value as `${string}.${string}`,
        email: fields.email.value!,
        password: fields.password.value!,
      }),
    toastMessage: t("modal.create-account.toast"),
    shouldReloadRepos: true,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const submission = parseWithZod(formData, { schema: createAccountSchema });
    
    if (submission.status === "success") {
      await handler();
      form.reset();
    }
  };

  return (
    <form
      className="flex flex-col items-center gap-4"
      onSubmit={handleSubmit}
      data-testid="create-account-form"
      {...form.props}
    >
      <span className="i-lucide-user-plus size-12"></span>
      <p className="text-center">{t("modal.create-account.title")}</p>
      <div className="flex flex-col gap-1">
        <label className="input input-bordered flex items-center gap-2">
          <span className="i-lucide-at-sign size-4"></span>
          <input
            type="text"
            placeholder={`example.${pdsHostname}`}
            autoComplete="username"
            className="grow"
            data-testid="create-account-handle-input"
            {...fields.handle.props}
          />
        </label>
        {fields.handle.errors && (
          <div className="text-sm text-error">
            {fields.handle.errors.join(", ")}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label className="input input-bordered flex items-center gap-2">
          <span className="i-lucide-mail size-4"></span>
          <input
            type="email"
            placeholder={t("modal.create-account.placeholder.email")}
            autoComplete="email"
            className="grow"
            data-testid="create-account-email-input"
            {...fields.email.props}
          />
        </label>
        {fields.email.errors && (
          <div className="text-sm text-error">
            {fields.email.errors.join(", ")}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label className="input input-bordered flex items-center gap-2">
          <span className="i-lucide-lock size-4"></span>
          <input
            type="password"
            placeholder={t("modal.create-account.placeholder.password")}
            autoComplete="new-password"
            className="grow"
            data-testid="create-account-password-input"
            {...fields.password.props}
          />
        </label>
        {fields.password.errors && (
          <div className="text-sm text-error">
            {fields.password.errors.join(", ")}
          </div>
        )}
      </div>
      <Button
        type="submit"
        className="btn btn-primary relative"
        loading={loading}
        loadingClassName="loading-sm"
        data-testid="create-account-submit-button"
      >
        {t("modal.create-account.button")}
      </Button>
    </form>
  );
}
