"use client";

import { useMemo, useState } from "react";
import { computeBudget, formatUgx } from "@/lib/budgeting";
import { BUDGET, EXTRAS, FIXED_COSTS } from "@/content/challenge";

export function BudgetChallenge() {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());

  const result = useMemo(
    () => computeBudget(BUDGET, FIXED_COSTS, EXTRAS.filter((e) => selected.has(e.id))),
    [selected],
  );

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="rounded-3xl border border-line bg-white p-6 text-ink shadow-card sm:p-8">
      <h3 className="text-xl font-black">Let&apos;s make a budget</h3>
      <p className="mt-1 text-sm text-muted">Select extras and see how your decision changes the money left.</p>

      <dl className="mt-5 space-y-2">
        <Row label="Available budget" value={formatUgx(BUDGET)} />
        {FIXED_COSTS.map((c) => (
          <Row key={c.id} label={c.label} value={formatUgx(c.amount)} />
        ))}
      </dl>

      <fieldset className="mt-6">
        <legend className="text-sm font-extrabold">Choose some optional extras:</legend>
        <div className="mt-3 space-y-2">
          {EXTRAS.map((e) => (
            <label
              key={e.id}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-cream px-4 py-3 has-[:checked]:border-teal has-[:checked]:bg-mint"
            >
              <input
                type="checkbox"
                checked={selected.has(e.id)}
                onChange={() => toggle(e.id)}
                className="size-5 accent-teal"
              />
              <span className="flex-1 text-sm font-semibold">{e.label}</span>
              <span className="text-sm font-bold">+{e.amount.toLocaleString("en-US")}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div role="status" aria-live="polite" className="mt-6 rounded-2xl bg-deep p-5 text-white">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-wide uppercase opacity-80">Money remaining</p>
            <p data-testid="remaining" className="text-3xl font-black">{formatUgx(result.remaining)}</p>
          </div>
          <p
            data-testid="status"
            className={`rounded-full px-3 py-1.5 text-sm font-extrabold ${result.withinBudget ? "bg-mint text-deep" : "bg-sun text-ink"}`}
          >
            {result.withinBudget ? "Within budget ✓" : "Over budget ✕"}
          </p>
        </div>
        <p data-testid="calculation" className="mt-3 text-sm opacity-90">
          Calculation: {result.calculation}.{" "}
          {result.withinBudget
            ? "You can explain why this combination works."
            : "Try removing an extra so your plan is affordable."}
        </p>
      </div>

      <p className="mt-5 rounded-xl border-l-4 border-sun bg-cream px-4 py-3 text-sm">
        <strong>Now explain:</strong> Which extras would you choose, and why?
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between rounded-xl bg-cream px-4 py-3 text-sm">
      <dt>{label}</dt>
      <dd className="font-extrabold">{value}</dd>
    </div>
  );
}
