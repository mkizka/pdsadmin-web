import { Client, simpleFetchHandler } from "@atcute/client";

export class PDS {
  private readonly rpc;
  private readonly adminPassword;

  constructor({
    service,
    adminPassword,
  }: {
    service: string;
    adminPassword: string;
  }) {
    const handler = simpleFetchHandler({
      service: service,
    });
    this.rpc = new Client({ handler });
    this.adminPassword = adminPassword;
  }

  async createInviteCode() {
    const { data, ok } = await this.rpc.post(
      "com.atproto.server.createInviteCode",
      {
        input: {
          useCount: 1,
        },
        headers: {
          Authorization: `Basic ${btoa(`admin:${this.adminPassword}`)}`,
        },
      },
    );
    if (!ok) {
      throw new Error(data.message ?? data.error);
    }
    return data.code;
  }
}
