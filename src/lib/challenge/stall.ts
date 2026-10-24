/**
 * Pure logic for the refreshments-stall challenge. No DOM, no storage, no network.
 * All reference answers are derived from the scenario data and verified in tests.
 */
import { formatNumber, formatUgx } from "@/lib/formatters";
import type { OrderLine, Product, Scenario } from "@/types/challenge";

const productOf = (s: Scenario, id: string): Product => {
  const p = s.products.find((x) => x.id === id);
  if (!p) throw new RangeError(`Unknown product: ${id}`);
  return p;
};

/* ───────────────────────────── Estimate ───────────────────────────── */

export function exactOrderCost(s: Scenario, lines: readonly OrderLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity * productOf(s, l.productId).buy, 0);
}

export type EstimateVerdict = "reasonable" | "too-low" | "too-high";

export interface EstimateResult {
  verdict: EstimateVerdict;
  lower: number;
  upper: number;
  exact: number;
}

/** An estimate is reasonable when it is within `estimateTolerance` of the exact cost (inclusive). */
export function checkEstimate(s: Scenario, estimate: number): EstimateResult {
  const exact = exactOrderCost(s, s.estimateOrder);
  const lower = Math.ceil(exact * (1 - s.estimateTolerance));
  const upper = Math.floor(exact * (1 + s.estimateTolerance));
  const verdict: EstimateVerdict = estimate < lower ? "too-low" : estimate > upper ? "too-high" : "reasonable";
  return { verdict, lower, upper, exact };
}

/** Rounds to one significant figure, e.g. 1,200 → 1,000 and 480 → 500. Used to model "friendly numbers". */
export function friendlyNumber(n: number): number {
  if (n < 10) return n;
  const unit = 10 ** (String(Math.round(n)).length - 1);
  return Math.round(n / unit) * unit;
}

export interface EstimateGuidance {
  /** Graduated hints: nudge → strategy → worked example. */
  hints: readonly [string, string, string];
  /** Total from rounding each price to a friendly number. */
  sampleEstimate: number;
}

export function estimateGuidance(s: Scenario): EstimateGuidance {
  const parts = s.estimateOrder.map((l) => {
    const p = productOf(s, l.productId);
    const friendly = friendlyNumber(p.buy);
    return { quantity: l.quantity, friendly, subtotal: l.quantity * friendly, name: p.name.toLowerCase(), price: p.buy };
  });
  const sampleEstimate = parts.reduce((n, x) => n + x.subtotal, 0);
  const first = parts[0];
  return {
    sampleEstimate,
    hints: [
      "You do not need the exact answer. Which prices could you round to friendlier numbers?",
      `Round ${formatUgx(first.price)} to ${formatUgx(first.friendly)} and think about ${first.quantity} × ${formatNumber(first.friendly)}. Then do the same for the other order.`,
      `${parts.map((x) => `${x.quantity} × ${formatNumber(x.friendly)} = ${formatNumber(x.subtotal)}`).join(" and ")}. Together that is about ${formatNumber(sampleEstimate)}.`,
    ],
  };
}

/* ───────────────────────────── Calculate ───────────────────────────── */

export interface CalcQuestion {
  id: string;
  prompt: string;
  answer: number;
  /** Graduated hints: nudge → strategy → worked step. */
  hints: readonly [string, string, string];
  /** Specific feedback for common wrong answers. */
  diagnoses: readonly { value: number; message: string }[];
  /** Explanation shown once answered or revealed. */
  why: string;
}

