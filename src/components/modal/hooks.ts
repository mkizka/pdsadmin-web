import { useState } from "react";

import { useReloadRepositories } from "../../atoms/account-list";
import { modal } from "../../atoms/modal";

export const useModalHandler = (fn: () => Promise<void> | void) => {
  const [loading, setLoading] = useState(false);
  const reloadRepos = useReloadRepositories();
  const handler = async () => {
    setLoading(true);
    try {
      await fn();
      modal.close();
      await reloadRepos();
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
