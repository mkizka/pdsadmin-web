import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
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

const inMemorySessionAtom = atom<Session | null>(null);

const rememberLoginAtom = atomWithStorage<boolean>(
  "rememberLogin",
  true,
  undefined,
  {
    getOnInit: true,
  },
);

const currentSessionAtom = atom(
  (get) => {
    const rememberLogin = get(rememberLoginAtom);
    return rememberLogin
      ? get(persistentSessionAtom)
      : get(inMemorySessionAtom);
  },
  (get, set, newSession: Session | null) => {
    const rememberLogin = get(rememberLoginAtom);
    if (rememberLogin) {
      set(persistentSessionAtom, newSession);
      set(inMemorySessionAtom, null);
    } else {
      set(inMemorySessionAtom, newSession);
      set(persistentSessionAtom, null);
    }
  },
);

export const useSetSession = () => useSetAtom(currentSessionAtom);

export const useRememberLogin = () => useAtom(rememberLoginAtom);

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
