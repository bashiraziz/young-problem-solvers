import AxeBuilder from "@axe-core/playwright";
import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const question = (page: Page, text: RegExp) => page.locator("form", { hasText: text });

async function answer(page: Page, prompt: RegExp, value: string) {
  const form = question(page, prompt);
  await form.getByRole("textbox").fill(value);
  await form.getByRole("textbox").press("Enter");
  return form;
}

const next = (page: Page, name: string) => page.getByRole("button", { name: new RegExp(`Next: ${name}`) });

async function axe(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);
}

async function completeEstimate(page: Page) {
  await answer(page, /Your estimate/, "70000");
  await next(page, "Calculate").click();
}

async function completeCalculations(page: Page) {
  await answer(page, /40 cups/, "48000");
  await answer(page, /60 samosas/, "24000");
  await answer(page, /total cost of both orders/, "72000");
  await answer(page, /how much money is left/, "13000");
  await next(page, "Choose").click();
}

/** Fills quantity boxes by product name, e.g. { "Fruit juice": "30" }. */
async function fillPlan(page: Page, plan: Record<string, string>) {
  for (const [name, value] of Object.entries(plan)) await page.getByRole("textbox", { name: new RegExp(`^${name}`) }).fill(value);
}

const MID_PLAN = {
  "Fruit juice": "30",
  "Samosa": "40",
  "Bottled water": "30",
};

test("full flow: estimate → calculate → choose → justify → reflect, then reset", async ({ page }) => {
  await page.goto("/challenge");

  // 1 Estimate — wrong, hint, invalid input, then reasonable
  await expect(page.getByRole("heading", { level: 2, name: "Estimate" })).toBeVisible();
  await expect(next(page, "Calculate")).toBeDisabled();
  let form = await answer(page, /Your estimate/, "30000");
  await expect(form).toContainText(/too low/i);
  await form.getByRole("button", { name: "Give me a hint" }).click();
  await expect(form.getByRole("list", { name: "Hints" })).toContainText("Hint 1");
  form = await answer(page, /Your estimate/, "abc");
  await expect(form).toContainText(/digits only/i);
  form = await answer(page, /Your estimate/, "100000");
  await expect(form).toContainText(/too high/i);
  form = await answer(page, /Your estimate/, "70,000");
  await expect(form).toContainText(/close enough/i);
  await expect(form).not.toContainText("72,000"); // the exact total is not revealed yet
  await axe(page);
  await next(page, "Calculate").click();

  // 2 Calculate — graduated feedback on mistakes
  await expect(page.getByRole("heading", { level: 2, name: "Calculate" })).toBeFocused();
  form = await answer(page, /40 cups/, "4800");
  await expect(form).toContainText(/zeros/i);
  form = await answer(page, /40 cups/, "-5");
  await expect(form).toContainText(/zero or more/i);
  form = await answer(page, /40 cups/, "4.5");
  await expect(form).toContainText(/whole number/i);
  form = await answer(page, /40 cups/, "48,000");
  await expect(form).toContainText(/Good/);
  await answer(page, /60 samosas/, "24000");
  form = await answer(page, /total cost of both orders/, "48000");
  await expect(form).toContainText(/only the first order/i);
  await answer(page, /total cost of both orders/, "72000");
  form = await answer(page, /how much money is left/, "28000");
  await expect(form).toContainText(/stall fee/i);
  await expect(next(page, "Choose")).toBeDisabled();
  await answer(page, /how much money is left/, "13000");
  await axe(page);
  await next(page, "Choose").click();

  // 3 Choose — invalid plans are explained, a valid one unlocks Next
  await expect(page.getByRole("heading", { level: 2, name: "Choose" })).toBeFocused();
  await expect(page.getByRole("status").getByText("Choose some items to buy.")).toBeVisible();
  await fillPlan(page, { "Bottled water": "10" });
  await expect(page.getByRole("status").getByText(/at least 2 different products/i)).toBeVisible();
  await fillPlan(page, { "Cake slice": "200", "Samosa": "5" });
  await expect(page.getByRole("status").getByText(/Over budget by/i)).toBeVisible();
  await fillPlan(page, { "Cake slice": "abc" });
  await expect(page.getByRole("status").getByText("Fix the highlighted boxes first.")).toBeVisible();
  await expect(next(page, "Justify")).toBeDisabled();
  await fillPlan(page, { "Cake slice": "", ...MID_PLAN });
  await expect(page.getByRole("status").getByText(/Your plan is within budget/)).toBeVisible();
  await expect(page.getByText("Total cost", { exact: true }).first()).toBeVisible();
  await axe(page);
  await next(page, "Justify").click();

  // 4 Justify — reasons are checked against the child's own numbers
  await expect(page.getByRole("heading", { level: 2, name: "Justify" })).toBeFocused();
  const check = page.getByRole("button", { name: /Check my reasons/ });
  await expect(check).toBeDisabled();
  await page.getByLabel("My plan stays within the budget.").check();
  await page.getByLabel("My plan still makes a surplus if only 3 out of every 4 items sell.").check();
  await page.getByLabel(/In your own words/).fill("I want customers to have a choice.");
  await check.click();
  await expect(page.getByText(/Supported\./).first()).toBeVisible();
  await expect(page.locator("li", { hasText: "Think again." })).toContainText("shortfall");
  await axe(page);
  await next(page, "Reflect").click();

  // 5 Reflect
  await expect(page.getByRole("heading", { level: 2, name: "Reflect" })).toBeFocused();
  await expect(page.getByText("−UGX 5,400")).toBeVisible(); // 3-out-of-4 surplus for this plan
  await expect(page.getByText(/Well done for finishing/)).toBeVisible();
  await page.getByLabel("I estimated before I calculated.").check();
  await axe(page);

  // Going back keeps earlier work; Start again clears everything
  await page.getByRole("button", { name: /2\. Calculate/ }).click();
  await expect(question(page, /40 cups/).getByRole("textbox")).toHaveValue("48,000");
  await page.getByRole("button", { name: "Start again" }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Estimate" })).toBeFocused();
  await expect(question(page, /Your estimate/).getByRole("textbox")).toHaveValue("");
  await expect(page.getByRole("button", { name: /3\. Choose/ })).toBeDisabled();
});

test("worked answer is offered only after three hints, and lets the child continue", async ({ page }) => {
  await page.goto("/challenge");
  const form = question(page, /Your estimate/);
  await expect(form.getByRole("button", { name: /worked answer/ })).toHaveCount(0);
  for (let i = 0; i < 3; i++) await form.getByRole("button", { name: /hint/i }).click();
  await expect(form.getByRole("list", { name: "Hints" }).getByRole("listitem")).toHaveCount(3);
  await expect(form.getByRole("button", { name: /hint/i })).toHaveCount(0);
  await form.getByRole("button", { name: "Show me the worked answer" }).click();
  await expect(form).toContainText("about UGX 64,000");
  await expect(next(page, "Calculate")).toBeEnabled();
});

test("the plan cannot be broken by navigating: later steps lock while the plan is invalid", async ({ page }) => {
  await page.goto("/challenge");
  await completeEstimate(page);
  await completeCalculations(page);
  await fillPlan(page, MID_PLAN);
  await next(page, "Justify").click();
  await page.getByRole("button", { name: /3\. Choose/ }).click();
  await fillPlan(page, { "Cake slice": "200" }); // over budget
  await expect(page.getByRole("button", { name: /4\. Justify/ })).toBeDisabled();
  await expect(page.getByRole("button", { name: /5\. Reflect/ })).toBeDisabled();
});

test("works by keyboard alone", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard flow is desktop-oriented");
  await page.goto("/challenge");
  const input = question(page, /Your estimate/).getByRole("textbox");
  await input.focus();
  await page.keyboard.type("70000");
  await page.keyboard.press("Enter"); // submit the form
  await expect(question(page, /Your estimate/)).toContainText(/close enough/i);
  await next(page, "Calculate").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 2, name: "Calculate" })).toBeFocused();
});

