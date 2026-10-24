/**
 * Interactive practice items for the Learning Library.
 *
 * Design rule: an item stores the PARAMETERS of its question (the numbers in the prompt) and a RULE for working out
 * the correct response. It never stores an answer string. The learner's response is checked in the browser and is never
 * stored or sent (no network, no storage), the same promise as the Refreshments Stall challenge.
 */

export type Hints = readonly string[];

export interface BaseItem {
  id: string;
  /** Text shown to the child (taken from the student content file). */
  prompt: string;
  /** Hints by METHOD, easiest nudge last. They never state the answer. */
  hints: Hints;
}

export type NumberRule =
  | { rule: "valueOfDigit"; number: number; digit: number }
  | { rule: "roundTo"; value: number; nearest: number }
  | { rule: "sum"; terms: readonly number[] }
  | { rule: "estimateSum"; terms: readonly number[]; nearest: readonly number[] };

export type ChoiceRule =
  | { rule: "larger"; a: number; b: number }
  | { rule: "compare"; a: number; b: number }
  | { rule: "withinBudget"; terms: readonly number[]; budget: number }
  | { rule: "claimIsCorrect"; terms: readonly number[]; claimed: number };

export interface NumberItem extends BaseItem {
  kind: "number";
  label: string;
  rule: NumberRule;
}
export interface ChoiceItem extends BaseItem {
  kind: "choice";
  rule: ChoiceRule;
}
/** One box per place value: ten-thousands, thousands, hundreds, tens, ones. */
export interface PartsItem extends BaseItem {
  kind: "parts";
  number: number;
}
export interface OrderItem extends BaseItem {
  kind: "order";
  numbers: readonly number[];
}
export interface BetweenItem extends BaseItem {
  kind: "between";
  low: number;
  high: number;
  count: number;
}
/** Written reasoning: a local scratchpad plus method prompts the child ticks off. Nothing is scored. */
export interface OpenItem extends BaseItem {
  kind: "open";
  selfCheck: readonly string[];
}
/** Several parts of one question, each checked on its own. */
export interface GroupItem extends BaseItem {
  kind: "group";
  parts: readonly Item[];
}

export type Item = NumberItem | ChoiceItem | PartsItem | OrderItem | BetweenItem | OpenItem | GroupItem;
export type Leaf = Exclude<Item, GroupItem>;

export type Verdict = "correct" | "incorrect" | "invalid";
export interface Outcome {
  verdict: Verdict;
  message: string;
}

export const PLACES = ["Ten-thousands", "Thousands", "Hundreds", "Tens", "Ones"] as const;
const PLACE_VALUES = [10_000, 1_000, 100, 10, 1] as const;

// ---- working out the right response from the parameters -------------------------------------------------------

/** Round half up, as taught ("look at the next digit; 5 or more rounds up"). */
export const roundTo = (value: number, nearest: number) => Math.floor((value + nearest / 2) / nearest) * nearest;

const sum = (terms: readonly number[]) => terms.reduce((a, b) => a + b, 0);

/** The place value of the only occurrence of `digit` in `number`, e.g. the 7 in 57,219 is worth 7,000. */
export function valueOfDigit(number: number, digit: number): number {
  const s = String(number);
  const hits = [...s].flatMap((c, i) => (Number(c) === digit ? [i] : []));
  if (hits.length !== 1) throw new Error(`Digit ${digit} must appear exactly once in ${number}`);
  return digit * 10 ** (s.length - 1 - hits[0]);
}

export const expandedParts = (number: number): number[] => PLACE_VALUES.map((p) => (Math.floor(number / p) % 10) * p);

export function expectedNumber(rule: NumberRule): number[] {
  switch (rule.rule) {
    case "valueOfDigit":
      return [valueOfDigit(rule.number, rule.digit)];
    case "roundTo":
      return [roundTo(rule.value, rule.nearest)];
    case "sum":
      return [sum(rule.terms)];
    case "estimateSum":
      // Any sensible rounding is a valid estimate; the question says which roundings it allows.
      return rule.nearest.map((n) => sum(rule.terms.map((t) => roundTo(t, n))));
  }
}

const fmt = (n: number) => n.toLocaleString("en-US");

export const choiceOptions = (rule: ChoiceRule): readonly string[] =>
  rule.rule === "larger" ? [fmt(rule.a), fmt(rule.b)] : rule.rule === "compare" ? ["<", ">", "="] : ["Yes", "No"];

export function expectedChoice(rule: ChoiceRule): string {
  switch (rule.rule) {
    case "larger":
      return fmt(Math.max(rule.a, rule.b));
    case "compare":
      return rule.a < rule.b ? "<" : rule.a > rule.b ? ">" : "=";
    case "withinBudget":
      return sum(rule.terms) <= rule.budget ? "Yes" : "No";
    case "claimIsCorrect":
      return sum(rule.terms) === rule.claimed ? "Yes" : "No";
  }
}

