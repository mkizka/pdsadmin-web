import { spawn } from "node:child_process";

import { TestNetworkNoAppView } from "@atproto/dev-env";

const network = await TestNetworkNoAppView.create({
  plc: { port: 2582 },
  pds: { port: 2583, hostname: "localhost" },
});

const agent = network.pds.getAgent();
for (const name of ["alice", "bob", "carla"]) {
  await agent.createAccount({
    handle: `${name}.test`,
    email: `${name}@example.com`,
    password: "password",
  });
}

const [command, ...args] = process.argv.slice(2);
spawn(command, args, { stdio: "inherit" }).on("exit", (code) =>
  process.exit(code ?? 0),
);
