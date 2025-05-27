import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod/v4";

import { useReloadRepositories } from "../../../atoms/account-list";
import { useCloseModal } from "../../../atoms/modal";
import { usePDS } from "../../../atoms/pds";
import { useToast } from "../../../atoms/toast";
import type { Did } from "../../../utils/types";
import { Button } from "../../ui/button";

const resetPasswordSchema = (t: (key: string) => string) =>
  z.object({
    newPassword: z
      .string({ message: t("modal.reset-password.validation.required") })
      .min(1, t("modal.reset-password.errors.password-required")),
  });

type Props = {
  did: Did;
};

export function ResetPasswordModalBody({ did }: Props) {
  const { t } = useTranslation();
  const pds = usePDS();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const closeModal = useCloseModal();
  const reloadRepos = useReloadRepositories();

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: resetPasswordSchema(t) });
    },
    onSubmit: async (event, { submission }) => {
      event.preventDefault();
      if (submission?.status === "success") {
        setLoading(true);
        try {
          await pds.resetPassword(did, submission.value.newPassword);
          closeModal();
          toast.success(t("modal.resetPassword.toast"));
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
    <form {...getFormProps(form)} className="flex flex-col items-center gap-4">
      <span className="i-lucide-key-round size-12"></span>
      <p className="text-center">{t("modal.reset-password.message")}</p>
      <div className="flex w-64 flex-col gap-1">
        <label className="input input-bordered flex items-center gap-2">
          <span className="i-lucide-lock size-4"></span>
          <input
            {...getInputProps(fields.newPassword, { type: "password" })}
            placeholder={t("modal.reset-password.placeholder.password")}
            autoComplete="new-password"
            className="grow"
          />
        </label>
        {fields.newPassword.errors && (
          <p className="text-error text-xs">{fields.newPassword.errors[0]}</p>
        )}
      </div>
      <Button
        type="submit"
        className="btn btn-primary relative"
        loading={loading}
        loadingClassName="loading-sm"
      >
        {t("modal.reset-password.button")}
      </Button>
    </form>
  );
}
