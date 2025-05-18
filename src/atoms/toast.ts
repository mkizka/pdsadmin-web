import { atom, useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";

type Toast = {
  id: string;
  message: string;
  level: "success" | "error";
  removing?: boolean;
};

const baseAtom = atom<Toast[]>([]);

const MAX_TOAST_COUNT = 3;
const REMOVE_DELAY = 3000;

const pushToastAtom = atom(
  null,
  (_, set, message: string, level: Toast["level"]) => {
    const newToast = { message, level, id: crypto.randomUUID() };
    set(baseAtom, (prev) => [...prev, newToast].slice(-MAX_TOAST_COUNT));

    setTimeout(() => {
      set(baseAtom, (prev) => prev.filter((item) => item.id !== newToast.id));
    }, REMOVE_DELAY);
  },
);

export const useToasts = () => useAtomValue(baseAtom);

export const useToast = () => {
  const toast = useSetAtom(pushToastAtom);
  return useMemo(
    () => ({
      success: (message: string) => toast(message, "success"),
      error: (message: string) => toast(message, "error"),
    }),
    [toast],
  );
};
