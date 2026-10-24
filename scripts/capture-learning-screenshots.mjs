// Usage (server running): node scripts/capture-learning-screenshots.mjs [baseUrl] [outDir]
// Captures desktop (1440) and mobile (375) screenshots of the Learning Library for review.
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3217";
const out = process.argv[3] ?? "docs/review";
const browser = await chromium.launch();

const views = [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 375, height: 812 }],
];

const shots = {
  "programme-foundation": { path: "/programme/foundation" },
  "unit-1": { path: "/learn/foundation/unit-1" },
  "lesson-1": {
    path: "/learn/foundation/unit-1/lesson/l01",
    async act(page) {
      await page.getByRole("button", { name: "Show step 2 of 3" }).click();
      await page.getByRole("button", { name: "Show step 3 of 3" }).click();
      await page.getByRole("button", { name: "Show the worked example" }).click();
      const f = page.locator("form", { hasText: "Which amount is larger?" });
      await f.getByRole("radio", { name: "18,950" }).check();
      await f.getByRole("button", { name: "Check", exact: true }).click();
      await f.getByRole("button", { name: "Give me a hint" }).click();
    },
  },
  "lesson-2": { path: "/learn/foundation/unit-1/lesson/l02" },
  "practice-1": {
    path: "/practice/foundation/unit-1/lesson/l01",
    async act(page) {
      const parts = page.locator("form", { hasText: "expanded form" });
      await parts.getByLabel("Ten-thousands", { exact: true }).fill("40000");
      await parts.getByLabel("Hundreds", { exact: true }).fill("300");
      await parts.getByLabel("Ones", { exact: true }).fill("5");
      await parts.getByRole("button", { name: "Check", exact: true }).click();
      const v = page.locator("form", { hasText: "value of digit 7" });
      await v.getByLabel("Value of the digit 7").fill("7");
      await v.getByLabel("Value of the digit 7").press("Enter");
    },
  },
  "practice-2": { path: "/practice/foundation/unit-1/lesson/l02" },
  "scaffolded-lesson-5": { path: "/learn/foundation/unit-1/lesson/l05" },
};

for (const [vname, viewport] of views) {
  const page = await (await browser.newContext({ viewport })).newPage();
  for (const [name, s] of Object.entries(shots)) {
    await page.goto(base + s.path);
    await page.waitForLoadState("networkidle");
    if (s.act) await s.act(page);
    await page.screenshot({ path: `${out}/learning-${name}-${vname}.jpg`, fullPage: true, type: "jpeg", quality: 70 });
  }
}
await browser.close();
console.log("done");