export function buildCalcQuestions(s: Scenario): CalcQuestion[] {
  const [a, b] = s.estimateOrder;
  const pa = productOf(s, a.productId);
  const pb = productOf(s, b.productId);
  const costA = a.quantity * pa.buy;
  const costB = b.quantity * pb.buy;
  const stock = costA + costB;
  const left = s.budget - stock - s.stallFee;

  return [
    {
      id: "cost-a",
      prompt: `${pa.name}: what do ${a.quantity} ${pa.unit}s cost at ${formatUgx(pa.buy)} each?`,
      answer: costA,
      hints: [
        `Each ${pa.unit} costs ${formatUgx(pa.buy)}. When you buy ${a.quantity} of them, which operation finds the total?`,
        `Try the digits first: ${a.quantity / 10} × ${pa.buy / 100} = ${(a.quantity / 10) * (pa.buy / 100)}. Then ask how many tens and hundreds you set aside.`,
        `${a.quantity} × ${formatNumber(pa.buy)} = ${formatNumber(costA)}.`,
      ],
      diagnoses: [
        { value: a.quantity + pa.buy, message: "That is what you get by adding. Buying many of the same item calls for multiplying." },
      ],
      why: `${a.quantity} equal groups of ${formatNumber(pa.buy)} means ${a.quantity} × ${formatNumber(pa.buy)} = ${formatNumber(costA)}.`,
    },
    {
      id: "cost-b",
      prompt: `${pb.name}: what do ${b.quantity} ${pb.unit}s cost at ${formatUgx(pb.buy)} each?`,
      answer: costB,
      hints: [
        `Same idea as before: ${b.quantity} items, each costing ${formatUgx(pb.buy)}.`,
        `Try ${b.quantity / 10} × ${pb.buy / 100} first, then fix the place value.`,
        `${b.quantity} × ${formatNumber(pb.buy)} = ${formatNumber(costB)}.`,
      ],
      diagnoses: [
        { value: b.quantity + pb.buy, message: "That is what you get by adding. Buying many of the same item calls for multiplying." },
      ],
      why: `${b.quantity} × ${formatNumber(pb.buy)} = ${formatNumber(costB)}.`,
    },
    {
      id: "stock",
      prompt: "What is the total cost of both orders together?",
      answer: stock,
      hints: [
        "You already know the cost of each order. How do you combine two amounts of money?",
        `Add the two costs: ${formatNumber(costA)} and ${formatNumber(costB)}. Try adding the thousands first.`,
        `${formatNumber(costA)} + ${formatNumber(costB)} = ${formatNumber(stock)}.`,
      ],
      diagnoses: [
        { value: costA, message: `That is only the first order. Remember to add the second order, ${formatUgx(costB)}.` },
        { value: costB, message: `That is only the second order. Remember to add the first order, ${formatUgx(costA)}.` },
      ],
      why: `Adding the two orders: ${formatNumber(costA)} + ${formatNumber(costB)} = ${formatNumber(stock)}. Check it a second way: it should be close to your estimate.`,
    },
    {
      id: "left",
      prompt: `You have ${formatUgx(s.budget)}. After paying for both orders and the ${formatUgx(s.stallFee)} stall fee, how much money is left?`,
      answer: left,
      hints: [
        "There are two things to take away from the budget. Did you take away both?",
        `Subtract the orders (${formatUgx(stock)}) and the stall fee (${formatUgx(s.stallFee)}) from ${formatUgx(s.budget)}. You can do it in two steps.`,
        `${formatNumber(s.budget)} − ${formatNumber(stock)} = ${formatNumber(s.budget - stock)}, then ${formatNumber(s.budget - stock)} − ${formatNumber(s.stallFee)} = ${formatNumber(left)}.`,
      ],
      diagnoses: [
        { value: s.budget - stock, message: "You took away the orders but not the stall fee. The fee must be paid too." },
        { value: s.budget - s.stallFee, message: "You took away the stall fee but not the orders." },
      ],
      why: `Money left = budget − orders − stall fee = ${formatNumber(s.budget)} − ${formatNumber(stock)} − ${formatNumber(s.stallFee)} = ${formatNumber(left)}.`,
    },
  ];
}

export type AnswerCheck =
  | { status: "correct"; message: string }
  | { status: "incorrect"; message: string };

export function checkCalcAnswer(q: CalcQuestion, value: number): AnswerCheck {
  if (value === q.answer) return { status: "correct", message: q.why };

  const known = q.diagnoses.find((d) => d.value === value);
  if (known) return { status: "incorrect", message: known.message };

  if (value * 10 === q.answer || value === q.answer * 10 || value * 100 === q.answer || value === q.answer * 100) {
    return {
      status: "incorrect",
      message: "Your digits look right, but check the zeros. Is each digit in the right place?",
    };
  }
  return {
    status: "incorrect",
    message: value > q.answer ? "That is more than the answer. Check each step again." : "That is less than the answer. Check each step again.",
  };
}

