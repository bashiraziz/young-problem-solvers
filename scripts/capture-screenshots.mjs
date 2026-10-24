// Captures review screenshots of every route at 375, 768 and 1440 px, plus the challenge at each step.
// Usage (server must already be running): node scripts/capture-screenshots.mjs [baseUrl] [outDir]
// Defaults: http://localhost:3217 and docs/review. Writes JPEGs to keep the repository small.
import { chromium, devices } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3217";
const out = process.argv[3] ?? "docs/review";
const routes = [["home", "/"], ["programme", "/programme/foundation"], ["challenge", "/challenge"], ["parents", "/parents"], ["about", "/about"], ["404", "/nope"]];
const sizes = {
  mobile: { ...devices["Pixel 7"], viewport: { width: 375, height: 812 } },
  tablet: { viewport: { width: 768, height: 1024 } },
  desktop: { viewport: { width: 1440, height: 900 } },
};
const shot = { type: "jpeg", quality: 70 };
const STATIC_HEADER = "header{position:static !important}"; // keep the sticky header out of full-page captures

const browser = await chromium.launch();
for (const [size, opts] of Object.entries(sizes)) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();

  for (const [name, path] of routes) {
    await page.goto(base + path);
    await page.waitForLoadState("networkidle");
    await page.addStyleTag({ content: STATIC_HEADER });
    await page.screenshot({ path: `${out}/${name}-${size}.jpg`, fullPage: true, ...shot });
  }

  await page.goto(base + "/challenge");
  await page.waitForLoadState("networkidle");
  await page.addStyleTag({ content: STATIC_HEADER });
  const section = page.locator('section[aria-label="The challenge"]');
  const answer = async (re, v) => {
    const form = page.locator("form", { hasText: re });
    await form.getByRole("textbox").fill(v);
    await form.getByRole("textbox").press("Enter");
  };
  const qty = (name, v) => page.getByRole("textbox", { name: new RegExp(`^${name}`) }).fill(v);
  const snap = (n) => section.screenshot({ path: `${out}/challenge-step${n}-${size}.jpg`, ...shot });

  await answer(/Your estimate/, "30000");
  await page.locator("form", { hasText: /Your estimate/ }).getByRole("button", { name: "Give me a hint" }).click();
  await snap(1);
  await answer(/Your estimate/, "70000");
  await page.getByRole("button", { name: /Next: Calculate/ }).click();
  await answer(/40 cups/, "4800");
  await snap(2);
  await answer(/40 cups/, "48000");
  await answer(/60 samosas/, "24000");
  await answer(/total cost of both orders/, "72000");
  await answer(/how much money is left/, "13000");
  await page.getByRole("button", { name: /Next: Choose/ }).click();
  await qty("Fruit juice", "30");
  await qty("Samosa", "40");
  await qty("Bottled water", "30");
  await snap(3);
  await page.getByRole("button", { name: /Next: Justify/ }).click();
  await page.getByLabel("My plan stays within the budget.").check();
  await page.getByLabel("My plan still makes a surplus if only 3 out of every 4 items sell.").check();
  await page.getByRole("button", { name: /Check my reasons/ }).click();
  await snap(4);
  await page.getByRole("button", { name: /Next: Reflect/ }).click();
  await snap(5);
  await ctx.close();
}
await browser.close();
console.log("screenshots written to", out);
