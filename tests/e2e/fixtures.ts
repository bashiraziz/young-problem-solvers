import { test as base, expect } from "@playwright/test";

export { expect };

/**
 * Drop-in replacement for Playwright's `test`. When running against a deployment (DEPLOYED_URL set),
 * every request to another origin is answered locally with an empty response, so the Vercel access token
 * sent in extraHTTPHeaders can never reach a third party (Vercel injects its own toolbar script on previews).
 * Locally this does nothing.
 */
export const test = base.extend<{ guardThirdParties: void }>({
  guardThirdParties: [
    async ({ context, baseURL }, use) => {
      if (process.env.DEPLOYED_URL) {
        const origin = new URL(baseURL!).origin;
        await context.route(
          (url) => url.protocol.startsWith("http") && url.origin !== origin,
          (route) => route.fulfill({ status: 200, contentType: "text/javascript", body: "" }),
        );
      }
      await use();
    },
    { auto: true },
  ],
});
