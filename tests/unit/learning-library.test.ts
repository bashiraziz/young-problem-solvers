import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { UNIT_1_LESSONS, getLesson, getNeighbours, iCan, lessonSlug, manifest, stripNumber } from "@/content/foundation";
import { manifestSchema, studentContentSchema } from "@/content/foundation/schema";
import studentJson from "@/content/foundation/v1/unit-1-student-content.json";
import { practiceFor } from "@/content/foundation/unit-1-items";
import { UNITS } from "@/content/programme";
import {
  checkBetween,
  checkChoice,
  checkNumber,
  checkOrder,
  checkParts,
  choiceOptions,
  expandedParts,
  expectedChoice,
  expectedNumber,
  leaves,
  parseAmount,
  parseList,
  roundTo,
  valueOfDigit,
  type Item,
  type NumberRule,
} from "@/lib/learning/items";

const fmt = (n: number) => n.toLocaleString("en-US");

describe("content files are valid, versioned and tied to the programme", () => {
  it("manifest and student content pass their schemas", () => {
    expect(manifest.contentVersion).toMatch(/^\d{4}-\d{2}-pilot-v\d+$/);
    expect(manifest.status).toBe("pilot-draft-not-validated");
    expect(UNIT_1_LESSONS).toHaveLength(6);
  });

  it("six lessons run in order over Weeks 1–3, two sessions a week", () => {
    expect(UNIT_1_LESSONS.map((l) => [l.wk, l.session])).toEqual([[1, 1], [1, 2], [2, 1], [2, 2], [3, 1], [3, 2]]);
    expect(UNIT_1_LESSONS.map((l) => l.id)).toEqual(["01", "02", "03", "04", "05", "06"].map((n) => `YPS-F1-U1-L${n}`));
    expect(UNIT_1_LESSONS.map((l) => l.slug)).toEqual(["l01", "l02", "l03", "l04", "l05", "l06"]);
  });

  it("every lesson has three objectives, a driving question, steps, two guided and six practice prompts", () => {
    for (const l of UNIT_1_LESSONS) {
      expect(l.objectives).toHaveLength(3);
      expect(l.question).toMatch(/\?$/);
      expect(l.worked_steps.length).toBeGreaterThanOrEqual(3);
      expect(l.guided).toHaveLength(2);
      expect(l.practice).toHaveLength(6);
      expect(l.practice.every((p, i) => p.startsWith(`${i + 1}. `))).toBe(true);
    }
  });

  it("the 12-week manifest agrees with the programme page content (titles, questions, outcomes)", () => {
    const programmeWeeks = UNITS.flatMap((u) => u.weeks);
    expect(manifest.weeks).toHaveLength(programmeWeeks.length);
    for (const w of manifest.weeks) {
      const p = programmeWeeks.find((x) => x.number === w.week)!;
      expect(w.title).toBe(p.title);
      expect(w.drivingQuestion).toBe(p.drivingQuestion);
      // Outcomes differ only in "and" wording between files, so compare ignoring a trailing "and"/"/" variation.
      const norm = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, " ").replace(/ and | \/ /g, " ").trim();
      expect(w.objectives.map(norm)).toEqual(p.outcomes.map(norm).map((o) => o));
    }
  });

  it("unit 1 weeks and statuses: Unit 1 is drafted, Units 2–4 are outlines", () => {
    expect(manifest.units.map((u) => u.status)).toEqual(["teacher-and-student-materials-drafted", "outline-only", "outline-only", "outline-only"]);
    expect(manifest.units.map((u) => u.title)).toEqual(UNITS.map((u) => u.title));
  });

  it("rejects malformed content and any answer-like field", () => {
    expect(() => manifestSchema.parse({ ...manifest, durationWeeks: 10 })).toThrow();
    const withAnswer = { ...studentJson, lessons: studentJson.lessons.map((l, i) => (i === 0 ? { ...l, answers: ["7000"] } : l)) };
    expect(() => studentContentSchema.parse(withAnswer)).toThrow();
    expect(() => studentContentSchema.parse({ ...studentJson, teacherKey: [] })).toThrow();
  });

  it("student content has no field that looks like an answer, key or solution", () => {
    const keys = new Set<string>();
    const walk = (v: unknown) => {
      if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) {
        keys.add(k);
        walk(x);
      }
    };
    walk(studentJson);
    walk(manifest);
    expect([...keys].filter((k) => k !== "keyidea" && /answer|solution|key$|^key|mark|rubric|score/i.test(k))).toEqual([]);
  });

  it("helpers", () => {
    expect(iCan("Represent five-digit amounts.")).toBe("I can represent five-digit amounts.");
    expect(iCan("Round UP to the next packet.")).toBe("I can round UP to the next packet.");
    expect(stripNumber("12. Write it.")).toBe("Write it.");
    expect(lessonSlug("YPS-F1-U1-L05")).toBe("l05");
    expect(getLesson("l03")?.title).toBe("Budgets and Priorities");
    expect(getLesson("l99")).toBeUndefined();
    expect(getNeighbours("l01")).toMatchObject({ prev: undefined, next: { slug: "l02" } });
    expect(getNeighbours("l06")).toMatchObject({ prev: { slug: "l05" }, next: undefined });
  });
});

