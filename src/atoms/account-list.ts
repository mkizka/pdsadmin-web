import { atom, useAtomValue, useSetAtom } from "jotai";

import { PDS, type Repository } from "../utils/pds";
import { requiredSessionAtom } from "./session";

export const INIT_PAGE_SIZE = 3;

const FETCH_MORE_PAGE_SIZE = 10;

const reposAtom = atom<Repository[]>([]);

const initLoadingAtom = atom(false);

const fetchMoreLoadingAtom = atom(false);

const cursorAtom = atom<string | undefined>(undefined);

const initRepositoriesAtom = atom(
  null,
  async (get, set, limit: number = INIT_PAGE_SIZE) => {
    const session = get(requiredSessionAtom);
    const pds = new PDS(session);
    set(initLoadingAtom, true);
    const { repos, cursor } = await pds.listRepos({ limit });
    set(reposAtom, repos);
    set(cursorAtom, cursor);
    set(initLoadingAtom, false);
  },
);

const fetchMoreRepositoriesAtom = atom(null, async (get, set) => {
  const session = get(requiredSessionAtom);
  const pds = new PDS(session);
  const cursor = get(cursorAtom);
  set(fetchMoreLoadingAtom, true);
  const { repos, cursor: newCursor } = await pds.listRepos({
    limit: FETCH_MORE_PAGE_SIZE,
    cursor,
  });
  set(reposAtom, (prev) => [...prev, ...repos]);
  set(cursorAtom, newCursor);
  set(fetchMoreLoadingAtom, false);
});

const accountListAtom = atom((get) => {
  const repos = get(reposAtom);
  const initLoading = get(initLoadingAtom);
  const fetchMoreLoading = get(fetchMoreLoadingAtom);
  const hasNextPage = get(cursorAtom) !== undefined;
  return {
    repos,
    initLoading,
    fetchMoreLoading,
    hasNextPage,
  };
});

export const useAccountList = () => {
  return useAtomValue(accountListAtom);
};

export const useInitRepositories = () => {
  return useSetAtom(initRepositoriesAtom);
};

export const useFetchMoreRepositories = () => {
  return useSetAtom(fetchMoreRepositoriesAtom);
};
