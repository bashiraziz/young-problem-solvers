import AxeBuilder from "@axe-core/playwright";
import { type Locator, type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/**
 * Learning Library. Correct responses are COMPUTED here from the numbers printed in each question, not listed as
 * an answer key (the product follows the same rule: see src/lib/learning/items.ts).
 */

const form = (page: Page, text: string | RegExp): Locator => page.locator("form", { hasText: text });
const check = (f: Locator) => f.getByRole("button", { name: "Check", exact: true });
const good = (f: Locator) => expect(f.getByRole("status")).toContainText("Good:");
const notYet = (f: Locator) => expect(f.getByRole("status")).toContainText("Not yet:");

async function number(page: Page, prompt: string | RegExp, label: string | RegExp, value: number | string) {
  const f = form(page, prompt);
  await f.getByLabel(label).fill(String(value));
  await f.getByLabel(label).press("Enter");
  return f;
}
async function choose(page: Page, prompt: string | RegExp, option: string) {
  const f = form(page, prompt);
  await f.getByRole("radio", { name: option, exact: true }).check();
  await check(f).click();
  return f;
}
async function parts(page: Page, prompt: string | RegExp, boxes: number[]) {
  const f = form(page, prompt);
  const places = ["Ten-thousands", "Thousands", "Hundreds", "Tens", "Ones"];
  for (const [i, v] of boxes.entries()) if (v > 0) await f.getByLabel(places[i], { exact: true }).fill(String(v));
  await check(f).click();
  return f;
}
async function tickAll(page: Page, prompt: string | RegExp) {
  const f = form(page, prompt);
  for (const box of await f.getByRole("checkbox").all()) await box.check();
  return f;
}
const progress = (page: Page) => page.getByRole("status").filter({ hasText: /parts finished/ });

async function axe(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);
}

test("unit page: six lessons tied to week and session, objectives, status and print links", async ({ page }) => {
  await page.goto("/learn/foundation/unit-1");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Unit 1: Think with Numbers");
  await expect(page.getByRole("note")).toContainText("pilot draft");
  await expect(page.getByRole("note")).toContainText("not been checked");
  const cards = page.locator("#lessons-h ~ ol > li");
  await expect(cards).toHaveCount(6);
  const labels = await cards.locator("p").first().allInnerTexts();
  expect(labels[0]).toMatch(/lesson 1 · week 1 · session 1/i);
  await expect(cards.nth(5).locator("p").first()).toHaveText(/lesson 6 · week 3 · session 2/i);
  await expect(page.getByText("I can represent five-digit amounts using ten-thousands").first()).toBeVisible();
  // Units 2 to 4 are clearly outlines, not lessons.
  await expect(page.getByText("Outline only: not yet written")).toHaveCount(3);
  await expect(page.getByRole("link", { name: "Download" })).toHaveCount(2);
  await expect(page.getByText("pilot draft", { exact: false }).first()).toBeVisible();
  await axe(page);
});

test("lesson 1: steps appear one at a time, then the worked example with an accessible table", async ({ page }) => {
  await page.goto("/learn/foundation/unit-1/lesson/l01");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Number Detectives: Place Value");
  await expect(page.getByText("How does the position of a digit change its value?").first()).toBeVisible();
  await expect(page.getByText("I can compare and order amounts")).toBeVisible();
  const steps = page.locator("#learn-h ~ div ol > li");
  await expect(steps).toHaveCount(1);
  await expect(page.getByRole("region", { name: "Worked example" })).toHaveCount(0);

  await page.getByRole("button", { name: "Show step 2 of 3" }).click();
  await expect(steps).toHaveCount(2);
  await page.getByRole("button", { name: "Show step 3 of 3" }).click();
  await expect(steps).toHaveCount(3);
  await page.getByRole("button", { name: "Show the worked example" }).click();
  const example = page.getByRole("region", { name: "Worked example" });
  await expect(example).toContainText("24,650");
  const table = example.getByRole("table", { name: "Place-value table" });
  await expect(table.getByRole("columnheader")).toHaveCount(6);
  await expect(table.getByRole("rowheader")).toHaveCount(2);
  await axe(page);
});

test("lesson 1 guided questions: hints give the method, a wrong answer is kind, the right one is confirmed", async ({ page }) => {
  await page.goto("/learn/foundation/unit-1/lesson/l01");
  const larger = form(page, "Which amount is larger?");
  await larger.getByRole("radio", { name: "18,950" }).check();
  await check(larger).click();
  await notYet(larger);
  await expect(larger.getByRole("status")).not.toContainText("19,050");
  await larger.getByRole("button", { name: "Give me a hint" }).click();
  await expect(larger.getByRole("list", { name: "Hints" })).toContainText("place-value table");
  await larger.getByRole("radio", { name: "19,050" }).check();
  await check(larger).click();
  await good(larger);

  const p = form(page, /Partition 32,406/);
  await p.getByLabel("Thousands", { exact: true }).fill("2");
  await check(p).click();
  await notYet(p);
  await expect(p.getByRole("status")).toContainText("Ten-thousands");
  await expect(p.getByRole("status")).not.toContainText("30,000");
  await axe(page);
  await parts(page, /Partition 32,406/, [30_000, 2_000, 400, 0, 6]);
  await good(form(page, /Partition 32,406/));
});

