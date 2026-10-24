"use client";

import { useState } from "react";
import { leaves, type Item } from "@/lib/learning/items";
import { ItemView, isTracked } from "./item-view";

export interface PracticeSection {
  id: string;
  title: string;
  intro?: string;
  items: readonly Item[];
  /** Number the questions 1, 2, 3… (the six practice questions). */
  numbered?: boolean;
}

/**
 * Renders sections of questions and a small "n of N finished" count. The count lives only in this component's state:
 * nothing is stored, sent or tracked, and it resets when the page is left.
 */
export function PracticeSet({ sections, showProgress = true }: { sections: readonly PracticeSection[]; showProgress?: boolean }) {
  const [done, setDone] = useState<ReadonlySet<string>>(new Set());
  const tracked = leaves(sections.flatMap((s) => s.items)).filter(isTracked);

  const onDone = (id: string, isDone: boolean) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (isDone) next.add(id);
      else next.delete(id);
      return next;
    });

  return (
    <div className="space-y-10">
      {showProgress && tracked.length > 0 && (
        <p role="status" aria-live="polite" className="rounded-2xl border border-line bg-white px-5 py-3 text-sm font-bold">
          {done.size} of {tracked.length} parts finished. <span className="font-normal text-muted">Nothing you type is saved or sent.</span>
        </p>
      )}
      {sections.map((s) => (
        <section key={s.id} aria-labelledby={`${s.id}-h`}>
          <h2 id={`${s.id}-h`} className="text-2xl font-black tracking-tight">
            {s.title}
          </h2>
          {s.intro && <p className="mt-2 max-w-3xl text-muted">{s.intro}</p>}
          <ol className="mt-5 space-y-5">
            {s.items.map((item, i) => (
              <li key={item.id}>
                {s.numbered && <p className="mb-2 text-xs font-extrabold tracking-widest text-teal uppercase">Question {i + 1}</p>}
                <ItemView item={item} onDone={onDone} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
