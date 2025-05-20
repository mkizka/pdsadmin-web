import { atom, useAtomValue } from "jotai";

import { PDS } from "../utils/pds";
import { requiredSessionAtom } from "./session";

export const pdsAtom = atom((get) => {
  const session = get(requiredSessionAtom);
  return new PDS(session);
});

export const usePDS = () => {
  return useAtomValue(pdsAtom);
};
