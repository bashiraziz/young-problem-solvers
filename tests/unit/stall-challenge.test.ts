import { describe, expect, it } from "vitest";
import { REFRESHMENTS_STALL as S } from "@/content/challenges/refreshments-stall";
import { explainParseError, parseWholeNumber } from "@/lib/challenge/parse";
import {
  buildCalcQuestions,
  checkCalcAnswer,
  checkEstimate,
  estimateGuidance,
  evaluatePlan,
  exactOrderCost,
  friendlyNumber,
  planIssues,
  reasonEvidence,
  soldCount,
} from "@/lib/challenge/stall";
import { formatNumber, formatUgx } from "@/lib/formatters";

// Reference values below are worked out by hand, independently of the implementation:
//   40 juice × 1,200 = 48,000 · 60 samosas × 400 = 24,000 · orders = 72,000
//   100,000 − 72,000 − 15,000 stall fee = 13,000 left

describe("parseWholeNumber", () => {
  it("accepts plain numbers and thousands separators", () => {
    for (const [input, value] of [
      ["48000", 48000],
      ["48,000", 48000],
      ["48 000", 48000],
      ["  72000  ", 72000],
      ["0", 0],
      ["0048", 48],
    ] as const) {
      expect(parseWholeNumber(input)).toEqual({ ok: true, value });
    }
  });

  it("rejects empty, negative, decimal, non-numeric and oversized input", () => {
    expect(parseWholeNumber("")).toEqual({ ok: false, reason: "empty" });
    expect(parseWholeNumber("   ")).toEqual({ ok: false, reason: "empty" });
    expect(parseWholeNumber("-5")).toEqual({ ok: false, reason: "negative" });
    expect(parseWholeNumber("−5")).toEqual({ ok: false, reason: "negative" });
    expect(parseWholeNumber("4.5")).toEqual({ ok: false, reason: "decimal" });
    expect(parseWholeNumber("4.")).toEqual({ ok: false, reason: "decimal" });
    expect(parseWholeNumber(".5")).toEqual({ ok: false, reason: "decimal" });
    for (const bad of ["abc", "1e5", "12a", "UGX 5", "٤٨", "0x10", "1,2,x"]) {
      expect(parseWholeNumber(bad), bad).toEqual({ ok: false, reason: "not-a-number" });
    }
    expect(parseWholeNumber("99999999999999")).toEqual({ ok: false, reason: "too-large" });
    expect(parseWholeNumber("201", 200)).toEqual({ ok: false, reason: "too-large" });
    expect(parseWholeNumber("200", 200)).toEqual({ ok: true, value: 200 });
  });

  it("gives a child-friendly message for every error", () => {
    for (const r of ["empty", "negative", "decimal", "not-a-number", "too-large"] as const) {
      expect(explainParseError(r).length).toBeGreaterThan(10);
    }
  });
});

describe("estimate", () => {
  it("exact cost of the estimate order is UGX 72,000", () => {
    expect(exactOrderCost(S, S.estimateOrder)).toBe(72_000);
  });

  it("accepts estimates within 20% (inclusive) and explains the band", () => {
    expect(checkEstimate(S, 70_000)).toMatchObject({ verdict: "reasonable", lower: 57_600, upper: 86_400, exact: 72_000 });
    for (const ok of [57_600, 60_000, 72_000, 80_000, 86_400]) expect(checkEstimate(S, ok).verdict).toBe("reasonable");
  });

  it("flags estimates that are too low or too high", () => {
    for (const low of [57_599, 30_000, 0]) expect(checkEstimate(S, low).verdict).toBe("too-low");
    for (const high of [86_401, 100_000]) expect(checkEstimate(S, high).verdict).toBe("too-high");
  });
});

describe("estimate guidance", () => {
  it("rounds to friendly numbers", () => {
    expect([1_200, 400, 700, 480, 9, 15_000, 1_500].map(friendlyNumber)).toEqual([1_000, 400, 700, 500, 9, 20_000, 2_000]);
  });

  it("the worked example is itself a reasonable estimate and the hints show the arithmetic", () => {
    const g = estimateGuidance(S);
    expect(g.sampleEstimate).toBe(64_000); // 40 × 1,000 + 60 × 400
    expect(checkEstimate(S, g.sampleEstimate).verdict).toBe("reasonable");
    expect(g.hints[2]).toContain("40 × 1,000 = 40,000");
    expect(g.hints[2]).toContain("60 × 400 = 24,000");
    expect(g.hints[2]).not.toContain("72,000"); // never reveals the exact total
  });
});

