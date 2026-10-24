import AxeBuilder from "@axe-core/playwright";
import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const ROUTES = [
  { path: "/", h1: /learn to think/i, title: /Young Problem Solvers/ },
  { path: "/programme", h1: /Twelve weeks\. Four units/i, title: /Foundation Programme/ },
  { path: "/challenge", h1: /School Fair Refreshments Stall/i, title: /Try a Challenge/ },
  { path: "/parents", h1: /Progress you can actually see/i, title: /For Parents/ },
  { path: "/about", h1: /programme in development/i, title: /About/ },
];

/** Collects console errors, uncaught exceptions and failed requests. */
function watchForErrors(page: Page) {
  const problems: string[] = [];
  page.on("console", (m) => m.type() === "error" && problems.push(`console: ${m.text()}`));
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
  // Vercel injects its own toolbar script on preview deployments only; the deployed-run guard aborts it on purpose.
  page.on("requestfailed", (r) => !new URL(r.url()).hostname.endsWith("vercel.live") && problems.push(`requestfailed: ${r.url()}`));
  page.on("response", (r) => r.status() >= 400 && problems.push(`HTTP ${r.status()}: ${r.url()}`));
  return problems;
}

for (const route of ROUTES) {
  test(`${route.path}: loads with one h1, a title, noindex and no runtime errors`, async ({ page }) => {
    const problems = watchForErrors(page);
    const res = await page.goto(route.path);
    expect(res?.status()).toBe(200);
    expect(res?.headers()["x-robots-tag"]).toContain("noindex");
    await expect(page).toHaveTitle(route.title);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(route.h1);
    await page.waitForLoadState("networkidle");
    expect(problems).toEqual([]);
  });

  test(`${route.path}: no horizontal overflow and passes axe (WCAG 2.2 AA tags)`, async ({ page }) => {
    await page.goto(route.path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);
  });
}

test("every internal link resolves and every in-page anchor has a target", async ({ page, request }) => {
  const checked = new Set<string>();
  for (const route of ROUTES) {
    await page.goto(route.path);
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href") ?? ""));
    for (const href of hrefs) {
      if (href.startsWith("#")) {
        const id = href.slice(1);
        if (id) expect(await page.locator(`[id="${id}"]`).count(), `${route.path} → ${href}`).toBeGreaterThan(0);
      } else if (href.startsWith("/")) {
        if (checked.has(href)) continue;
        checked.add(href);
        const res = await request.get(href.split("#")[0]);
        expect(res.status(), `${route.path} → ${href}`).toBe(200);
      } else if (!href.startsWith("mailto:") && !href.startsWith("tel:")) {
        throw new Error(`Unexpected external or malformed link on ${route.path}: ${href}`);
      }
    }
  }
  expect(checked.size).toBeGreaterThanOrEqual(5);
});

test("main navigation reaches every page and marks the current one", async ({ page, isMobile }) => {
  await page.goto("/");
  const menu = page.locator("button[aria-controls=mobile-nav]");
  const compact = await menu.isVisible();
  for (const [name, path] of [
    ["Foundation Programme", "/programme"],
    ["Try a Challenge", "/challenge"],
    ["For Parents", "/parents"],
    ["About", "/about"],
    ["Home", "/"],
  ] as const) {
    if (compact) {
      await menu.click();
      await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name }).click();
      await expect(menu).toHaveAttribute("aria-expanded", "false");
    } else {
      await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name }).click();
    }
    await expect(page).toHaveURL(new RegExp(`${path === "/" ? "/$" : path}$`));
    const link = compact
      ? undefined
      : page.getByRole("navigation", { name: "Main" }).getByRole("link", { name });
    if (link) await expect(link).toHaveAttribute("aria-current", "page");
  }
  expect(typeof isMobile).toBe("boolean");
});

test("mobile menu: Escape closes it and returns focus, and it stays closed after navigating", async ({ page }) => {
  await page.goto("/");
  const menu = page.locator("button[aria-controls=mobile-nav]");
  test.skip(!(await menu.isVisible()), "menu button only shows below the lg breakpoint");
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();
  await menu.click();
  await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(menu).toHaveAttribute("aria-expanded", "false");
});

test("skip link is the first tab stop and moves focus to main content", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard check is desktop-oriented");
  await page.goto("/programme");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("home call-to-action leads to the working challenge", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Try the challenge/ }).first().click();
  await expect(page).toHaveURL(/\/challenge$/);
  await expect(page.getByRole("heading", { level: 2, name: "Estimate" })).toBeVisible();
});

test("programme page shows all 12 weeks with outcomes", async ({ page }) => {
  await page.goto("/programme");
  for (let n = 1; n <= 12; n++) await expect(page.getByText(`Week ${n}`, { exact: true }).first()).toBeVisible();
  await expect(page.getByText("By the end of the week, each child can:")).toHaveCount(12);
  await expect(page.getByRole("heading", { level: 2, name: "Design and Test" })).toBeVisible();
});

test("parent page marks the sample report as illustrative and makes no outcome promises", async ({ page }) => {
  await page.goto("/parents");
  await expect(page.getByText(/Illustrative example only/i).first()).toBeVisible();
  await expect(page.getByText(/guaranteed/i).first()).toBeVisible(); // appears only in "never promise" wording
  const body = (await page.locator("main").innerText()).toLowerCase();
  for (const banned of ["testimonial", "enrol now", "register now", "limited places", "best in"]) expect(body).not.toContain(banned);
});

test("unknown route returns the 404 page with navigation", async ({ page }) => {
  const res = await page.goto("/nope");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("link", { name: /Back to the homepage/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /puzzle even we can.t solve/ })).toBeVisible();
  await expect(page.locator('img[data-mascot="stuck"]')).toBeVisible();
});

test("robots.txt disallows everything and the sitemap is empty (private preview)", async ({ request }) => {
  expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /");
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("<loc>");
});

test("favicon is the YPS icon, not the framework default", async ({ request }) => {
  const res = await request.get("/icon.svg");
  expect(res.status()).toBe(200);
  expect((await res.text()).toLowerCase()).toContain("#133f45");
  expect((await request.get("/apple-icon.png")).status()).toBe(200);
  expect((await request.get("/favicon.ico")).status()).toBe(200);
});

test("at most one mascot per screen, decorative, on every page", async ({ page }) => {
  for (const { path: route } of ROUTES) {
    await page.goto(route);
    const imgs = page.locator("img[data-mascot]");
    expect(await imgs.count(), route).toBeLessThanOrEqual(1);
    for (const img of await imgs.all()) expect(await img.getAttribute("alt"), route).toBe("");
  }
});

test("the header logo mark is decorative and the home link keeps its name", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("banner").getByRole("link", { name: /Young Problem Solvers/ });
  await expect(link).toBeVisible();
  const mark = link.locator('img[src*="mark.svg"]');
  await expect(mark).toHaveAttribute("alt", "");
});

test("parents, about and programme pages stay calm: no mascot", async ({ page }) => {
  for (const route of ["/parents", "/about", "/programme"]) {
    await page.goto(route);
    await expect(page.locator("img[data-mascot]"), route).toHaveCount(0);
  }
});
