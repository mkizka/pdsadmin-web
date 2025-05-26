import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type Session = {
  service: string;
  adminPassword?: string;
  savePassword?: boolean;
};

const baseAtom = atomWithStorage<Session | null>("session", null, undefined, {
  getOnInit: true,
});

export const useSetSession = () => {
  const setSessionAtom = useSetAtom(baseAtom);
  return (session: Session) => {
    if (session.savePassword === false) {
      const sessionWithoutPassword = {
        service: session.service,
        savePassword: false,
      };
      setSessionAtom(sessionWithoutPassword);
    } else {
      setSessionAtom(session);
    }
  };
};

export const useLogout = () => {
  const setSessionAtom = useSetAtom(baseAtom);
  return () => setSessionAtom(null);
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

export const useSessionWithPassword = () => {
  const session = useAtomValue(baseAtom);
  if (!session) {
    throw new Error("Session not found");
  }
  if (!session.adminPassword) {
    throw new Error("Password not saved. Please log in again.");
  }
  return session;
};
