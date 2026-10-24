"use client";

import { useId, useState } from "react";
import {
  PLACES,
  checkBetween,
  checkChoice,
  checkNumber,
  checkOrder,
  checkParts,
  choiceOptions,
  parseAmount,
  parseList,
  type Item,
  type Leaf,
  type Outcome,
} from "@/lib/learning/items";

/** Open items with no self-check prompts are plain scratchpads: nothing to finish, nothing counted. */
export const isTracked = (leaf: Leaf) => leaf.kind !== "open" || leaf.selfCheck.length > 0;

interface ViewProps {
  item: Item;
  onDone: (id: string, done: boolean) => void;
}

const inputClass = "mt-1 w-full rounded-xl border border-ink/40 bg-white px-4 py-3 text-lg disabled:bg-cream";
const buttonClass = "rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-bold hover:bg-mint";
const primaryClass = "rounded-xl bg-teal px-5 py-3 text-sm font-extrabold text-white hover:bg-teal-dark";

/** One interactive question. Groups render their parts; every other kind is a self-contained form. */
export function ItemView({ item, onDone }: ViewProps) {
  if (item.kind === "group") {
    return (
      <div role="group" aria-labelledby={`${item.id}-prompt`} className="space-y-3">
        <p id={`${item.id}-prompt`} className="font-bold">
          {item.prompt}
        </p>
        {item.parts.map((p) => (
          <ItemView key={p.id} item={p} onDone={onDone} />
        ))}
      </div>
    );
  }
  return <LeafView item={item} onDone={onDone} />;
}

