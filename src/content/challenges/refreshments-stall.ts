import type { Scenario } from "@/types/challenge";

/**
 * Original YPS activity (not taken from any assessment form). Fictional scenario, fictional prices.
 * Practises Foundation Weeks 1, 2, 10 and 11. Changing any number here changes the reference answers,
 * which are computed from this data and verified in tests/unit/stall-challenge.test.ts.
 */
export const REFRESHMENTS_STALL: Scenario = {
  id: "yps.challenge.refreshments-stall",
  version: "1.0.0",
  title: "The School Fair Refreshments Stall",
  ageRange: "9–12",
  duration: "about 15 minutes (estimate)",
  weekIds: ["foundation.w01", "foundation.w02", "foundation.w10", "foundation.w11"],
  budget: 100_000,
  stallFee: 15_000,
  reserveTarget: 10_000,
  maxPerProduct: 200,
  soldFraction: { numerator: 3, denominator: 4 },
  products: [
    { id: "juice", name: "Fruit juice", unit: "cup", buy: 1_200, sell: 1_800 },
    { id: "samosa", name: "Samosa", unit: "samosa", buy: 400, sell: 700 },
    { id: "water", name: "Bottled water", unit: "bottle", buy: 700, sell: 1_000 },
    { id: "cake", name: "Cake slice", unit: "slice", buy: 1_500, sell: 2_500 },
  ],
  estimateOrder: [
    { productId: "juice", quantity: 40 },
    { productId: "samosa", quantity: 60 },
  ],
  estimateTolerance: 0.2,
};

export const STALL_OBJECTIVES = [
  "Estimate a total before calculating, and judge whether an answer makes sense (Week 1).",
  "Keep track of a budget, including a fixed cost and a reserve (Week 2).",
  "Work out cost, revenue and surplus from quantities and unit prices (Week 11).",
  "Use a fraction of a quantity to test a plan (Week 10).",
  "Explain a decision using numbers as evidence (all weeks).",
] as const;

export const STALL_ASSUMPTIONS = [
  "Everything here is made up: the fair, the supplier and every price.",
  "You pay the supplier for everything you buy, whether or not it sells.",
  "The stall fee is paid once, before the fair starts.",
  "Surplus means the money you take in (revenue) minus all the money you spent (cost). If it is negative, it is called a shortfall.",
  "You can only sell whole items, so we round down when taking a fraction of a quantity.",
] as const;

export const ADULT_MEASURES = [
  "Whether a child can estimate, calculate and keep track of money in a multi-step problem.",
  "Whether they connect numbers to a decision and give a reason that matches their own plan.",
] as const;

export const ADULT_DOES_NOT_MEASURE = [
  "Overall ability, intelligence or readiness for school. It is a single short activity.",
  "Anything recorded or scored: answers stay in this browser tab and are never sent or saved.",
  "Teamwork, speaking, or independent working habits, which the programme assesses in person.",
] as const;
