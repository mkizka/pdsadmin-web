import { atom, useAtomValue, useSetAtom } from "jotai";

import { type Repository } from "../utils/pds";
import { pdsAtom } from "./pds";

export const INIT_PAGE_SIZE = 5;

const FETCH_MORE_PAGE_SIZE = 10;

const reposAtom = atom<Repository[]>([]);

const initLoadingAtom = atom(false);

const fetchMoreLoadingAtom = atom(false);

const cursorAtom = atom<string | undefined>(undefined);

const initRepositoriesAtom = atom(
  null,
  // モーダルを閉じた後全体をリロードするために、引数にlimitを持たせる
  async (get, set, limit: number = INIT_PAGE_SIZE) => {
    const pds = get(pdsAtom);
    set(initLoadingAtom, true);
    const { repos, cursor } = await pds.listRepos({ limit });
    set(reposAtom, repos);
    // limitより少ない場合は次のページがないとみなす
    set(cursorAtom, repos.length < limit ? undefined : cursor);
    set(initLoadingAtom, false);
  },
);

const fetchMoreRepositoriesAtom = atom(null, async (get, set) => {
  const pds = get(pdsAtom);
  const cursor = get(cursorAtom);
  set(fetchMoreLoadingAtom, true);
  const { repos, cursor: newCursor } = await pds.listRepos({
    limit: FETCH_MORE_PAGE_SIZE,
    cursor,
  });
  set(reposAtom, (prev) => [...prev, ...repos]);
  // limitより少ない場合は次のページがないとみなす
  set(cursorAtom, repos.length < FETCH_MORE_PAGE_SIZE ? undefined : newCursor);
  set(fetchMoreLoadingAtom, false);
});

const accountListAtom = atom((get) => {
  const repos = get(reposAtom);
  const isInitLoading = get(initLoadingAtom);
  const isFetchMoreLoading = get(fetchMoreLoadingAtom);
  const hasNextPage = get(cursorAtom) !== undefined;
  return {
    repos,
    isInitLoading,
    isFetchMoreLoading,
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

export const useReloadRepositories = () => {
  const accountList = useAccountList();
  const initRepositories = useInitRepositories();
  return () => initRepositories(accountList.repos.length);
};
