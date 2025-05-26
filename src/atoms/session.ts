import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type Session = {
  service: string;
  adminPassword: string;
};

const persistentSessionAtom = atomWithStorage<Session | null>(
  "session",
  null,
  undefined,
  {
    getOnInit: true,
  },
);

const sessionOnlyAtom = atom<Session | null>(null);

const useRememberLoginAtom = atomWithStorage<boolean>(
  "rememberLogin",
  true,
  undefined,
  {
    getOnInit: true,
  },
);

const currentSessionAtom = atom(
  (get) => {
    const useRememberLogin = get(useRememberLoginAtom);
    return useRememberLogin ? get(persistentSessionAtom) : get(sessionOnlyAtom);
  },
  (get, set, newSession: Session | null) => {
    const useRememberLogin = get(useRememberLoginAtom);
    if (useRememberLogin) {
      set(persistentSessionAtom, newSession);
      set(sessionOnlyAtom, null);
    } else {
      set(sessionOnlyAtom, newSession);
      set(persistentSessionAtom, null);
    }
  },
);

export const useSetSession = () => useSetAtom(currentSessionAtom);

export const useRememberLogin = () => useAtomValue(useRememberLoginAtom);

export const useSetRememberLogin = () => useSetAtom(useRememberLoginAtom);

export const useLogout = () => {
  const setSession = useSetSession();
  return () => setSession(null);
};

export const useIsLoggedIn = () => {
  const session = useAtomValue(currentSessionAtom);
  return session !== null;
};

export const requiredSessionAtom = atom((get) => {
  const session = get(currentSessionAtom);
  if (!session) {
    throw new Error("Session not found");
  }
  return session;
});

export const useSession = () => {
  return useAtomValue(requiredSessionAtom);
};
