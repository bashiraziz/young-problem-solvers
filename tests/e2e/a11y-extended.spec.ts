import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const ROUTES = [
  "/",
  "/programme/foundation",
  "/learn/foundation/unit-1",
  "/learn/foundation/unit-1/lesson/l01",
  "/learn/foundation/unit-1/lesson/l02",
  "/learn/foundation/unit-1/lesson/l05",
  "/practice/foundation/unit-1/lesson/l01",
  "/practice/foundation/unit-1/lesson/l02",
  "/practice/foundation/unit-1/lesson/l05",
  "/challenge",
  "/parents",
  "/about",
];

const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

for (const path of ROUTES) {
  test(`${path}: heading levels never skip, one banner/main/contentinfo, landmark names unique`, async ({ page }) => {
    await page.goto(path);
    const levels = await page.$$eval("h1,h2,h3,h4,h5,h6", (hs) => hs.map((h) => Number(h.tagName[1])));
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i++) expect(levels[i], `heading ${i} after ${levels[i - 1]}`).toBeLessThanOrEqual(levels[i - 1] + 1);
    for (const role of ["banner", "main", "contentinfo"]) await expect(page.getByRole(role as "banner")).toHaveCount(1);
    const navNames = await page.$$eval("nav", (ns) => ns.filter((n) => n.getClientRects().length > 0).map((n) => n.getAttribute("aria-label")));
    expect(new Set(navNames).size).toBe(navNames.length);
    expect(navNames.every(Boolean)).toBe(true);
  });

  test(`${path}: usable at 200% text size and with WCAG text-spacing overrides (1.4.4, 1.4.12)`, async ({ page }) => {
    await page.goto(path);
    await page.addStyleTag({ content: "html{font-size:200% !important}" });
    expect(await overflow(page), "200% text").toBeLessThanOrEqual(0);
    await page.addStyleTag({
      // A deliberately wide font keeps local runs as strict as Linux CI, whose default fonts are wider than Windows or macOS.
      content: "*{font-family:Verdana,'DejaVu Sans',sans-serif !important;line-height:1.5 !important;letter-spacing:0.12em !important;word-spacing:0.16em !important} p{margin-bottom:2em !important}",
    });
    expect(await overflow(page), "text spacing").toBeLessThanOrEqual(0);
    // Primary heading must still be fully inside the viewport width.
    const box = await page.getByRole("heading", { level: 1 }).boundingBox();
    const vw = await page.evaluate(() => window.innerWidth);
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(vw + 1);
  });

  test(`${path}: works in forced-colors (high-contrast) mode and with reduced motion`, async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
    await page.goto(path);
    expect(await overflow(page)).toBeLessThanOrEqual(0);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
    const infinite = await page.evaluate(() => document.getAnimations().filter((a) => a.effect?.getTiming().iterations === Infinity).length);
    expect(infinite).toBe(0);
    // Keyboard focus must still be indicated (outline is preserved in forced colors).
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
    expect(outline).not.toBe("none");
  });

  test(`${path}: interactive controls are at least 24×24 CSS px (WCAG 2.5.8)`, async ({ page }) => {
    await page.goto(path);
    const small = await page.evaluate(() => {
      const out: string[] = [];
      const els = document.querySelectorAll<HTMLElement>("button, summary, input:not([type=checkbox]):not([type=radio]), textarea, nav a, header a, footer a, a.rounded-xl, a.rounded-full");
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue; // hidden
        if (r.width < 24 || r.height < 24) out.push(`${el.tagName} "${(el.textContent ?? "").trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
      }
      // Checkboxes: the clickable label is the target and must be large enough.
      for (const cb of document.querySelectorAll<HTMLInputElement>("input[type=checkbox]")) {
        const r = (cb.closest("label") ?? cb).getBoundingClientRect();
        if (r.width < 24 || r.height < 24) out.push(`checkbox label ${Math.round(r.width)}×${Math.round(r.height)}`);
      }
      return out;
    });
    expect(small).toEqual([]);
  });

  test(`${path}: keyboard focus is never hidden behind the sticky header (WCAG 2.4.11)`, async ({ page }) => {
    await page.goto(path);
    const header = page.locator("header");
    const problems: string[] = [];
    for (let i = 0; i < 70; i++) {
      await page.keyboard.press("Tab");
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const h = document.querySelector("header")!;
        const r = el.getBoundingClientRect();
        return { inHeader: h.contains(el), top: r.top, bottom: r.bottom, headerBottom: h.getBoundingClientRect().bottom, label: (el.getAttribute("aria-label") || el.textContent || el.tagName).trim().slice(0, 30) };
      });
      if (!info) break;
      // The skip link intentionally appears above the header when focused, so it is never obscured.
      if (!info.inHeader && info.label !== "Skip to content" && info.top < info.headerBottom - 1) problems.push(`${info.label}: top ${Math.round(info.top)} < header ${Math.round(info.headerBottom)}`);
    }
    expect(problems).toEqual([]);
    await expect(header).toBeVisible();
  });
}

test("fixed-size flex items are never squeezed (logo mark, FAQ indicators), even with huge text and a wide font", async ({ page }) => {
  await page.goto("/about");
  await page.addStyleTag({ content: "html{font-size:200% !important} *{font-family: Verdana, 'DejaVu Sans', sans-serif !important; letter-spacing:0.12em !important}" });
  const mark = await page.locator('header img[src*="mark.svg"]').evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { w: r.width, h: r.height };
  });
  expect(Math.abs(mark.w - mark.h), "logo mark stays square").toBeLessThanOrEqual(1);
  expect(mark.w).toBeGreaterThanOrEqual(40);
  const indicators = await page.locator("summary span[aria-hidden=true]").evaluateAll((els) => els.map((e) => e.getBoundingClientRect().width));
  expect(indicators.length).toBeGreaterThan(0);
  for (const w of indicators) expect(w).toBeGreaterThan(4);
  expect(await overflow(page)).toBeLessThanOrEqual(0);
});

// A viewport override (not page.setViewportSize, which hangs in Firefox at this width) works in every browser.
test.describe("at 320 px wide (WCAG 1.4.10 reflow)", () => {
  test.use({ viewport: { width: 320, height: 640 } });

  for (const path of ROUTES) {
    test(`${path}: no horizontal scrolling`, async ({ page }) => {
      await page.goto(path);
      expect(await overflow(page)).toBeLessThanOrEqual(0);
    });
  }

  test("challenge step 3 (the busiest screen) is not clipped", async ({ page }) => {
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
    expect(await overflow(page)).toBeLessThanOrEqual(0);
    const box = await page.getByRole("textbox", { name: /^Fruit juice/ }).boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(320);
  });
});
