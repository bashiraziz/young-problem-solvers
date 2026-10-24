import { defineConfig, devices } from "@playwright/test";
import { E2E_PASSWORD, E2E_SECRET } from "./tests/e2e/constants";

const STORAGE_STATE = "test-results/.auth/state.json";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: "http://localhost:3217", trace: "on-first-retry" },
  webServer: {
    command: "npm run build && npx next start -p 3217",
    url: "http://localhost:3217/login",
    reuseExistingServer: false,
    timeout: 180_000,
    env: { YPS_SITE_PASSWORD: E2E_PASSWORD, YPS_SESSION_SECRET: E2E_SECRET },
  },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    { name: "mobile", use: { ...devices["Pixel 7"], storageState: STORAGE_STATE }, dependencies: ["setup"], testIgnore: /auth\.setup\.ts/ },
    { name: "tablet", use: { ...devices["iPad (gen 7)"], browserName: "chromium", storageState: STORAGE_STATE }, dependencies: ["setup"], testIgnore: /auth\.setup\.ts/ },
    { name: "desktop", use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE }, dependencies: ["setup"], testIgnore: /auth\.setup\.ts/ },
  ],
});
