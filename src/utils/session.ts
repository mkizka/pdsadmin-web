import { useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { PDS } from "./pds";

type Session = {
  pdsUrl: string;
  adminPassword: string;
};

const sessionAtom = atomWithStorage<Session | null>("session", null);

export const useSetSession = () => useSetAtom(sessionAtom);

export const usePDS = () => {
  const session = useAtomValue(sessionAtom);
  if (!session) {
    throw new Error("Session not found");
  }
  return new PDS({
    service: session.pdsUrl,
    adminPassword: session.adminPassword,
  });
};
