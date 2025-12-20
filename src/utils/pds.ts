import { Client, simpleFetchHandler } from "@atcute/client";
import type {
  ComAtprotoAdminDeleteAccount,
  ComAtprotoAdminGetAccountInfos,
  ComAtprotoAdminUpdateAccountPassword,
  ComAtprotoAdminUpdateSubjectStatus,
  ComAtprotoServerCreateAccount,
  ComAtprotoServerCreateInviteCode,
  ComAtprotoSyncListRepos,
  ComAtprotoSyncRequestCrawl,
} from "@atcute/atproto/types";

import type { Did } from "./types";

export class PDS {
  readonly #rpc;
  readonly #headers;
  readonly #service: string;

  constructor({
    service,
    adminPassword,
  }: {
    service: string;
    adminPassword: string;
  }) {
    const handler = simpleFetchHandler({ service });
    this.#rpc = new Client({ handler });
    this.#headers = {
      Authorization: `Basic ${btoa(`admin:${adminPassword}`)}`,
    };
    this.#service = service;
  }

  async listRepos(params?: { limit?: number; cursor?: string }) {
    const { data, ok } = await this.#rpc.get<ComAtprotoSyncListRepos.Output>(
      "com.atproto.sync.listRepos",
      {
        params: {
          limit: params?.limit,
          cursor: params?.cursor,
        },
        headers: this.#headers,
      },
    );
    if (!ok) {
      throw new Error(data.message ?? data.error);
    }
    const dids = data.repos.map((repo) => repo.did);
    if (dids.length === 0) {
      return { repos: [], cursor: data.cursor };
    }
    const accountInfos = await this.#getAccountInfos(dids);
    const accountInfoMap = new Map(
      accountInfos.map((info) => [info.did, info]),
    );
    const repos = data.repos.map((repoInfo) => {
      const accountInfo = accountInfoMap.get(repoInfo.did);
      if (!accountInfo) {
        throw new Error(`Account info not found for DID: ${repoInfo.did}`);
      }
      return {
        repoInfo,
        accountInfo,
      };
    });
    return { repos, cursor: data.cursor };
  }

  async #getAccountInfos(dids: Did[]) {
    const { data, ok } = await this.#rpc.get<
      ComAtprotoAdminGetAccountInfos.Output
    >("com.atproto.admin.getAccountInfos", {
      params: {
        dids,
      },
      headers: this.#headers,
    });
    if (!ok) {
      throw new Error(data.message ?? data.error);
    }
    return data.infos;
  }

  async createInviteCode() {
    const { data, ok } = await this.#rpc.post<
      ComAtprotoServerCreateInviteCode.Output
    >("com.atproto.server.createInviteCode", {
      input: {
        useCount: 1,
      },
      headers: this.#headers,
    });
    if (!ok) {
      throw new Error(data.message ?? data.error);
    }
    return data.code;
  }

  async createAccount({
    handle,
    email,
    password,
  }: {
    handle: `${string}.${string}`;
    email: string;
    password: string;
  }) {
    const inviteCode = await this.createInviteCode();
    const { data, ok } = await this.#rpc.post<
      ComAtprotoServerCreateAccount.Output
    >("com.atproto.server.createAccount", {
      input: {
        handle,
        email,
        password,
        inviteCode,
      },
      as: "json",
    });
    if (!ok) {
      throw new Error(data.message ?? data.error);
    }
    return data.did;
  }

  async resetPassword(did: Did, password: string) {
    const { data, ok } = await this.#rpc.post<
      ComAtprotoAdminUpdateAccountPassword.Output
    >("com.atproto.admin.updateAccountPassword", {
      input: {
        did,
        password,
      },
      headers: this.#headers,
      as: "blob",
    });
    if (!ok) {
      throw new Error(data.message ?? data.error);
    }
  }

  async takedown(did: Did, ref: string) {
    const { data, ok } = await this.#rpc.post<
      ComAtprotoAdminUpdateSubjectStatus.Output
    >("com.atproto.admin.updateSubjectStatus", {
      input: {
        subject: {
          $type: "com.atproto.admin.defs#repoRef",
          did,
        },
        takedown: {
          applied: true,
          ref,
        },
      },
      headers: this.#headers,
      as: "json",
    });
    if (!ok) {
      throw new Error(data.message ?? data.error);
    }
  }

  async untakedown(did: Did) {
    const { data, ok } = await this.#rpc.post<
      ComAtprotoAdminUpdateSubjectStatus.Output
    >("com.atproto.admin.updateSubjectStatus", {
      input: {
        subject: {
          $type: "com.atproto.admin.defs#repoRef",
          did,
        },
        takedown: {
          applied: false,
        },
      },
      headers: this.#headers,
      as: "json",
    });
    if (!ok) {
      throw new Error(data.message ?? data.error);
    }
  }

  async deleteAccount(did: Did) {
    const { data, ok } = await this.#rpc.post<
      ComAtprotoAdminDeleteAccount.Output
    >("com.atproto.admin.deleteAccount", {
      input: {
        did,
      },
      headers: this.#headers,
      as: "blob",
    });
    if (!ok) {
      throw new Error(data.message ?? data.error);
    }
  }

  async requestCrawl(relayService: string) {
    const handler = simpleFetchHandler({
      service: relayService,
    });
    const rpc = new Client({ handler });
    const { data, ok } = await rpc.post<ComAtprotoSyncRequestCrawl.Output>(
      "com.atproto.sync.requestCrawl",
      {
        input: {
          hostname: new URL(this.#service).hostname,
        },
        headers: this.#headers,
        as: "blob",
      },
    );
    if (!ok) {
      throw new Error(data.message ?? data.error);
    }
  }
}

export type Repository = Awaited<
  ReturnType<typeof PDS.prototype.listRepos>
>["repos"][number];