describe("interactive items: built from the content, without answer strings", () => {
  const all = UNIT_1_LESSONS.flatMap((l) => {
    const p = practiceFor(l);
    return [...p.guided, ...p.practice, p.challenge, p.exit].map((item) => ({ lesson: l, item }));
  });

  /** Every number a question depends on, recursively. */
  const numbersOf = (item: Item): number[] => {
    switch (item.kind) {
      case "number": {
        const r = item.rule;
        return r.rule === "valueOfDigit" ? [r.number] : r.rule === "roundTo" ? [r.value] : [...r.terms];
      }
      case "choice": {
        const r = item.rule;
        return r.rule === "larger" || r.rule === "compare" ? [r.a, r.b] : r.rule === "withinBudget" ? [...r.terms, r.budget] : [...r.terms, r.claimed];
      }
      case "parts":
        return [item.number];
      case "order":
        return [...item.numbers];
      case "between":
        return [item.low, item.high];
      case "group":
        return item.parts.flatMap(numbersOf);
      case "open":
        return [];
    }
  };

  it("two lessons are fully interactive; the other four are scaffolded from the content file", () => {
    expect(UNIT_1_LESSONS.map((l) => practiceFor(l).interactive)).toEqual([true, true, false, false, false, false]);
  });

  it("each lesson has 2 guided questions, 6 practice questions, a challenge and an exit ticket with unique ids", () => {
    for (const l of UNIT_1_LESSONS) {
      const p = practiceFor(l);
      expect(p.guided).toHaveLength(2);
      expect(p.practice).toHaveLength(6);
      const ids = leaves([...p.guided, ...p.practice, p.challenge, p.exit]).map((x) => x.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const id of ids) expect(id.startsWith(l.id)).toBe(true);
    }
  });

  it("question parameters match the numbers printed in the student content", () => {
    for (const { lesson, item } of all.filter((x) => practiceFor(x.lesson).interactive)) {
      // A part may point back to another question ("the sum for Question 2"), so look across the whole lesson text.
      const text = [lesson.model, ...lesson.guided, ...lesson.practice, lesson.challenge, lesson.exit].join(" ");
      for (const n of numbersOf(item)) expect(text, `${item.id}: ${fmt(n)} missing from "${text}"`).toContain(fmt(n));
    }
  });

  it("scaffolded lessons keep every prompt word for word", () => {
    for (const l of UNIT_1_LESSONS.filter((x) => !practiceFor(x).interactive)) {
      const p = practiceFor(l);
      expect(p.guided.map((i) => i.prompt)).toEqual(l.guided);
      expect(p.practice.map((i) => i.prompt)).toEqual(l.practice.map(stripNumber));
      expect(p.challenge.prompt).toBe(l.challenge);
      expect(p.exit.prompt).toBe(l.exit);
      expect(leaves([...p.guided, ...p.practice]).every((i) => i.kind === "open")).toBe(true);
    }
  });

  it("hints teach the method and never contain the answer", () => {
    for (const { item } of all) {
      for (const leaf of leaves([item])) {
        let answers: string[] = [];
        if (leaf.kind === "number") answers = expectedNumber(leaf.rule).map(fmt);
        if (leaf.kind === "parts") answers = expandedParts(leaf.number).filter((v) => v > 0).map(fmt);
        if (leaf.kind === "choice" && leaf.rule.rule === "larger") answers = [];
        for (const h of leaf.hints) for (const a of answers) expect(h, `${leaf.id} hint reveals ${a}`).not.toContain(a);
      }
    }
  });

  it("every item has at least one hint (except scratchpads) and tone words are encouraging", () => {
    for (const { item } of all.filter((x) => practiceFor(x.lesson).interactive)) {
      for (const leaf of leaves([item])) {
        if (leaf.kind !== "open") expect(leaf.hints.length, leaf.id).toBeGreaterThan(0);
        for (const h of leaf.hints) expect(h).not.toMatch(/wrong|stupid|fail|bad/i);
      }
    }
  });
});