/* ───────────────────────────── Plan ───────────────────────────── */

export type Quantities = Readonly<Record<string, number>>;

export interface PlanLine {
  product: Product;
  quantity: number;
  cost: number;
  revenueAll: number;
  soldInScenario: number;
}

export interface PlanResult {
  lines: PlanLine[];
  stockCost: number;
  totalCost: number;
  moneyLeft: number;
  withinBudget: boolean;
  totalUnits: number;
  productsUsed: number;
  revenueAll: number;
  surplusAll: number;
  revenueScenario: number;
  surplusScenario: number;
  /** Surplus per item bought if everything sells, rounded to the nearest shilling. */
  averageMargin: number;
}

/** Whole items sold when only `numerator` out of every `denominator` sell (rounded down). */
export function soldCount(s: Scenario, quantity: number): number {
  const { numerator, denominator } = s.soldFraction;
  return Math.floor((quantity * numerator) / denominator);
}

export function evaluatePlan(s: Scenario, quantities: Quantities): PlanResult {
  const lines: PlanLine[] = s.products.map((product) => {
    const quantity = quantities[product.id] ?? 0;
    if (!Number.isInteger(quantity) || quantity < 0 || quantity > s.maxPerProduct) {
      throw new RangeError(`Invalid quantity for ${product.id}: ${quantity}`);
    }
    return {
      product,
      quantity,
      cost: quantity * product.buy,
      revenueAll: quantity * product.sell,
      soldInScenario: soldCount(s, quantity),
    };
  });

  const stockCost = lines.reduce((n, l) => n + l.cost, 0);
  const totalCost = stockCost + s.stallFee;
  const revenueAll = lines.reduce((n, l) => n + l.revenueAll, 0);
  const revenueScenario = lines.reduce((n, l) => n + l.soldInScenario * l.product.sell, 0);
  const totalUnits = lines.reduce((n, l) => n + l.quantity, 0);

  return {
    lines,
    stockCost,
    totalCost,
    moneyLeft: s.budget - totalCost,
    withinBudget: totalCost <= s.budget,
    totalUnits,
    productsUsed: lines.filter((l) => l.quantity > 0).length,
    revenueAll,
    surplusAll: revenueAll - totalCost,
    revenueScenario,
    surplusScenario: revenueScenario - totalCost,
    averageMargin: totalUnits === 0 ? 0 : Math.round((revenueAll - stockCost) / totalUnits),
  };
}

export interface PlanIssue {
  id: "no-items" | "too-few-products" | "over-budget";
  message: string;
}

/** A plan can be submitted only when this returns no issues. */
export function planIssues(s: Scenario, plan: PlanResult): PlanIssue[] {
  const issues: PlanIssue[] = [];
  if (plan.totalUnits === 0) {
    issues.push({ id: "no-items", message: "Choose some items to buy." });
  } else if (plan.productsUsed < 2) {
    issues.push({ id: "too-few-products", message: "Choose at least 2 different products so customers have a choice." });
  }
  if (!plan.withinBudget) {
    issues.push({
      id: "over-budget",
      message: `Over budget by ${formatUgx(plan.totalCost - s.budget)}. Buy less to stay within ${formatUgx(s.budget)}.`,
    });
  }
  return issues;
}

/* ───────────────────────────── Justify ───────────────────────────── */

export const REASON_IDS = ["within-budget", "reserve", "surplus", "safe-three-quarters", "choice", "margin"] as const;
export type ReasonId = (typeof REASON_IDS)[number];

export const REASON_LABELS: Record<ReasonId, string> = {
  "within-budget": "My plan stays within the budget.",
  reserve: "I kept some money back as a reserve.",
  surplus: "My plan makes a surplus if everything sells.",
  "safe-three-quarters": "My plan still makes a surplus if only 3 out of every 4 items sell.",
  choice: "I chose a mix of products so customers have a choice.",
  margin: "I bought more of the products that earn more surplus per item.",
};

