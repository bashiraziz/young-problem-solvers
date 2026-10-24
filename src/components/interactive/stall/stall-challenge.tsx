"use client";

import { useEffect, useMemo, useReducer, useRef } from "react";
import { REFRESHMENTS_STALL as S } from "@/content/challenges/refreshments-stall";
import { explainParseError, parseWholeNumber } from "@/lib/challenge/parse";
import {
  REASON_IDS,
  REASON_LABELS,
  buildCalcQuestions,
  checkCalcAnswer,
  checkEstimate,
  estimateGuidance,
  evaluatePlan,
  planIssues,
  reasonEvidence,
} from "@/lib/challenge/stall";
import { formatUgx } from "@/lib/formatters";
import { NumberQuestion } from "./number-question";
import { LAST_STEP, STEPS, initialState, isQuestionDone, reducer, type State } from "./state";

const REFLECTION_CHECKS = [
  { id: "estimate-first", label: "I estimated before I calculated." },
  { id: "second-way", label: "I checked a total a second way." },
  { id: "fee", label: "I remembered the stall fee in my budget." },
  { id: "reasons-match", label: "My reasons match my own numbers." },
] as const;

/** Parses the quantity boxes. Blank counts as 0; anything else invalid is reported per product. */
function readQuantities(qty: State["qty"]) {
  const values: Record<string, number> = {};
  const errors: Record<string, string> = {};
  for (const p of S.products) {
    const raw = qty[p.id] ?? "";
    if (raw.trim() === "") {
      values[p.id] = 0;
      continue;
    }
    const parsed = parseWholeNumber(raw, S.maxPerProduct);
    if (parsed.ok) values[p.id] = parsed.value;
    else {
      values[p.id] = 0;
      errors[p.id] = explainParseError(parsed.reason, S.maxPerProduct);
    }
  }
  return { values, errors };
}

