import { describe, expect, it } from "vitest";
import { computeBudget, formatUgx } from "@/lib/budgeting";
import { BUDGET, EXTRAS, FIXED_COSTS } from "@/content/challenge";

describe("computeBudget", () => {
  it("leaves UGX 8,000 with no extras (25,000 − 3,000 − 14,000)", () => {
    const r = computeBudget(25_000, FIXED_COSTS, []);
    expect(r.remaining).toBe(8_000);
    expect(r.withinBudget).toBe(true);
    expect(r.calculation).toBe("25,000 − 3,000 − 14,000 = 8,000");
  });

  it("stays within budget when extras exactly use the remainder", () => {
    const r = computeBudget(25_000, FIXED_COSTS, [{ id: "a", label: "a", amount: 8_000 }]);
    expect(r.remaining).toBe(0);
    expect(r.withinBudget).toBe(true);
  });

  it("goes over budget and shows a negative remainder", () => {
    const r = computeBudget(25_000, FIXED_COSTS, EXTRAS);
    expect(r.extrasTotal).toBe(9_000);
    expect(r.remaining).toBe(-1_000);
    expect(r.withinBudget).toBe(false);
    expect(r.calculation).toBe("25,000 − 3,000 − 14,000 − 9,000 = −1,000");
  });

  it("rejects negative or fractional amounts", () => {
    expect(() => computeBudget(25_000, [{ id: "x", label: "x", amount: -1 }], [])).toThrow(RangeError);
    expect(() => computeBudget(25_000, [], [{ id: "x", label: "x", amount: 1.5 }])).toThrow(RangeError);
    expect(() => computeBudget(-5, [], [])).toThrow(RangeError);
  });

  it("content constants match the documented example", () => {
    expect(BUDGET).toBe(25_000);
    expect(FIXED_COSTS.map((i) => i.amount)).toEqual([3_000, 14_000]);
  });
});

describe("formatUgx", () => {
  it("formats positive, zero and negative amounts", () => {
    expect(formatUgx(8_000)).toBe("UGX 8,000");
    expect(formatUgx(0)).toBe("UGX 0");
    expect(formatUgx(-1_000)).toBe("−UGX 1,000");
  });
});
