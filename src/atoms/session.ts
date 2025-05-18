import { useAtomValue, useSetAtom } from "jotai";
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

export const useSession = () => {
  const session = useAtomValue(baseAtom);
  if (!session) {
    throw new Error("Session not found");
  }
  return session;
};

export const usePDS = () => {
  const session = useAtomValue(baseAtom);
  if (!session) {
    throw new Error("Session not found");
  }
  return useMemo(() => new PDS(session), [session]);
};