describe("calculation questions", () => {
  const qs = buildCalcQuestions(S);

  it("reference answers are 48,000 · 24,000 · 72,000 · 13,000", () => {
    expect(qs.map((q) => q.answer)).toEqual([48_000, 24_000, 72_000, 13_000]);
  });

  it("marks exact answers correct and explains why", () => {
    for (const q of qs) {
      const r = checkCalcAnswer(q, q.answer);
      expect(r.status).toBe("correct");
      expect(r.message.length).toBeGreaterThan(10);
    }
  });

  it("every question has three non-empty graduated hints, and the last reveals the worked step", () => {
    for (const q of qs) {
      expect(q.hints).toHaveLength(3);
      for (const h of q.hints) expect(h.length).toBeGreaterThan(10);
      expect(q.hints[2]).toContain(q.answer.toLocaleString("en-US"));
    }
  });

  it("diagnoses specific mistakes", () => {
    const [juice, , stock, left] = qs;
    expect(checkCalcAnswer(juice, 1_240).message).toMatch(/adding/i); // 40 + 1,200
    expect(checkCalcAnswer(juice, 4_800).message).toMatch(/zeros/i);
    expect(checkCalcAnswer(juice, 480_000).message).toMatch(/zeros/i);
    expect(checkCalcAnswer(stock, 48_000).message).toMatch(/only the first order/i);
    expect(checkCalcAnswer(stock, 24_000).message).toMatch(/only the second order/i);
    expect(checkCalcAnswer(left, 28_000).message).toMatch(/stall fee/i);
    expect(checkCalcAnswer(left, 85_000).message).toMatch(/orders/i);
  });

  it("falls back to a direction cue for other wrong answers", () => {
    const [juice] = qs;
    expect(checkCalcAnswer(juice, 50_000).status).toBe("incorrect");
    expect(checkCalcAnswer(juice, 50_000).message).toMatch(/more than/i);
    expect(checkCalcAnswer(juice, 40_000).message).toMatch(/less than/i);
    expect(checkCalcAnswer(juice, 0).status).toBe("incorrect");
  });
});

describe("evaluatePlan", () => {
  // 30 juice, 40 samosas, 30 water
  const mid = evaluatePlan(S, { juice: 30, samosa: 40, water: 30 });

  it("computes cost, revenue and surplus (reference values by hand)", () => {
    expect(mid.stockCost).toBe(73_000); // 36,000 + 16,000 + 21,000
    expect(mid.totalCost).toBe(88_000);
    expect(mid.moneyLeft).toBe(12_000);
    expect(mid.withinBudget).toBe(true);
    expect(mid.revenueAll).toBe(112_000); // 54,000 + 28,000 + 30,000
    expect(mid.surplusAll).toBe(24_000);
    expect(mid.totalUnits).toBe(100);
    expect(mid.productsUsed).toBe(3);
    expect(mid.averageMargin).toBe(390);
  });

  it("applies the 3-out-of-4 scenario, rounding down whole items", () => {
    expect(soldCount(S, 30)).toBe(22);
    expect(soldCount(S, 40)).toBe(30);
    expect(soldCount(S, 1)).toBe(0);
    expect(soldCount(S, 0)).toBe(0);
    expect(mid.revenueScenario).toBe(82_600); // 22×1,800 + 30×700 + 22×1,000
    expect(mid.surplusScenario).toBe(-5_400);
  });

  it("handles a cake-heavy plan", () => {
    const p = evaluatePlan(S, { cake: 50, juice: 5 });
    expect(p.stockCost).toBe(81_000);
    expect(p.totalCost).toBe(96_000);
    expect(p.moneyLeft).toBe(4_000);
    expect(p.revenueAll).toBe(134_000);
    expect(p.surplusAll).toBe(38_000);
    expect(p.revenueScenario).toBe(97_900); // 37×2,500 + 3×1,800
    expect(p.surplusScenario).toBe(1_900);
  });

  it("treats spending exactly the budget as within budget, and going over as over", () => {
    const exact = evaluatePlan(S, { cake: 50, juice: 5, samosa: 10 });
    expect(exact.totalCost).toBe(100_000);
    expect(exact.moneyLeft).toBe(0);
    expect(exact.withinBudget).toBe(true);
    expect(planIssues(S, exact)).toEqual([]);

    const over = evaluatePlan(S, { cake: 50, juice: 5, samosa: 11 });
    expect(over.totalCost).toBe(100_400);
    expect(over.withinBudget).toBe(false);
    expect(planIssues(S, over)[0].message).toContain("UGX 400");
  });

  it("flags empty and single-product plans", () => {
    expect(planIssues(S, evaluatePlan(S, {})).map((i) => i.id)).toEqual(["no-items"]);
    expect(planIssues(S, evaluatePlan(S, { water: 10 })).map((i) => i.id)).toEqual(["too-few-products"]);
  });

  it("an empty plan costs only the stall fee", () => {
    const empty = evaluatePlan(S, {});
    expect(empty.totalCost).toBe(15_000);
    expect(empty.averageMargin).toBe(0);
    expect(empty.surplusAll).toBe(-15_000);
  });

  it("rejects invalid quantities", () => {
    expect(() => evaluatePlan(S, { juice: -1 })).toThrow(RangeError);
    expect(() => evaluatePlan(S, { juice: 1.5 })).toThrow(RangeError);
    expect(() => evaluatePlan(S, { juice: 201 })).toThrow(RangeError);
    expect(() => evaluatePlan(S, { juice: Number.NaN })).toThrow(RangeError);
    expect(evaluatePlan(S, { juice: 200 }).stockCost).toBe(240_000);
  });
});

