import { Client, simpleFetchHandler } from "@atcute/client";

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
        limit: params?.limit ?? 10,
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

  async #getAccountInfo(did: `did:${string}:${string}`) {
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
}

export type Repository = Awaited<
  ReturnType<typeof PDS.prototype.listRepos>
>["repos"][number];
