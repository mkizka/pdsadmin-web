import { useState } from "react";

import { useReloadRepositories } from "../../atoms/account-list";
import { useCloseModal } from "../../atoms/modal";
import { useToast } from "../../atoms/toast";

export const useModalHandler = (args: {
  fn: () => Promise<void> | void;
  toastMessage?: string;
  shouldReloadRepos?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const closeModal = useCloseModal();
  const reloadRepos = useReloadRepositories();

  const handler = async () => {
    setLoading(true);
    try {
      await args.fn();
      closeModal();
      if (args.toastMessage) toast.success(args.toastMessage);
      if (args.shouldReloadRepos) await reloadRepos();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      alert("Error: " + String(error));
    } finally {
      setLoading(false);
    }
  };

  return { loading, handler };
};