// ---- checking a response --------------------------------------------------------------------------------------

const ok = (message: string): Outcome => ({ verdict: "correct", message });
const no = (message: string): Outcome => ({ verdict: "incorrect", message });

/** A nudge about the kind of slip, never the answer. */
function numberSlip(rule: NumberRule, given: number, expected: number[]): string {
  const target = expected[0];
  if (rule.rule === "valueOfDigit" && given === rule.digit) return "You wrote the digit itself. The value depends on which column the digit is in.";
  if (given === target * 10 || given * 10 === target) return "Check the column again: your answer is ten times too big or too small.";
  if (rule.rule === "roundTo" || rule.rule === "estimateSum") return "Look at the digit just to the right of the place you are rounding to. Does it tell you to round up or stay?";
  if (rule.rule === "sum" && Math.abs(given - target) % 10 === 0 && Math.abs(given - target) <= 1000) return "You are close. Check your regrouping (carrying) in one column.";
  return "Not yet. Check each step again.";
}

export function checkNumber(item: NumberItem, given: number): Outcome {
  const expected = expectedNumber(item.rule);
  return expected.includes(given) ? ok("Yes. That is right.") : no(numberSlip(item.rule, given, expected));
}

export function checkChoice(item: ChoiceItem, chosen: string): Outcome {
  return chosen === expectedChoice(item.rule) ? ok("Yes. That is right.") : no("Not yet. Work it out with numbers first, then choose again.");
}

/** Says which place-value boxes are not right, so the child can fix them without being told the values. */
export function checkParts(item: PartsItem, boxes: readonly (number | null)[]): Outcome & { wrongPlaces: number[] } {
  const want = expandedParts(item.number);
  const wrongPlaces = want.flatMap((w, i) => (boxes[i] === w ? [] : [i]));
  if (wrongPlaces.length === 0) return { ...ok("Yes. The parts add back to the whole number."), wrongPlaces };
  const names = wrongPlaces.map((i) => PLACES[i]).join(", ");
  return { ...no(`Check the ${names} ${wrongPlaces.length > 1 ? "boxes" : "box"}. Each box holds the VALUE of that column, not just the digit.`), wrongPlaces };
}

export function checkOrder(item: OrderItem, given: readonly number[]): Outcome {
  const key = (xs: readonly number[]) => [...xs].sort((a, b) => a - b).join();
  if (given.length !== item.numbers.length || key(given) !== key(item.numbers)) {
    return no(`Use each of the ${item.numbers.length} numbers once, separated by commas.`);
  }
  const sorted = [...item.numbers].sort((a, b) => a - b);
  return given.every((g, i) => g === sorted[i]) ? ok("Yes. They are in order from least to greatest.") : no("Not yet. Compare the highest place value first, then move right.");
}

export function checkBetween(item: BetweenItem, given: readonly number[]): Outcome {
  if (given.length !== item.count || new Set(given).size !== item.count) return no(`Write ${item.count} different amounts.`);
  const bad = given.filter((g) => !(g > item.low && g < item.high));
  return bad.length === 0 ? ok("Yes. Both amounts fit between the two prices.") : no("Not yet. Each amount must be larger than the first number and smaller than the second.");
}

// ---- typed input ----------------------------------------------------------------------------------------------

export type Parsed = { ok: true; value: number } | { ok: false; message: string };

/** Accepts "7000", "7,000" and "7 000". Rejects decimals, negatives and text with a kind message. */
export function parseAmount(raw: string): Parsed {
  const t = raw.trim().replace(/[,\s]/g, "");
  if (t === "") return { ok: false, message: "Type a number first." };
  if (!/^\d+$/.test(t)) return { ok: false, message: "Use digits only, for example 7500. Leave out UGX and any words." };
  if (t.length > 9) return { ok: false, message: "That number is too long for this question." };
  return { ok: true, value: Number(t) };
}

/** Splits on semicolons or new lines, and on commas that are not thousands separators ("9,200, 8,950"). */
export function parseList(raw: string): { ok: true; values: number[] } | { ok: false; message: string } {
  const text = raw.trim();
  if (text === "") return { ok: false, message: "Type your numbers first, separated by spaces or semicolons." };
  const pieces = text.split(/[;\n]+|,\s+|\s+/).filter(Boolean);
  const values: number[] = [];
  for (const p of pieces) {
    const r = parseAmount(p);
    if (!r.ok) return { ok: false, message: "Write numbers only, with a space between them, like 9,200 8,950." };
    values.push(r.value);
  }
  return { ok: true, values };
}

/** Every leaf item (a group's parts count; the group itself does not). */
export const leaves = (items: readonly Item[]): Leaf[] => items.flatMap((i) => (i.kind === "group" ? leaves(i.parts) : [i]));
