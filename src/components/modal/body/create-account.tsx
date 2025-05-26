import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod/v4";

import { useReloadRepositories } from "../../../atoms/account-list";
import { useCloseModal } from "../../../atoms/modal";
import { usePDS, usePDSHostname } from "../../../atoms/pds";
import { useToast } from "../../../atoms/toast";
import { Button } from "../../button";

const createSchema = (t: (key: string) => string, hostname: string) =>
  z.object({
    handle: z
      .string({ message: t("modal.create-account.validation.required") })
      .min(1, t("modal.create-account.errors.handle-required"))
      .refine((value) => value.includes("."), {
        message: t("modal.create-account.errors.handle-no-dot"),
      })
      .refine((value) => value.endsWith(`.${hostname}`), {
        message: t("modal.create-account.errors.handle-wrong-domain").replace(
          "{{hostname}}",
          hostname,
        ),
      }),
    email: z.email({ message: t("modal.create-account.errors.email-invalid") }),
    password: z
      .string({ message: t("modal.create-account.validation.required") })
      .min(1, t("modal.create-account.errors.password-required")),
  });

export function CreateAccountModalBody() {
  const { t } = useTranslation();
  const pds = usePDS();
  const pdsHostname = usePDSHostname();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const closeModal = useCloseModal();
  const reloadRepos = useReloadRepositories();

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createSchema(t, pdsHostname) });
    },
    onSubmit: async (event, { submission }) => {
      event.preventDefault();
      if (submission?.status === "success") {
        setLoading(true);
        try {
          await pds.createAccount({
            handle: submission.value.handle as `${string}.${string}`,
            email: submission.value.email,
            password: submission.value.password,
          });
          closeModal();
          toast.success(t("modal.create-account.toast"));
          await reloadRepos();
          form.reset();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
          alert("Error: " + String(error));
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
      className="flex flex-col items-center justify-center gap-4"
      data-testid="create-account-form"
    >
      <span className="i-lucide-user-plus size-12"></span>
      <p className="text-center">{t("modal.create-account.title")}</p>
      <div className="flex w-64 flex-col items-center gap-1">
        <label className="input input-bordered flex items-center gap-2">
          <span className="i-lucide-at-sign size-4"></span>
          <input
            {...getInputProps(fields.handle, { type: "text" })}
            placeholder={`example.${pdsHostname}`}
            autoComplete="username"
            className="grow"
            data-testid="create-account-handle-input"
          />
        </label>
        {fields.handle.errors && (
          <p className="text-error self-start text-xs">
            {fields.handle.errors[0]}
          </p>
        )}
      </div>
      <div className="flex w-64 flex-col gap-1">
        <label className="input input-bordered flex items-center gap-2">
          <span className="i-lucide-mail size-4"></span>
          <input
            {...getInputProps(fields.email, { type: "email" })}
            placeholder={t("modal.create-account.placeholder.email")}
            autoComplete="email"
            className="grow"
            data-testid="create-account-email-input"
          />
        </label>
        {fields.email.errors && (
          <p className="text-error text-xs">{fields.email.errors[0]}</p>
        )}
      </div>
      <div className="flex w-64 flex-col gap-1">
        <label className="input input-bordered flex items-center gap-2">
          <span className="i-lucide-lock size-4"></span>
          <input
            {...getInputProps(fields.password, { type: "password" })}
            placeholder={t("modal.create-account.placeholder.password")}
            autoComplete="new-password"
            className="grow"
            data-testid="create-account-password-input"
          />
        </label>
        {fields.password.errors && (
          <p className="text-error self-start text-xs">
            {fields.password.errors[0]}
          </p>
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
