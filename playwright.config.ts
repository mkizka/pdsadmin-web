import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  timeout: 10000,
  reporter: [
    ["list", { printSteps: true }],
    ["html", { open: "never" }],
  ],
  use: {
    baseURL: "http://localhost:5173",
    video: "on",
    trace: "on",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm preview",
    port: 5173,
    stdout: "pipe",
    reuseExistingServer: !process.env.CI,
  },
});
