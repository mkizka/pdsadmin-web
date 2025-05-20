import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useMemo } from "react";

import { PDS } from "../utils/pds";

type Session = {
  service: string;
  adminPassword: string;
};

const baseAtom = atomWithStorage<Session | null>("session", null, undefined, {
  getOnInit: true,
});

export const useSetSession = () => useSetAtom(baseAtom);

export const useLogout = () => {
  const setSession = useSetSession();
  return () => setSession(null);
};

export const useIsLoggedIn = () => {
  const session = useAtomValue(baseAtom);
  return session !== null;
};

export const requiredSessionAtom = atom((get) => {
  const session = get(baseAtom);
  if (!session) {
    throw new Error("Session not found");
  }
  return session;
});

export const useSession = () => {
  return useAtomValue(requiredSessionAtom);
};

export const usePDS = () => {
  const session = useAtomValue(requiredSessionAtom);
  return useMemo(() => new PDS(session), [session]);
};
