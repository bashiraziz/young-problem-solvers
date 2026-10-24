import type { BudgetItem } from "@/lib/budgeting";

export const BUDGET = 25_000;

export const FIXED_COSTS: readonly BudgetItem[] = [
  { id: "transport", label: "Transport (reserved)", amount: 3_000 },
  { id: "supplies", label: "Essential supplies", amount: 14_000 },
];

export const EXTRAS: readonly BudgetItem[] = [
  { id: "marker-1", label: "One extra marker", amount: 3_500 },
  { id: "poster", label: "An extra poster", amount: 2_000 },
  { id: "marker-2", label: "Another marker", amount: 3_500 },
];
