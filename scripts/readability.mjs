// Readability and time estimate for the child-facing text of the challenge, per step.
// Usage (server running): node scripts/readability.mjs [baseUrl]
// Output is an ESTIMATE from text statistics, not a measurement with children.
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3217";

const syllables = (word) => {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const m = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "").match(/[aeiouy]{1,2}/g);
  return Math.max(1, m ? m.length : 1);
};

function stats(text) {
  const clean = text.replace(/UGX\s?[\d,]+/g, "UGX").replace(/[\d,]+/g, "n"); // numbers read as one short word
  const sentences = clean.split(/[.!?]+\s|\n+/).map((s) => s.trim()).filter((s) => s.split(/\s+/).length > 2);
  const words = clean.split(/\s+/).filter((w) => /[a-z]/i.test(w));
  const syl = words.reduce((n, w) => n + syllables(w), 0);
  const wps = words.length / Math.max(1, sentences.length);
  const spw = syl / Math.max(1, words.length);
  return { words: words.length, sentences: sentences.length, wordsPerSentence: +wps.toFixed(1), fkGrade: +(0.39 * wps + 11.8 * spw - 15.59).toFixed(1) };
}

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1000, height: 900 } })).newPage();
await page.goto(base + "/challenge");
const section = page.locator('section[aria-label="The challenge"]');
const answer = async (re, v) => {
  const f = page.locator("form", { hasText: re });
  await f.getByRole("textbox").fill(v);
  await f.getByRole("textbox").press("Enter");
};
const qty = (n, v) => page.getByRole("textbox", { name: new RegExp(`^${n}`) }).fill(v);
const grab = async () => (await section.innerText()).replace(/Step \d of 5/, "");

const steps = [];
const framing = await page.locator("main > section").first().innerText();
steps.push(["Page intro", framing]);
await answer(/Your estimate/, "30000");
await page.locator("form", { hasText: /Your estimate/ }).getByRole("button", { name: "Give me a hint" }).click();
await page.locator("form", { hasText: /Your estimate/ }).getByRole("button", { name: "Another hint" }).click();
steps.push(["1 Estimate (with 2 hints)", await grab()]);
await answer(/Your estimate/, "70000");
await page.getByRole("button", { name: /Next: Calculate/ }).click();
await answer(/40 cups/, "4800");
steps.push(["2 Calculate (one mistake)", await grab()]);
await answer(/40 cups/, "48000");
await answer(/60 samosas/, "24000");
await answer(/total cost of both orders/, "72000");
await answer(/how much money is left/, "13000");
await page.getByRole("button", { name: /Next: Choose/ }).click();
await qty("Fruit juice", "30");
await qty("Samosa", "40");
await qty("Bottled water", "30");
steps.push(["3 Choose", await grab()]);
await page.getByRole("button", { name: /Next: Justify/ }).click();
await page.getByLabel("My plan stays within the budget.").check();
await page.getByLabel("My plan still makes a surplus if only 3 out of every 4 items sell.").check();
await page.getByRole("button", { name: /Check my reasons/ }).click();
steps.push(["4 Justify", await grab()]);
await page.getByRole("button", { name: /Next: Reflect/ }).click();
steps.push(["5 Reflect", await grab()]);
const rules = await page.locator("#learn-h").locator("xpath=..").innerText();
steps.push(["Objectives and ground rules", rules]);
await browser.close();

let totalWords = 0;
console.log("Step".padEnd(30), "words", "w/sent", "FK grade");
for (const [name, text] of steps) {
  const s = stats(text);
  totalWords += s.words;
  console.log(name.padEnd(30), String(s.words).padStart(5), String(s.wordsPerSentence).padStart(6), String(s.fkGrade).padStart(8));
}
const all = stats(steps.map((s) => s[1]).join("\n"));
console.log("ALL".padEnd(30), String(all.words).padStart(5), String(all.wordsPerSentence).padStart(6), String(all.fkGrade).padStart(8));

// Time model: a 9–12 year old reads ~100–150 words per minute; each typed answer or choice takes ~30–60 s
// including thinking and fixing a mistake. Interactions: 1 estimate + 4 calculations + 3–4 quantities
// + 2–3 reasons + 1 check + 4 self-check ticks (optional).
const readMin = [totalWords / 150, totalWords / 100];
const interactions = 1 + 4 + 4 + 3 + 1;
const actMin = [(interactions * 30) / 60, (interactions * 60) / 60];
console.log(`\nReading: ${readMin[0].toFixed(1)}–${readMin[1].toFixed(1)} min (${totalWords} words at 150–100 wpm; includes feedback text a child may not all read)`);
console.log(`Acting: ${actMin[0].toFixed(1)}–${actMin[1].toFixed(1)} min (${interactions} interactions at 30–60 s)`);
console.log(`Estimated total: ${(readMin[0] + actMin[0]).toFixed(0)}–${(readMin[1] + actMin[1]).toFixed(0)} minutes`);
