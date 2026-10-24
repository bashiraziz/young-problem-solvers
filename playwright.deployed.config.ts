import { defineConfig, devices } from "@playwright/test";

/**
 * Runs the e2e suite against a deployed URL that sits behind Vercel Authentication.
 *   vercel env run -- env DEPLOYED_URL=https://<preview>.vercel.app npx playwright test -c playwright.deployed.config.ts
 * Uses the short-lived OIDC token from the linked project (never printed, never stored in the repo).
 * Preview deployments of the same project accept it; protected production needs a Trusted Sources rule.
 */
const url = process.env.DEPLOYED_URL;
const token = process.env.VERCEL_OIDC_TOKEN;
if (!url || !token) throw new Error("Set DEPLOYED_URL and run under `vercel env run` so VERCEL_OIDC_TOKEN is available.");

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000, // the full challenge flow runs four axe scans; Firefox needs the headroom
  fullyParallel: true,
  retries: 1,
  reporter: "list",
  use: { baseURL: url, extraHTTPHeaders: { "x-vercel-trusted-oidc-idp-token": token } },
  projects: [
    { name: "mobile-375", use: { ...devices["Pixel 7"], viewport: { width: 375, height: 812 } } },
    { name: "tablet-768", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: "desktop-1440", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
  ],
});