export interface ReasonEvidence {
  id: ReasonId;
  supported: boolean;
  message: string;
}

/** Workbook vocabulary: a negative surplus is called a shortfall. */
function outcomeWord(surplus: number): string {
  return surplus < 0 ? "so the stall would have a shortfall" : "so there would be no surplus (you only break even)";
}

/** Checks each reason the child picked against the numbers of their own plan. */
export function reasonEvidence(s: Scenario, plan: PlanResult, picked: readonly ReasonId[]): ReasonEvidence[] {
  const productMargins = s.products.map((p) => p.sell - p.buy);
  const marginSum = productMargins.reduce((a, b) => a + b, 0);
  const marginTotal = plan.revenueAll - plan.stockCost;
  const simpleAverage = Math.round(marginSum / s.products.length);

  const checks: Record<ReasonId, () => { supported: boolean; message: string }> = {
    "within-budget": () => ({
      supported: plan.withinBudget,
      message: plan.withinBudget
        ? `Your numbers agree: the plan costs ${formatUgx(plan.totalCost)} with the stall fee, within ${formatUgx(s.budget)}.`
        : `Check this: the plan costs ${formatUgx(plan.totalCost)}, which is more than ${formatUgx(s.budget)}.`,
    }),
    reserve: () => ({
      supported: plan.moneyLeft >= s.reserveTarget,
      message:
        plan.moneyLeft >= s.reserveTarget
          ? `Your numbers agree: ${formatUgx(plan.moneyLeft)} is left, at least the ${formatUgx(s.reserveTarget)} we count as a reserve.`
          : `Check this: only ${formatUgx(plan.moneyLeft)} is left, which is less than the ${formatUgx(s.reserveTarget)} we count as a reserve.`,
    }),
    surplus: () => ({
      supported: plan.surplusAll > 0,
      message:
        plan.surplusAll > 0
          ? `Your numbers agree: ${formatUgx(plan.revenueAll)} revenue − ${formatUgx(plan.totalCost)} cost = ${formatUgx(plan.surplusAll)} surplus if everything sells.`
          : `Check this: ${formatUgx(plan.revenueAll)} revenue − ${formatUgx(plan.totalCost)} cost = ${formatUgx(plan.surplusAll)}, ${outcomeWord(plan.surplusAll)}.`,
    }),
    "safe-three-quarters": () => ({
      supported: plan.surplusScenario > 0,
      message:
        plan.surplusScenario > 0
          ? `Your numbers agree: if 3 out of 4 sell, ${formatUgx(plan.revenueScenario)} − ${formatUgx(plan.totalCost)} = ${formatUgx(plan.surplusScenario)} surplus.`
          : `Check this: if 3 out of 4 sell, ${formatUgx(plan.revenueScenario)} − ${formatUgx(plan.totalCost)} = ${formatUgx(plan.surplusScenario)}, ${outcomeWord(plan.surplusScenario)}.`,
    }),
    choice: () => ({
      supported: plan.productsUsed >= 3,
      message:
        plan.productsUsed >= 3
          ? `Your numbers agree: you chose ${plan.productsUsed} different products.`
          : `Check this: you chose ${plan.productsUsed} different products. Three or more gives customers a real choice.`,
    }),
    margin: () => ({
      supported: plan.totalUnits > 0 && marginTotal * s.products.length >= plan.totalUnits * marginSum,
      message:
        plan.totalUnits > 0 && marginTotal * s.products.length >= plan.totalUnits * marginSum
          ? `Your numbers agree: you earn about ${formatUgx(plan.averageMargin)} surplus per item bought, above the ${formatUgx(simpleAverage)} average across the four products.`
          : `Check this: you earn about ${formatUgx(plan.averageMargin)} surplus per item bought, below the ${formatUgx(simpleAverage)} average across the four products.`,
    }),
  };

  return picked.map((id) => ({ id, ...checks[id]() }));
}
