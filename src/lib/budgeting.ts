/** Pure UGX budgeting logic for the Week 2 demo challenge. Amounts are whole shillings. */

export interface BudgetItem {
  id: string;
  label: string;
  amount: number;
}

export interface BudgetResult {
  budget: number;
  fixedTotal: number;
  extrasTotal: number;
  remaining: number;
  withinBudget: boolean;
  /** e.g. "25,000 − 3,000 − 14,000 − 5,500 = 2,500" */
  calculation: string;
}

export function formatUgx(n: number): string {
  const sign = n < 0 ? "−" : "";
  return `${sign}UGX ${Math.abs(n).toLocaleString("en-US")}`;
}

const num = (n: number) => Math.abs(n).toLocaleString("en-US");

export function computeBudget(
  budget: number,
  fixed: readonly BudgetItem[],
  extras: readonly BudgetItem[],
): BudgetResult {
  for (const item of [...fixed, ...extras]) {
    if (!Number.isInteger(item.amount) || item.amount < 0) {
      throw new RangeError(`Invalid amount for ${item.id}`);
    }
  }
  if (!Number.isInteger(budget) || budget < 0) throw new RangeError("Invalid budget");

  const fixedTotal = fixed.reduce((s, i) => s + i.amount, 0);
  const extrasTotal = extras.reduce((s, i) => s + i.amount, 0);
  const remaining = budget - fixedTotal - extrasTotal;

  const parts = [num(budget), ...fixed.map((i) => num(i.amount)), ...(extras.length ? [num(extrasTotal)] : [])];
  const calculation = `${parts.join(" − ")} = ${remaining < 0 ? "−" : ""}${num(remaining)}`;

  return { budget, fixedTotal, extrasTotal, remaining, withinBudget: remaining >= 0, calculation };
}
