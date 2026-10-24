"use client";

import { useState, type ReactNode } from "react";

/**
 * The method first, one step at a time, then the worked example. The child decides when to move on, so the example
 * never lands on them all at once. `visual` is an optional accessible table or diagram shown with the example.
 */
export function WorkedExample({ steps, example, visual }: { steps: readonly string[]; example: string; visual?: ReactNode }) {
  const [shown, setShown] = useState(1);
  const [showExample, setShowExample] = useState(false);
  const allShown = shown >= steps.length;

  return (
    <div>
      <h3 className="text-lg font-black">How to do it, step by step</h3>
      <ol className="mt-3 space-y-2" aria-live="polite">
        {steps.slice(0, shown).map((s, i) => (
          <li key={i} className="flex gap-3 rounded-xl bg-cream px-4 py-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-teal text-sm font-black text-white" aria-hidden="true">
              {i + 1}
            </span>
            <span className="min-w-0"><span className="sr-only">Step {i + 1}: </span>{s}</span>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap gap-3">
        {!allShown && (
          <button
            type="button"
            onClick={() => setShown(shown + 1)}
            className="rounded-xl bg-teal px-5 py-3 text-sm font-extrabold text-white hover:bg-teal-dark"
          >
            Show step {shown + 1} of {steps.length}
          </button>
        )}
        {allShown && !showExample && (
          <button
            type="button"
            onClick={() => setShowExample(true)}
            className="rounded-xl bg-sun px-5 py-3 text-sm font-extrabold text-ink hover:brightness-105"
          >
            Show the worked example
          </button>
        )}
      </div>
      {showExample && (
        <div className="mt-5 rounded-2xl border-l-4 border-sun bg-white p-5" role="region" aria-label="Worked example">
          <h3 className="font-black">Worked example</h3>
          <p className="mt-2 leading-relaxed">{example}</p>
          {visual && <div className="mt-4">{visual}</div>}
        </div>
      )}
    </div>
  );
}
