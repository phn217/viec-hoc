import { defineConfig, devices } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

// Nạp .env.local (có TEST_EMAIL_A, TEST_PASSWORD_A, ...) cho các bài test.
loadEnvConfig(process.cwd());

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://localhost:3000", trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});