describe("reasonEvidence", () => {
  const mid = evaluatePlan(S, { juice: 30, samosa: 40, water: 30 });
  const cake = evaluatePlan(S, { cake: 50, juice: 5 });

  it("checks each reason against the child's own numbers", () => {
    const r = Object.fromEntries(
      reasonEvidence(S, mid, ["within-budget", "reserve", "surplus", "safe-three-quarters", "choice", "margin"]).map((e) => [e.id, e]),
    );
    expect(r["within-budget"].supported).toBe(true);
    expect(r.reserve.supported).toBe(true); // 12,000 ≥ 10,000
    expect(r.surplus.supported).toBe(true);
    expect(r["safe-three-quarters"].supported).toBe(false); // −5,400
    expect(r["safe-three-quarters"].message).toContain("shortfall");
    expect(r.choice.supported).toBe(true);
    expect(r.margin.supported).toBe(false); // 390 < 550
    expect(r.margin.message).toContain("UGX 390");
    expect(r.margin.message).toContain("UGX 550");
  });

  it("reflects a different plan differently", () => {
    const r = Object.fromEntries(reasonEvidence(S, cake, ["reserve", "safe-three-quarters", "choice", "margin"]).map((e) => [e.id, e]));
    expect(r.reserve.supported).toBe(false); // 4,000 < 10,000
    expect(r["safe-three-quarters"].supported).toBe(true); // +1,900
    expect(r.choice.supported).toBe(false); // 2 products
    expect(r.margin.supported).toBe(true);
  });

  it("uses the Workbook word 'shortfall' for a negative surplus and says 'break even' at zero", () => {
    // 20 juice × 600 + 10 samosas × 300 = 15,000 margin = the stall fee, so surplus is exactly 0.
    const even = evaluatePlan(S, { juice: 20, samosa: 10 });
    expect(even.surplusAll).toBe(0);
    const [e] = reasonEvidence(S, even, ["surplus"]);
    expect(e.supported).toBe(false);
    expect(e.message).toMatch(/break even/i);

    const short = evaluatePlan(S, { juice: 5, samosa: 5 });
    expect(short.surplusAll).toBe(-10_500);
    const [f] = reasonEvidence(S, short, ["surplus"]);
    expect(f.supported).toBe(false);
    expect(f.message).toContain("shortfall");
    expect(f.message).toContain("−UGX 10,500");
  });

  it("returns nothing when no reason is picked", () => {
    expect(reasonEvidence(S, mid, [])).toEqual([]);
  });
});

describe("formatters", () => {
  it("formats UGX and plain numbers", () => {
    expect(formatUgx(8_000)).toBe("UGX 8,000");
    expect(formatUgx(0)).toBe("UGX 0");
    expect(formatUgx(-1_000)).toBe("−UGX 1,000");
    expect(formatNumber(1_234_567)).toBe("1,234,567");
    expect(formatNumber(-5)).toBe("−5");
  });
});