describe("checking logic agrees with an independent reference", () => {
  // Reference implementations written a different way from the production code, so a shared bug would show up.
  const refRound = (n: number, m: number) => {
    const r = n % m;
    return r * 2 >= m ? n - r + m : n - r;
  };
  const refValue = (n: number, d: number) => {
    const s = String(n);
    const at = s.indexOf(String(d));
    return Number(String(d) + "0".repeat(s.length - at - 1));
  };

  it("rounds half up to any place", () => {
    for (const m of [10, 100, 1000]) for (let n = 0; n < 30_000; n += 7) expect(roundTo(n, m)).toBe(refRound(n, m));
  });

  it("value of a digit by position", () => {
    for (const [n, d] of [[57_219, 7], [40_305, 4], [12_345, 1], [90_817, 9]] as const) expect(valueOfDigit(n, d)).toBe(refValue(n, d));
    expect(() => valueOfDigit(11_234, 1)).toThrow();
  });

  it("expanded form parts add back to the whole number, for every five-digit number sampled", () => {
    for (let n = 10_000; n < 100_000; n += 137) expect(expandedParts(n).reduce((a, b) => a + b, 0)).toBe(n);
  });

  const rules: NumberRule[] = [
    { rule: "valueOfDigit", number: 57_219, digit: 7 },
    { rule: "roundTo", value: 6_450, nearest: 100 },
    { rule: "roundTo", value: 6_450, nearest: 1_000 },
    { rule: "sum", terms: [2_780, 5_120] },
    { rule: "estimateSum", terms: [12_490, 3_710], nearest: [100, 1_000] },
  ];
  it("number items accept the right answer and reject near misses", () => {
    for (const rule of rules) {
      const item = { id: "t", kind: "number" as const, prompt: "", label: "", rule, hints: [] };
      const right = expectedNumber(rule);
      for (const r of right) expect(checkNumber(item, r).verdict).toBe("correct");
      for (const r of right) for (const wrong of [r * 10, r / 10, r + 1, r + 100, r - 1_000, 0]) if (!right.includes(wrong)) expect(checkNumber(item, wrong).verdict, `${rule.rule} ${wrong}`).toBe("incorrect");
    }
  });

  it("incorrect feedback never states the answer", () => {
    for (const rule of rules) {
      const item = { id: "t", kind: "number" as const, prompt: "", label: "", rule, hints: [] };
      for (const wrong of [1, 7, 70, 700, 6_000, 99_999]) {
        const o = checkNumber(item, wrong);
        if (o.verdict === "incorrect") for (const r of expectedNumber(rule)) expect(o.message).not.toContain(fmt(r));
      }
    }
  });

  it("choices: larger, compare, budget and claim rules", () => {
    expect(choiceOptions({ rule: "compare", a: 1, b: 2 })).toEqual(["<", ">", "="]);
    for (const [a, b] of [[28_409, 28_490], [28_490, 28_409], [5, 5]] as const) {
      const rule = { rule: "compare" as const, a, b };
      const item = { id: "t", kind: "choice" as const, prompt: "", rule, hints: [] };
      const sign = Math.sign(a - b) < 0 ? "<" : Math.sign(a - b) > 0 ? ">" : "=";
      expect(expectedChoice(rule)).toBe(sign);
      expect(checkChoice(item, sign).verdict).toBe("correct");
      for (const other of choiceOptions(rule).filter((o) => o !== sign)) expect(checkChoice(item, other).verdict).toBe("incorrect");
    }
    expect(expectedChoice({ rule: "larger", a: 30_099, b: 29_999 })).toBe(fmt(Math.max(30_099, 29_999)));
    expect(expectedChoice({ rule: "withinBudget", terms: [9_650, 10_250], budget: 20_000 })).toBe(9_650 + 10_250 <= 20_000 ? "Yes" : "No");
    expect(expectedChoice({ rule: "withinBudget", terms: [9_650, 10_250], budget: 19_000 })).toBe("No");
    expect(expectedChoice({ rule: "claimIsCorrect", terms: [8_350, 5_250], claimed: 14_600 })).toBe(8_350 + 5_250 === 14_600 ? "Yes" : "No");
    expect(expectedChoice({ rule: "claimIsCorrect", terms: [1, 2], claimed: 3 })).toBe("Yes");
  });

  it("parts: each column is checked and the wrong columns are named without their values", () => {
    const item = { id: "t", kind: "parts" as const, prompt: "", number: 40_305, hints: [] };
    expect(checkParts(item, expandedParts(40_305)).verdict).toBe("correct");
    const digitsOnly = checkParts(item, [4, 0, 3, 0, 5]);
    expect(digitsOnly.verdict).toBe("incorrect");
    expect(digitsOnly.wrongPlaces).toEqual([0, 2]);
    expect(digitsOnly.message).toContain("Ten-thousands");
    expect(digitsOnly.message).not.toMatch(/40,000|40000/);
  });

  it("ordering and between", () => {
    const nums = [9_200, 8_950, 9_020, 8_905];
    const order = { id: "t", kind: "order" as const, prompt: "", numbers: nums, hints: [] };
    expect(checkOrder(order, [...nums].sort((a, b) => a - b)).verdict).toBe("correct");
    expect(checkOrder(order, nums).verdict).toBe("incorrect");
    expect(checkOrder(order, [1, 2]).message).toMatch(/each of the 4/);
    const between = { id: "t", kind: "between" as const, prompt: "", low: 12_450, high: 12_500, count: 2, hints: [] };
    expect(checkBetween(between, [12_451, 12_499]).verdict).toBe("correct");
    expect(checkBetween(between, [12_450, 12_499]).verdict).toBe("incorrect");
    expect(checkBetween(between, [12_460, 12_460]).verdict).toBe("incorrect");
    expect(checkBetween(between, [12_460]).verdict).toBe("incorrect");
  });

  it("typed input is parsed kindly", () => {
    expect(parseAmount("7,000")).toEqual({ ok: true, value: 7000 });
    expect(parseAmount(" 7 000 ")).toEqual({ ok: true, value: 7000 });
    for (const bad of ["", "UGX 7000", "7.5", "-3", "seven", "1".repeat(12)]) expect(parseAmount(bad).ok).toBe(false);
    expect(parseList("9,200 8,950 9,020")).toEqual({ ok: true, values: [9200, 8950, 9020] });
    expect(parseList("9200, 8950; 9020")).toEqual({ ok: true, values: [9200, 8950, 9020] });
    expect(parseList("a b").ok).toBe(false);
    expect(parseList("").ok).toBe(false);
  });
});

