import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod/v4";

import { useCloseModal } from "../../../atoms/modal";
import { usePDS } from "../../../atoms/pds";
import { useToast } from "../../../atoms/toast";
import { Button } from "../../ui/button";

const requestCrawlSchema = (t: (key: string) => string) =>
  z.object({
    relayService: z
      .string({ message: t("modal.request-crawl.validation.required") })
      .pipe(z.url({ message: t("modal.request-crawl.errors.url-invalid") })),
  });

export function RequestCrawlModalBody() {
  const { t } = useTranslation();
  const pds = usePDS();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const closeModal = useCloseModal();

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: requestCrawlSchema(t) });
    },
    onSubmit: async (event, { submission }) => {
      event.preventDefault();
      if (submission?.status === "success") {
        setLoading(true);
        try {
          await pds.requestCrawl(submission.value.relayService);
          closeModal();
          toast.success(t("modal.request-crawl.toast"));
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
      <span className="i-lucide-cloud size-12"></span>
      <p className="text-center">{t("modal.request-crawl.title")}</p>
      <div className="flex w-64 flex-col gap-1">
        <label className="input input-bordered flex items-center gap-2">
          <span className="i-lucide-link size-4"></span>
          <input
            {...getInputProps(fields.relayService, { type: "url" })}
            placeholder="https://bsky.network"
            className="grow"
          />
        </label>
        {fields.relayService.errors && (
          <p className="text-error text-xs">{fields.relayService.errors[0]}</p>
        )}
      </div>
      <Button
        type="submit"
        className="btn btn-primary relative"
        loading={loading}
        loadingClassName="loading-sm"
      >
        {t("modal.request-crawl.button")}
      </Button>
    </form>
  );
}