test("privacy: no network writes, no third parties and nothing stored while using the challenge", async ({ page, context, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  await page.goto("/challenge");
  await page.waitForLoadState("networkidle");

  const requests: { method: string; url: string }[] = [];
  page.on("request", (r) => requests.push({ method: r.method(), url: r.url() }));

  await completeEstimate(page);
  await completeCalculations(page);
  await fillPlan(page, MID_PLAN);
  await next(page, "Justify").click();
  await page.getByLabel("My plan stays within the budget.").check();
  await page.getByLabel(/In your own words/).fill("A private reason that must never leave this page.");
  await page.getByRole("button", { name: /Check my reasons/ }).click();
  await next(page, "Reflect").click();

  expect(requests.filter((r) => r.method !== "GET"), "no POST/PUT/etc.").toEqual([]);
  // Vercel injects its own toolbar script on preview deployments only; production never loads it.
  const thirdParty = requests.filter((r) => new URL(r.url).origin !== origin && !new URL(r.url).hostname.endsWith("vercel.live"));
  expect(thirdParty, "no cross-origin requests").toEqual([]);

  const stored = await page.evaluate(async () => ({
    local: localStorage.length,
    session: sessionStorage.length,
    cookie: document.cookie,
    databases: "databases" in indexedDB ? (await indexedDB.databases()).length : 0,
  }));
  expect(stored).toEqual({ local: 0, session: 0, cookie: "", databases: 0 });
  expect(await context.cookies()).toEqual([]);
});
