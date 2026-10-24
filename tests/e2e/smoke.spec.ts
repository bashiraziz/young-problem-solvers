import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("homepage loads with key sections and noindex", async ({ page, request }) => {
  const res = await page.goto("/");
  expect(res?.headers()["x-robots-tag"]).toContain("noindex");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("learn to think");
  for (const name of [/less memorising/i, /twelve weeks/i, /small challenge/i, /progress you can/i, /frequently asked/i]) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /");
});

test("budget challenge works", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("remaining")).toHaveText("UGX 8,000");
  await page.getByLabel(/an extra poster/i).check();
  await expect(page.getByTestId("remaining")).toHaveText("UGX 6,000");
  await page.getByLabel(/one extra marker/i).check();
  await page.getByLabel(/another marker/i).check();
  await expect(page.getByTestId("status")).toContainText("Over budget");
});

test("navigation works (menu on small screens)", async ({ page, isMobile }) => {
  await page.goto("/");
  const menu = page.locator("button[aria-controls=mobile-nav]");
  if (isMobile || (await menu.isVisible())) {
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toBeFocused();
    await menu.click();
    await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "FAQ" }).click();
  } else {
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "FAQ" }).click();
  }
  await expect(page).toHaveURL(/#faq$/);
});

test("skip link is reachable by keyboard", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard focus check is desktop-oriented");
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
});

test("no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);
});

test("unknown route returns the 404 page", async ({ page }) => {
  const res = await page.goto("/nope");
  expect(res?.status()).toBe(404);
});