test("lesson 1 practice: every question can be completed and the count reaches the total", async ({ page }) => {
  await page.goto("/practice/foundation/unit-1/lesson/l01");
  await expect(progress(page)).toContainText(/^0 of \d+ parts finished/);

  await good(await parts(page, /expanded form/, [4 * 10_000, 0, 3 * 100, 0, 5]));
  await good(await number(page, /value of digit 7/, "Value of the digit 7", 7 * 1_000));
  await good(await choose(page, /Use <, > or =/, "less than"));
  const order = await number(page, /Order from least to greatest/, /Write all 4 numbers/, "9,200 8,950 9,020 8,905");
  await notYet(order);
  await order.getByLabel(/Write all 4 numbers/).fill("8,905 8,950 9,020 9,200");
  await order.getByLabel(/Write all 4 numbers/).press("Enter");
  await good(order);
  await tickAll(page, /place-value error/);
  const between = form(page, /Type two different amounts/);
  await between.getByLabel("Amount 1").fill("12,460");
  await between.getByLabel("Amount 2").fill("12,470");
  await check(between).click();
  await good(between);
  await tickAll(page, /Explain why they fit/);
  await tickAll(page, /A bookshop displays/);
  await choose(page, /Which is greater\?/, "30,099");
  await tickAll(page, /Explain using one place value/);

  const text = await progress(page).innerText();
  const [, done, total] = /(\d+) of (\d+) parts finished/.exec(text)!;
  expect(done).toBe(total);
  await expect(page.getByRole("heading", { name: "Stretch challenge" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Exit ticket" })).toBeVisible();
  await axe(page);
});

test("lesson 2 practice: estimate, calculate, check, with every part checkable", async ({ page }) => {
  await page.goto("/practice/foundation/unit-1/lesson/l02");
  for (const [nearest, value] of [["100", 6_450 + 50], ["1,000", 6_450 - 450]] as const) {
    const label = `6,450 to the nearest ${nearest}`;
    const f = page.locator("form").filter({ has: page.getByLabel(label, { exact: true }) });
    await f.getByLabel(label, { exact: true }).fill(String(value));
    await f.getByLabel(label, { exact: true }).press("Enter");
    await good(f);
  }
  await good(await number(page, /Estimate 2,780 \+ 5,120/, "My estimate (UGX)", 3_000 + 5_000));
  await good(await number(page, /exact sum for Question 2/, "Exact sum (UGX)", 2_780 + 5_120));
  // Either sensible rounding is a valid estimate.
  await number(page, /Estimate\. Round to the nearest 100 or the nearest 1,000/, "My estimate (UGX)", 12_500 + 3_700);
  await number(page, /Calculate exactly\./, "Exact sum (UGX)", 12_490 + 3_710);
  await tickAll(page, /Show your chosen rounding/);
  await good(await number(page, /Correct the total/, "Correct total (UGX)", 5_750 + 2_250));
  await tickAll(page, /Explain the mistake/);
  await tickAll(page, /Explain when rounding to 100/);
  await number(page, /Estimate first\./, "My estimate (UGX)", 10_000 + 10_000);
  await number(page, /Now calculate the exact cost/, "Exact cost (UGX)", 9_650 + 10_250);
  await choose(page, /Is the money enough\?/, "Yes");
  await choose(page, /Is the reported total right\?/, "No");
  await tickAll(page, /Show a check/);

  const [, done, total] = /(\d+) of (\d+) parts finished/.exec(await progress(page).innerText())!;
  expect(done).toBe(total);
});

test("a wrong answer never shows the correct answer, in any lesson 2 number question", async ({ page }) => {
  await page.goto("/practice/foundation/unit-1/lesson/l02");
  const f = await number(page, /exact sum for Question 2/, "Exact sum (UGX)", 2_780 + 5_120 + 100);
  await notYet(f);
  await expect(f.getByRole("status")).not.toContainText(String(2_780 + 5_120));
  await expect(f.getByRole("status")).not.toContainText(/7,?900/);
  await f.getByLabel("Exact sum (UGX)").fill("seven thousand");
  await f.getByLabel("Exact sum (UGX)").press("Enter");
  await expect(f.getByRole("status")).toContainText("digits only");
});

test("scaffolded lessons (3–6) show their questions and a local scratchpad, no checking", async ({ page }) => {
  await page.goto("/practice/foundation/unit-1/lesson/l05");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Equal Groups and Whole Packets");
  await expect(page.getByText("Interactive checking for this lesson is coming later", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: "Check", exact: true })).toHaveCount(0);
  await expect(progress(page)).toHaveCount(0);
  const pads = page.getByRole("textbox", { name: /Your thinking/ });
  expect(await pads.count()).toBe(6 + 1 + 1);
  await pads.first().fill("My private working");
  await expect(pads.first()).toHaveValue("My private working");

  await page.goto("/learn/foundation/unit-1/lesson/l05");
  await expect(page.getByText("What does a remainder mean when buying whole packets?").first()).toBeVisible();
  await expect(page.getByText("Interactive checking for this lesson is coming later", { exact: false })).toBeVisible();
});

test("keyboard only: reveal the steps, answer and check without a mouse", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard flow is a desktop concern");
  await page.goto("/learn/foundation/unit-1/lesson/l01");
  await page.getByRole("button", { name: "Show step 2 of 3" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Show step 3 of 3" })).toBeVisible();
  const radio = form(page, "Which amount is larger?").getByRole("radio", { name: "19,050" });
  await radio.focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("Tab");
  await expect(check(form(page, "Which amount is larger?"))).toBeFocused();
  await page.keyboard.press("Enter");
  await good(form(page, "Which amount is larger?"));
});

test("lesson navigation: previous and next, practice and back, print links open at the right page", async ({ page }) => {
  await page.goto("/learn/foundation/unit-1/lesson/l03");
  await expect(page.getByRole("link", { name: /Lesson 2: Estimate, Calculate, Check/ })).toBeVisible();
  await page.getByRole("link", { name: /Lesson 4: Choices, Trade-offs/ }).click();
  await expect(page).toHaveURL(/lesson\/l04$/);
  await page.getByRole("link", { name: /Go to practice/ }).click();
  await expect(page).toHaveURL(/practice\/foundation\/unit-1\/lesson\/l04$/);
  await expect(page.getByRole("link", { name: "Back to the lesson" })).toBeVisible();
  const open = page.getByRole("link", { name: /Open at this lesson/ });
  await expect(open.first()).toHaveAttribute("href", /Coursebook_PILOT_DRAFT\.pdf#page=6$/);
  await expect(open.nth(1)).toHaveAttribute("href", /Workbook_PILOT_DRAFT\.pdf#page=9$/);
  await page.goto("/learn/foundation/unit-1/lesson/l99");
  await expect(page.getByRole("heading", { name: /puzzle even we can.t solve/ })).toBeVisible();
});

test("printable PDFs are served as PDF documents", async ({ request }) => {
  for (const name of ["Coursebook", "Workbook"]) {
    const res = await request.get(`/downloads/YPS_Unit1_Student_${name}_PILOT_DRAFT.pdf`);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("pdf");
    const body = await res.body();
    expect(body.subarray(0, 5).toString()).toBe("%PDF-");
    expect(body.length).toBeGreaterThan(50_000);
  }
});

test("the old /programme address forwards to /programme/foundation", async ({ page }) => {
  await page.goto("/programme");
  await expect(page).toHaveURL(/\/programme\/foundation$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Twelve weeks");
});

test("privacy: practising sends and stores nothing; no confidential material in any script", async ({ page, context, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  const requests: { method: string; url: string }[] = [];
  page.on("request", (r) => requests.push({ method: r.method(), url: r.url() }));
  await page.goto("/practice/foundation/unit-1/lesson/l01");
  await page.waitForLoadState("networkidle");

  const before = requests.length;
  await number(page, /value of digit 7/, "Value of the digit 7", 7);
  await page.getByRole("textbox", { name: /Your thinking/ }).first().fill("A private thought that must stay on this page.");
  await tickAll(page, /place-value error/);
  // Next.js may prefetch static pages for visible links (same-origin GETs with ?_rsc=). Nothing else may happen,
  // and nothing the child typed may appear in any request.
  const during = requests.slice(before).filter((r) => !/[?&]_rsc=/.test(r.url));
  expect(during, "no requests while practising").toEqual([]);
  expect(requests.some((r) => /private%20thought|private thought/i.test(r.url))).toBe(false);
  expect(requests.filter((r) => r.method !== "GET")).toEqual([]);
  expect(requests.filter((r) => new URL(r.url).origin !== origin && !new URL(r.url).hostname.endsWith("vercel.live"))).toEqual([]);

  const stored = await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, cookie: document.cookie }));
  expect(stored).toEqual({ local: 0, session: 0, cookie: "" });
  expect(await context.cookies()).toEqual([]);

  // Everything the browser downloaded for this page: no teacher or assessment material.
  const scripts = requests.filter((r) => r.url.includes("/_next/static/") && r.url.endsWith(".js"));
  expect(scripts.length).toBeGreaterThan(0);
  for (const s of scripts) {
    const body = await (await page.request.get(s.url)).text();
    expect(body, s.url).not.toMatch(/Teacher_Manual|Assessment_Student|CONFIDENTIAL|answer key|mark scheme/i);
  }
});
