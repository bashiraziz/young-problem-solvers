"use client";

import { useId, useRef } from "react";
import { explainParseError, parseWholeNumber } from "@/lib/challenge/parse";
import { MAX_HINTS, canReveal, isQuestionDone, type QState } from "./state";

export interface NumberQuestionProps {
  label: string;
  inputLabel: string;
  state: QState;
  hints: readonly string[];
  /** Called with a valid whole number. Return the outcome to show. */
  onCheck: (value: number) => { status: QState["status"]; message: string };
  onInput: (value: string) => void;
  onResult: (status: QState["status"], message: string) => void;
  onHint: () => void;
  onReveal: () => void;
  checkLabel?: string;
}

/** One typed-number question with check, graduated hints and an optional worked answer. */
export function NumberQuestion({ label, inputLabel, state, hints, onCheck, onInput, onResult, onHint, onReveal, checkLabel = "Check" }: NumberQuestionProps) {
  const uid = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = `${uid}-input`;
  const msgId = `${uid}-msg`;
  const promptId = `${uid}-prompt`;
  const done = isQuestionDone(state);
  const isError = state.status === "invalid" || state.status === "incorrect" || state.status === "too-low" || state.status === "too-high";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Read the box itself, not React state: autofill, IME or a very fast Enter can submit before state catches up.
    const raw = inputRef.current?.value ?? state.input;
    if (raw !== state.input) onInput(raw);
    const parsed = parseWholeNumber(raw);
    if (!parsed.ok) {
      onResult("invalid", explainParseError(parsed.reason));
      return;
    }
    const outcome = onCheck(parsed.value);
    onResult(outcome.status, outcome.message);
  };

  return (
    <form onSubmit={submit} noValidate className="rounded-2xl border border-line bg-white p-5">
      <p id={promptId} className="font-bold">{label}</p>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1 basis-44">
          <label htmlFor={inputId} className="block text-sm font-semibold text-muted">{inputLabel}</label>
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={state.input}
            disabled={done}
            onChange={(e) => onInput(e.target.value)}
            aria-invalid={isError || undefined}
            aria-describedby={`${promptId} ${msgId}`}
            className="mt-1 w-full rounded-xl border border-ink/40 bg-white px-4 py-3 text-lg disabled:bg-cream"
          />
        </div>
        {!done && (
          <button type="submit" className="rounded-xl bg-teal px-5 py-3 text-sm font-extrabold text-white hover:bg-teal-dark">
            {checkLabel}
          </button>
        )}
      </div>

      <div id={msgId} role="status" aria-live="polite" className="mt-3 min-h-6 text-sm">
        {state.message && (
          <p
            className={`rounded-xl px-4 py-3 font-semibold ${
              done ? "bg-mint text-deep" : isError ? "bg-[#fdf0ec] text-danger" : "bg-cream"
            }`}
          >
            <span className="font-extrabold">
              {state.status === "correct" || state.status === "reasonable" ? "Good: " : state.status === "revealed" ? "Worked answer: " : "Not yet: "}
            </span>
            {state.message}
          </p>
        )}
      </div>

      {state.hints > 0 && (
        <ol className="mt-3 space-y-2 text-sm" aria-label="Hints">
          {hints.slice(0, state.hints).map((h, i) => (
            <li key={i} className="rounded-xl bg-[#fff8e6] px-4 py-3">
              <span className="font-extrabold">Hint {i + 1}: </span>
              {h}
            </li>
          ))}
        </ol>
      )}

      {!done && (
        <div className="mt-3 flex flex-wrap gap-3">
          {state.hints < MAX_HINTS && (
            <button type="button" onClick={onHint} className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-bold hover:bg-mint">
              {state.hints === 0 ? "Give me a hint" : "Another hint"}
            </button>
          )}
          {canReveal(state) && (
            <button type="button" onClick={onReveal} className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-bold hover:bg-mint">
              Show me the worked answer
            </button>
          )}
        </div>
      )}
    </form>
  );
}