export function StallChallenge() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const questions = useMemo(() => buildCalcQuestions(S), []);
  const guidance = useMemo(() => estimateGuidance(S), []);
  const { values, errors } = readQuantities(state.qty);
  const plan = evaluatePlan(S, values);
  const issues = planIssues(S, plan);
  const quantityErrors = Object.keys(errors).length > 0;

  // Move focus to the step heading when the step changes, so keyboard and screen-reader users land in the right place.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [state.step]);

  const stepDone: boolean[] = [
    isQuestionDone(state.q["estimate"]),
    questions.every((q) => isQuestionDone(state.q[q.id])),
    issues.length === 0 && !quantityErrors,
    state.reasonsChecked && state.reasons.length > 0,
    true,
  ];

  const q = (id: string) => state.q[id];
  const emptyQ = { input: "", attempts: 0, hints: 0, status: "idle" as const, message: "" };

  return (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold tracking-[0.14em] text-teal uppercase">
            Step {state.step + 1} of {STEPS.length}
          </p>
          <h2 ref={headingRef} tabIndex={-1} className="mt-1 text-2xl font-black outline-offset-4">
            {STEPS[state.step]}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: "reset" })}
          className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-bold hover:bg-mint"
        >
          Start again
        </button>
      </div>

      <nav aria-label="Challenge steps" className="mt-5">
        <ol className="flex flex-wrap gap-2">
          {STEPS.map((name, i) => {
            // Later steps depend on a valid plan, so they stay locked while the plan is invalid.
            const reachable = i <= state.furthest && (i <= 2 || (issues.length === 0 && !quantityErrors));
            const current = i === state.step;
            return (
              <li key={name}>
                <button
                  type="button"
                  disabled={!reachable}
                  aria-current={current ? "step" : undefined}
                  onClick={() => dispatch({ type: "goto", step: i })}
                  className={`rounded-full border px-4 py-2 text-sm font-bold disabled:opacity-60 ${
                    current ? "border-teal bg-teal text-white" : "border-line bg-cream hover:bg-mint"
                  }`}
                >
                  {i + 1}. {name}
                  {i < state.step && stepDone[i] && <span className="sr-only"> (done)</span>}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-6 space-y-4">
        {state.step === 0 && (
          <>
            <p className="text-lg leading-relaxed">
              The stall wants to buy <strong>40 cups of fruit juice</strong> at {formatUgx(1_200)} each and{" "}
              <strong>60 samosas</strong> at {formatUgx(400)} each. Without a calculator, <strong>estimate</strong> the
              total cost of both orders. Aim for a number you could work out in your head.
            </p>
            <NumberQuestion
              label="Your estimate"
              inputLabel="My estimate (UGX)"
              checkLabel="Check my estimate"
              state={q("estimate") ?? emptyQ}
              hints={guidance.hints}
              onInput={(value) => dispatch({ type: "input", id: "estimate", value })}
              onResult={(status, message) => dispatch({ type: "result", id: "estimate", status, message })}
              onHint={() => dispatch({ type: "hint", id: "estimate" })}
              onReveal={() =>
                dispatch({
                  type: "reveal",
                  id: "estimate",
                  message: `One way: round each price to a friendly number. That gives about ${formatUgx(guidance.sampleEstimate)}. You will find the exact total in the next step.`,
                })
              }
              onCheck={(value) => {
                const r = checkEstimate(S, value);
                if (r.verdict === "reasonable") {
                  return { status: "reasonable", message: "That is close enough to be a useful estimate. You will find the exact total in the next step, so you can compare." };
                }
                return {
                  status: r.verdict,
                  message:
                    r.verdict === "too-low"
                      ? "That looks too low. Round each price to a friendlier number, multiply, then add."
                      : "That looks too high. Round each price to a friendlier number, multiply, then add.",
                };
              }}
            />
          </>
        )}

        {state.step === 1 && (
          <>
            <p className="text-lg leading-relaxed">
              Now work out the <strong>exact</strong> amounts. Compare each answer with your estimate. You have{" "}
              {formatUgx(S.budget)} and the stall fee is {formatUgx(S.stallFee)}.
            </p>
            {questions.map((cq, i) => (
              <NumberQuestion
                key={cq.id}
                label={`${i + 1}. ${cq.prompt}`}
                inputLabel="My answer (UGX)"
                state={q(cq.id) ?? emptyQ}
                hints={cq.hints}
                onInput={(value) => dispatch({ type: "input", id: cq.id, value })}
                onResult={(status, message) => dispatch({ type: "result", id: cq.id, status, message })}
                onHint={() => dispatch({ type: "hint", id: cq.id })}
                onReveal={() => dispatch({ type: "reveal", id: cq.id, message: `${cq.why}` })}
                onCheck={(value) => {
                  const r = checkCalcAnswer(cq, value);
                  return { status: r.status, message: r.message };
                }}
              />
            ))}
          </>
        )}

        {state.step === 2 && (
          <>
            <p className="text-lg leading-relaxed">
              Now <strong>choose</strong> what to buy for the stall. You must pay the {formatUgx(S.stallFee)} stall fee
              and stay within {formatUgx(S.budget)}. Pick at least 2 different products.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {plan.lines.map((l) => {
                const id = `qty-${l.product.id}`;
                const error = errors[l.product.id];
                return (
                  <li key={l.product.id} className="rounded-2xl border border-line bg-white p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 id={`${id}-name`} className="text-lg font-black">{l.product.name}</h3>
                      <p className="text-sm font-extrabold">Cost: {formatUgx(l.cost)}</p>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      Buy at {formatUgx(l.product.buy)} · Sell at {formatUgx(l.product.sell)} (each {l.product.unit})
                    </p>
                    <label id={`${id}-label`} htmlFor={id} className="mt-3 block text-sm font-semibold">
                      Number of {l.product.unit}s to buy (0–{S.maxPerProduct})
                    </label>
                    <input
                      id={id}
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      value={state.qty[l.product.id] ?? ""}
                      placeholder="0"
                      onChange={(e) => dispatch({ type: "qty", id: l.product.id, value: e.target.value })}
                      aria-labelledby={`${id}-name ${id}-label`}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? `${id}-err` : undefined}
                      className="mt-1 w-full rounded-xl border border-ink/40 bg-white px-4 py-3 text-lg"
                    />
                    {error && (
                      <p id={`${id}-err`} className="mt-1 text-xs font-semibold text-danger">{error}</p>
                    )}
                  </li>
                );
              })}
            </ul>

            <dl className="grid gap-2 sm:grid-cols-2">
              <Stat label="Stock cost" value={formatUgx(plan.stockCost)} />
              <Stat label="Stall fee" value={formatUgx(S.stallFee)} />
              <Stat label="Total cost" value={formatUgx(plan.totalCost)} />
              <Stat label="Money left from budget" value={formatUgx(plan.moneyLeft)} />
            </dl>

            <div role="status" aria-live="polite" className="min-h-6">
              {quantityErrors && <Notice tone="warn">Fix the highlighted boxes first.</Notice>}
              {!quantityErrors && issues.map((i) => <Notice key={i.id} tone="warn">{i.message}</Notice>)}
              {!quantityErrors && issues.length === 0 && <Notice tone="ok">Your plan is within budget. Press Next to explain your choice.</Notice>}
            </div>
          </>
        )}

        {state.step === 3 && (
          <>
            <PlanSummary plan={plan} />
            <fieldset className="rounded-2xl border border-line bg-white p-5">
              <legend className="px-2 font-bold">Why is this a good plan? Pick every reason that fits.</legend>
              <div className="mt-2 space-y-2">
                {REASON_IDS.map((id) => (
                  <label key={id} className="flex cursor-pointer items-start gap-3 rounded-xl bg-cream px-4 py-3 has-[:checked]:bg-mint">
                    <input
                      type="checkbox"
                      checked={state.reasons.includes(id)}
                      onChange={() => dispatch({ type: "toggleReason", id })}
                      className="mt-0.5 size-5 shrink-0 accent-teal"
                    />
                    <span className="text-sm font-semibold">{REASON_LABELS[id]}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="reason-text" className="block text-sm font-extrabold">In your own words (optional)</label>
              <textarea
                id="reason-text"
                value={state.reasonText}
                onChange={(e) => dispatch({ type: "reasonText", value: e.target.value })}
                maxLength={300}
                rows={3}
                aria-describedby="reason-text-note"
                className="mt-1 w-full rounded-xl border border-ink/40 bg-white px-4 py-3"
              />
              <p id="reason-text-note" className="mt-1 text-xs text-muted">
                {state.reasonText.length}/300. What you type stays on this page. It is never sent or saved, and it disappears when you leave or press Start again.
              </p>
            </div>

            <button
              type="button"
              disabled={state.reasons.length === 0}
              onClick={() => dispatch({ type: "checkReasons" })}
              className="rounded-xl bg-teal px-5 py-3 text-sm font-extrabold text-white hover:bg-teal-dark disabled:opacity-50"
            >
              Check my reasons against my numbers
            </button>

            <div role="status" aria-live="polite">
              {state.reasonsChecked && (
                <ul className="space-y-2">
                  {reasonEvidence(S, plan, state.reasons).map((e) => (
                    <li key={e.id} className={`rounded-xl px-4 py-3 text-sm ${e.supported ? "bg-mint text-deep" : "bg-[#fff8e6]"}`}>
                      <span className="font-extrabold">{e.supported ? "✓ Supported. " : "Think again. "}</span>
                      <span className="font-semibold">{REASON_LABELS[e.id]}</span> {e.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {state.step === 4 && (
          <>
            <PlanSummary plan={plan} />
            <div className="rounded-2xl border border-line bg-cream p-5">
              <h3 className="font-black">What if only 3 out of every 4 items sell?</h3>
              <p className="mt-2 text-sm leading-relaxed">
                You would sell about {plan.lines.reduce((n, l) => n + l.soldInScenario, 0)} of your {plan.totalUnits} items and take in{" "}
                <strong>{formatUgx(plan.revenueScenario)}</strong>. Your costs stay at {formatUgx(plan.totalCost)}, so your surplus would be{" "}
                <strong>{formatUgx(plan.surplusScenario)}</strong>
                {plan.surplusScenario < 0 ? " (a shortfall: you would spend more than you take in)." : "."}
              </p>
              <p className="mt-3 text-sm font-semibold">
                Think: what is one number you could change in your plan to make it safer? Go back to step 3 to try it.
              </p>
            </div>

            <fieldset className="rounded-2xl border border-line bg-white p-5">
              <legend className="px-2 font-bold">Check yourself (just for you, nothing is scored)</legend>
              <div className="mt-2 space-y-2">
                {REFLECTION_CHECKS.map((c) => (
                  <label key={c.id} className="flex cursor-pointer items-start gap-3 rounded-xl bg-cream px-4 py-3 has-[:checked]:bg-mint">
                    <input
                      type="checkbox"
                      checked={state.reflect.includes(c.id)}
                      onChange={() => dispatch({ type: "toggleReflect", id: c.id })}
                      className="mt-0.5 size-5 shrink-0 accent-teal"
                    />
                    <span className="text-sm font-semibold">{c.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="rounded-2xl border-l-4 border-sun bg-white p-5">
              <h3 className="font-black">Explain it to someone</h3>
              <p className="mt-1 text-sm">
                Tell a grown-up or a friend: which products did you choose, what is your surplus if everything sells, and why is that a sensible plan?
              </p>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <button
          type="button"
          disabled={state.step === 0}
          onClick={() => dispatch({ type: "goto", step: state.step - 1 })}
          className="rounded-xl border border-line bg-white px-5 py-3 text-sm font-bold hover:bg-mint disabled:opacity-50"
        >
          ← Back
        </button>
        {state.step < LAST_STEP ? (
          <button
            type="button"
            disabled={!stepDone[state.step]}
            onClick={() => dispatch({ type: "next" })}
            className="rounded-xl bg-teal px-5 py-3 text-sm font-extrabold text-white hover:bg-teal-dark disabled:opacity-50"
          >
            Next: {STEPS[state.step + 1]} →
          </button>
        ) : (
          <p className="text-sm font-bold text-teal">Well done for finishing the challenge.</p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between rounded-xl bg-cream px-4 py-3 text-sm">
      <dt>{label}</dt>
      <dd className="font-extrabold">{value}</dd>
    </div>
  );
}

function Notice({ tone, children }: { tone: "ok" | "warn"; children: React.ReactNode }) {
  return (
    <p className={`mt-1 rounded-xl px-4 py-3 text-sm font-semibold ${tone === "ok" ? "bg-mint text-deep" : "bg-[#fdf0ec] text-danger"}`}>
      {children}
    </p>
  );
}

function PlanSummary({ plan }: { plan: ReturnType<typeof evaluatePlan> }) {
  return (
    <div className="rounded-2xl border border-line bg-cream p-5">
      <h3 className="font-black">Your plan</h3>
      <ul className="mt-2 text-sm">
        {plan.lines
          .filter((l) => l.quantity > 0)
          .map((l) => (
            <li key={l.product.id}>
              {l.quantity} × {l.product.name.toLowerCase()} = {formatUgx(l.cost)}
            </li>
          ))}
        <li>Stall fee = {formatUgx(S.stallFee)}</li>
      </ul>
      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        <Stat label="Total cost" value={formatUgx(plan.totalCost)} />
        <Stat label="Money left" value={formatUgx(plan.moneyLeft)} />
        <Stat label="Revenue if everything sells" value={formatUgx(plan.revenueAll)} />
        <Stat label="Surplus if everything sells" value={formatUgx(plan.surplusAll)} />
      </dl>
      <p className="mt-2 text-xs text-muted">Surplus = revenue (money taken in) − total cost (all the money spent).</p>
    </div>
  );
}
