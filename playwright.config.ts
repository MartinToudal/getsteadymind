import { defineConfig } from "@playwright/test";
import { loadLocalEnv } from "./tests/e2e/support/env";

loadLocalEnv();

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3002",
    trace: "on-first-retry",
  },
  globalSetup: "./tests/e2e/global.setup.ts",
  webServer: {
    command: 'bash -lc \'export PATH="$HOME/.local/bin:$PATH" && npm run dev -- --hostname 127.0.0.1 --port 3002\'',
    url: "http://127.0.0.1:3002/login",
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});