function LeafView({ item, onDone }: { item: Leaf; onDone: ViewProps["onDone"] }) {
  const uid = useId();
  const promptId = `${uid}-prompt`;
  const msgId = `${uid}-msg`;
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [wrong, setWrong] = useState<number[]>([]);
  const [hints, setHints] = useState(0);
  const [done, setDone] = useState(false);
  const [ticked, setTicked] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const finish = (o: Outcome) => {
    setOutcome(o);
    if (o.verdict === "correct") {
      setDone(true);
      onDone(item.id, true);
    }
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Read the boxes themselves, not React state: a very fast Enter can submit before state catches up (seen in WebKit).
    const data = new FormData(e.currentTarget);
    const text = (name: string) => String(data.get(name) ?? "");
    setWrong([]);
    switch (item.kind) {
      case "number": {
        const p = parseAmount(text("n"));
        return finish(p.ok ? checkNumber(item, p.value) : { verdict: "invalid", message: p.message });
      }
      case "choice": {
        const picked = text("choice");
        return finish(picked ? checkChoice(item, picked) : { verdict: "invalid", message: "Pick one answer first." });
      }
      case "parts": {
        const boxes = PLACES.map((_, i) => {
          const raw = text(`p${i}`).trim();
          return raw === "" ? 0 : (() => { const p = parseAmount(raw); return p.ok ? p.value : null; })();
        });
        if (boxes.some((b) => b === null)) return finish({ verdict: "invalid", message: "Use digits only in each box. Leave a box empty if that column is worth 0." });
        const r = checkParts(item, boxes);
        setWrong(r.wrongPlaces);
        return finish(r);
      }
      case "order": {
        const p = parseList(text("list"));
        return finish(p.ok ? checkOrder(item, p.values) : { verdict: "invalid", message: p.message });
      }
      case "between": {
        const p = parseList(`${text("b0")} ; ${text("b1")}`);
        return finish(p.ok ? checkBetween(item, p.values) : { verdict: "invalid", message: p.message });
      }
      case "open":
        return;
    }
  };

  const toggle = (label: string) => {
    const next = ticked.includes(label) ? ticked.filter((t) => t !== label) : [...ticked, label];
    setTicked(next);
    if (item.kind === "open") onDone(item.id, next.length === item.selfCheck.length);
  };

  const isError = outcome?.verdict === "incorrect" || outcome?.verdict === "invalid";
  const field = (extra: Record<string, unknown> = {}) => ({
    "aria-describedby": `${promptId} ${msgId}`,
    "aria-invalid": isError || undefined,
    disabled: done,
    autoComplete: "off",
    ...extra,
  });

  return (
    <form onSubmit={submit} onChange={() => outcome && !done && setOutcome(null)} noValidate className="rounded-2xl border border-line bg-white p-5">
      <p id={promptId} className="font-bold">
        {item.prompt}
      </p>

      {item.kind === "number" && (
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1 basis-44">
            <label htmlFor={`${uid}-n`} className="block text-sm font-semibold text-muted">
              {item.label}
            </label>
            <input id={`${uid}-n`} name="n" type="text" inputMode="numeric" className={inputClass} {...field()} />
          </div>
          {!done && <button type="submit" className={primaryClass}>Check</button>}
        </div>
      )}

      {item.kind === "choice" && (
        <fieldset className="mt-3" disabled={done}>
          <legend className="sr-only">{item.prompt}</legend>
          <div className="flex flex-wrap gap-3">
            {choiceOptions(item.rule).map((o) => (
              <label key={o} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-line bg-cream px-4 py-2 text-lg font-bold has-[:checked]:border-teal has-[:checked]:bg-mint">
                <input type="radio" name="choice" value={o} className="size-5 accent-teal" aria-describedby={msgId} />
                {item.rule.rule === "compare" ? <span aria-label={o === "<" ? "less than" : o === ">" ? "greater than" : "equal to"}>{o}</span> : o}
              </label>
            ))}
          </div>
          {!done && <button type="submit" className={`${primaryClass} mt-3`}>Check</button>}
        </fieldset>
      )}

      {item.kind === "parts" && (
        <fieldset className="mt-3" disabled={done}>
          <legend className="text-sm font-semibold text-muted">What is each column worth? Leave a box empty if it is worth 0.</legend>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {PLACES.map((place, i) => (
              <div key={place} className="min-w-0">
                <label htmlFor={`${uid}-p${i}`} className="block text-xs font-bold text-muted">
                  {place}
                </label>
                <input
                  id={`${uid}-p${i}`}
                  name={`p${i}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  aria-invalid={wrong.includes(i) || undefined}
                  aria-describedby={msgId}
                  className={`${inputClass} px-3 ${wrong.includes(i) ? "border-danger" : ""}`}
                />
              </div>
            ))}
          </div>
          {!done && <button type="submit" className={`${primaryClass} mt-3`}>Check</button>}
        </fieldset>
      )}

      {item.kind === "order" && (
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1 basis-56">
            <label htmlFor={`${uid}-l`} className="block text-sm font-semibold text-muted">
              Write all {item.numbers.length} numbers from least to greatest, with a space between each
            </label>
            <input id={`${uid}-l`} name="list" type="text" className={inputClass} {...field()} />
          </div>
          {!done && <button type="submit" className={primaryClass}>Check</button>}
        </div>
      )}

      {item.kind === "between" && (
        <div className="mt-3 flex flex-wrap items-end gap-3">
          {[0, 1].map((i) => (
            <div key={i} className="min-w-0 flex-1 basis-36">
              <label htmlFor={`${uid}-b${i}`} className="block text-sm font-semibold text-muted">
                Amount {i + 1}
              </label>
              <input id={`${uid}-b${i}`} name={`b${i}`} type="text" inputMode="numeric" className={inputClass} {...field()} />
            </div>
          ))}
          {!done && <button type="submit" className={primaryClass}>Check</button>}
        </div>
      )}

      {item.kind === "open" && (
        <div className="mt-3">
          <label htmlFor={`${uid}-t`} className="block text-sm font-semibold text-muted">
            Your thinking (stays on this page; never saved or sent)
          </label>
          <textarea
            id={`${uid}-t`}
            rows={3}
            maxLength={500}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            aria-describedby={`${promptId} ${uid}-count`}
            className={inputClass}
          />
          <p id={`${uid}-count`} className="mt-1 text-xs text-muted">{note.length}/500</p>
          {item.selfCheck.length > 0 && (
            <fieldset className="mt-3">
              <legend className="text-sm font-bold">Check yourself (just for you)</legend>
              <div className="mt-2 space-y-2">
                {item.selfCheck.map((s) => (
                  <label key={s} className="flex cursor-pointer items-start gap-3 rounded-xl bg-cream px-4 py-3 has-[:checked]:bg-mint">
                    <input type="checkbox" checked={ticked.includes(s)} onChange={() => toggle(s)} className="mt-0.5 size-5 shrink-0 accent-teal" />
                    <span className="text-sm font-semibold">{s}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
        </div>
      )}

      <div id={msgId} role="status" aria-live="polite" className="mt-3 min-h-6 text-sm">
        {outcome && (
          <p className={`rounded-xl px-4 py-3 font-semibold ${done ? "bg-mint text-deep" : "bg-[#fdf0ec] text-danger"}`}>
            <span className="font-extrabold">{done ? "Good: " : "Not yet: "}</span>
            {outcome.message}
          </p>
        )}
        {item.kind === "open" && item.selfCheck.length > 0 && ticked.length === item.selfCheck.length && (
          <p className="rounded-xl bg-mint px-4 py-3 font-semibold text-deep">Good: you have checked every part of your explanation.</p>
        )}
      </div>

      {hints > 0 && (
        <ol className="mt-3 space-y-2 text-sm" aria-label="Hints">
          {item.hints.slice(0, hints).map((h, i) => (
            <li key={i} className="rounded-xl bg-[#fff8e6] px-4 py-3">
              <span className="font-extrabold">Hint {i + 1}: </span>
              {h}
            </li>
          ))}
        </ol>
      )}
      {!done && hints < item.hints.length && (
        <button type="button" onClick={() => setHints(hints + 1)} className={`${buttonClass} mt-3`}>
          {hints === 0 ? "Give me a hint" : "Another hint"}
        </button>
      )}
    </form>
  );
}