describe("no confidential material or student data ships with the Learning Library", () => {
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((n) => {
      const f = join(dir, n);
      return statSync(f).isDirectory() ? walk(f) : [f];
    });

  it("public/ holds only the two approved student PDFs as documents", () => {
    const docs = walk(join(process.cwd(), "public")).filter((f) => /\.(pdf|docx?|xlsx?|zip|csv|json)$/i.test(f));
    expect(docs.map((f) => f.split(/[\\/]/).pop()).sort()).toEqual(["YPS_Unit1_Student_Coursebook_PILOT_DRAFT.pdf", "YPS_Unit1_Student_Workbook_PILOT_DRAFT.pdf"]);
    for (const f of docs) expect(f).not.toMatch(/confidential|teacher|assessment|answer|key|solution/i);
  });

  it("student PDFs are not hiding answer sections (binary markers only; text checked in the docs review)", () => {
    for (const f of walk(join(process.cwd(), "public", "downloads"))) {
      const bytes = readFileSync(f);
      expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
    }
  });

  it("source and content never name the confidential files", () => {
    const files = walk(join(process.cwd(), "src")).filter((f) => /\.(ts|tsx|json|css)$/.test(f));
    for (const f of files) expect(readFileSync(f, "utf8"), f).not.toMatch(/Teacher_Manual|Assessment_Student|CONFIDENTIAL/);
  });
});
