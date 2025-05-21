import { atom, useAtomValue } from "jotai";

import { PDS } from "../utils/pds";
import { requiredSessionAtom } from "./session";

export const pdsAtom = atom((get) => {
  const session = get(requiredSessionAtom);
  return new PDS(session);
});

const pdsHostnameAtom = atom((get) => {
  const session = get(requiredSessionAtom);
  return new URL(session.service).hostname;
});

export const usePDSHostname = () => useAtomValue(pdsHostnameAtom);

export const usePDS = () => useAtomValue(pdsAtom);
