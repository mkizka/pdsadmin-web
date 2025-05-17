import { useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { PDS } from "./pds";

type Session = {
  service: string;
  adminPassword: string;
};

const sessionAtom = atomWithStorage<Session | null>("session", null);

export const useSetSession = () => useSetAtom(sessionAtom);

export const useLogout = () => {
  const setSession = useSetSession();
  return () => setSession(null);
};

export const useIsLoggedIn = () => {
  const session = useAtomValue(sessionAtom);
  return session !== null;
};

export const usePDS = () => {
  const session = useAtomValue(sessionAtom);
  if (!session) {
    throw new Error("Session not found");
  }
  return new PDS(session);
};
