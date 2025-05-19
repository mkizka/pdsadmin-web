import { Client, simpleFetchHandler } from "@atcute/client";

import type { Did } from "./types";

export class PDS {
  readonly #rpc;
  readonly #headers;

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
  }

  async listRepos(params?: { limit?: number; cursor?: string }) {
    const { data, ok } = await this.#rpc.get("com.atproto.sync.listRepos", {
      params: {
        limit: params?.limit,
        cursor: params?.cursor,
      },
      headers: this.#headers,
    });
    if (!ok) {
      throw new Error(data.message ?? data.error);
    }
    const repos = [];
    for (const repo of data.repos) {
      const accountInfo = await this.#getAccountInfo(repo.did);
      repos.push({ ...repo, accountInfo });
    }
    return { repos, cursor: data.cursor };
  }

  async #getAccountInfo(did: Did) {
    const { data, ok } = await this.#rpc.get(
      "com.atproto.admin.getAccountInfo",
      {
        params: {
          did,
        },
        headers: this.#headers,
      },
    );
    if (!ok) {
      throw new Error(data.message ?? data.error);
    }
    return data;
  }

  async createInviteCode() {
    const { data, ok } = await this.#rpc.post(
      "com.atproto.server.createInviteCode",
      {
        input: {
          useCount: 1,
        },
        headers: this.#headers,
      },
    );
    if (!ok) {
      throw new Error(data.message ?? data.error);
    }
    return data.code;
  }

  async resetPassword(did: Did, password: string) {
    const { data, ok } = await this.#rpc.post(
      "com.atproto.admin.updateAccountPassword",
      {
        input: {
          did,
          password,
        },
        headers: this.#headers,
        as: "blob", // jsonだとエラーになった
      },
    );
    if (!ok) {
      throw new Error(data.message ?? data.error);
    }
  }

  async takedown(did: Did, ref: string) {
    const { data, ok } = await this.#rpc.post(
      "com.atproto.admin.updateSubjectStatus",
      {
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
      },
    );
    if (!ok) {
      throw new Error(data.message ?? data.error);
    }
  }

  async untakedown(did: Did) {
    const { data, ok } = await this.#rpc.post(
      "com.atproto.admin.updateSubjectStatus",
      {
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
      },
    );
    if (!ok) {
      throw new Error(data.message ?? data.error);
    }
  }

  async deleteAccount(did: Did) {
    const { data, ok } = await this.#rpc.post(
      "com.atproto.admin.deleteAccount",
      {
        input: {
          did,
        },
        headers: this.#headers,
        as: "json",
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
