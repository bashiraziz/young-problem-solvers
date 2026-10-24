import { defineConfig, devices } from "@playwright/test";

// Viewports required by the Milestone 2 brief: 375 px, 768 px and 1440 px wide.
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: "http://localhost:3217", trace: "on-first-retry" },
  webServer: {
    command: "npm run build && npx next start -p 3217",
    url: "http://localhost:3217",
    reuseExistingServer: false,
    timeout: 180_000,
  },
  projects: [
    { name: "mobile-375", use: { ...devices["Pixel 7"], viewport: { width: 375, height: 812 } } },
    { name: "tablet-768", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: "desktop-1440", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
  ],
});
