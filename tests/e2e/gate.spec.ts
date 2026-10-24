import { expect, test } from "@playwright/test";
import { E2E_PASSWORD } from "./constants";

// These tests run signed out.
test.use({ storageState: { cookies: [], origins: [] } });

test("signed-out visitors are redirected to login and never see the page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Big ideas");
  await expect(page.getByText("Think with Numbers")).toHaveCount(0);
});

test("non-navigation requests are 401, with no-store", async ({ request }) => {
  for (const path of ["/robots.txt", "/sitemap.xml", "/favicon.ico"]) {
    const res = await request.get(path, { maxRedirects: 0, headers: { accept: "*/*" } });
    expect(res.status(), path).toBe(401);
    expect(res.headers()["cache-control"]).toContain("no-store");
  }
});

test("forged cookie is rejected", async ({ page, context, baseURL }) => {
  await context.addCookies([
    { name: "yps_session", value: `${Date.now() + 1e6}.${"a".repeat(32)}.${"b".repeat(64)}`, url: baseURL! },
  ]);
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
});

test("login page is noindex", async ({ page }) => {
  const res = await page.goto("/login");
  expect(res?.headers()["x-robots-tag"]).toContain("noindex");
});

test("wrong password shows an error; right password signs in; sign out locks again", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Preview password").fill("definitely-not-the-password");
  await page.getByRole("button", { name: /enter the preview/i }).click();
  await expect(page.getByText("That password was not recognised")).toBeVisible();

  await page.getByLabel("Preview password").fill(E2E_PASSWORD);
  await page.getByRole("button", { name: /enter the preview/i }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("learn to think");

  const cookies = await page.context().cookies();
  const session = cookies.find((c) => c.name === "yps_session");
  expect(session?.httpOnly).toBe(true);
  expect(session?.sameSite).toBe("Lax");

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
});
