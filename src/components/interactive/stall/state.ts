import type { ReasonId } from "@/lib/challenge/stall";

export const STEPS = ["Estimate", "Calculate", "Choose", "Justify", "Reflect"] as const;
export const LAST_STEP = STEPS.length - 1;
export const MAX_HINTS = 3;

export type QStatus = "idle" | "correct" | "incorrect" | "invalid" | "revealed" | "reasonable" | "too-low" | "too-high";

export interface QState {
  input: string;
  /** Wrong (not invalid) attempts. */
  attempts: number;
  hints: number;
  status: QStatus;
  message: string;
}

export interface State {
  step: number;
  /** Highest step unlocked so far; earlier steps stay reachable. */
  furthest: number;
  /** Keyed by question id: "estimate" plus each calculation question id. */
  q: Record<string, QState>;
  /** Quantity text per product id, exactly as typed. */
  qty: Record<string, string>;
  reasons: ReasonId[];
  reasonText: string;
  reasonsChecked: boolean;
  reflect: string[];
}

export type Action =
  | { type: "input"; id: string; value: string }
  | { type: "result"; id: string; status: QStatus; message: string }
  | { type: "hint"; id: string }
  | { type: "reveal"; id: string; message: string }
  | { type: "qty"; id: string; value: string }
  | { type: "toggleReason"; id: ReasonId }
  | { type: "reasonText"; value: string }
  | { type: "checkReasons" }
  | { type: "toggleReflect"; id: string }
  | { type: "goto"; step: number }
  | { type: "next" }
  | { type: "reset" };

export const emptyQuestion = (): QState => ({ input: "", attempts: 0, hints: 0, status: "idle", message: "" });

export const initialState = (): State => ({
  step: 0,
  furthest: 0,
  q: {},
  qty: {},
  reasons: [],
  reasonText: "",
  reasonsChecked: false,
  reflect: [],
});

const getQ = (state: State, id: string): QState => state.q[id] ?? emptyQuestion();
const withQ = (state: State, id: string, patch: Partial<QState>): State => ({
  ...state,
  q: { ...state.q, [id]: { ...getQ(state, id), ...patch } },
});

const toggle = <T,>(list: readonly T[], item: T): T[] => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "input": {
      const q = getQ(state, action.id);
      if (q.status === "correct" || q.status === "revealed" || q.status === "reasonable") return state;
      // Typing again clears an old error so feedback never describes a number that has since changed.
      return withQ(state, action.id, { input: action.value, status: "idle", message: "" });
    }
    case "result": {
      const q = getQ(state, action.id);
      const wrong = action.status === "incorrect" || action.status === "too-low" || action.status === "too-high";
      return withQ(state, action.id, { status: action.status, message: action.message, attempts: q.attempts + (wrong ? 1 : 0) });
    }
    case "hint": {
      const q = getQ(state, action.id);
      return withQ(state, action.id, { hints: Math.min(MAX_HINTS, q.hints + 1) });
    }
    case "reveal":
      return withQ(state, action.id, { status: "revealed", message: action.message });
    case "qty":
      return { ...state, qty: { ...state.qty, [action.id]: action.value }, reasonsChecked: false };
    case "toggleReason":
      return { ...state, reasons: toggle(state.reasons, action.id), reasonsChecked: false };
    case "reasonText":
      return { ...state, reasonText: action.value.slice(0, 300) };
    case "checkReasons":
      return { ...state, reasonsChecked: state.reasons.length > 0 };
    case "toggleReflect":
      return { ...state, reflect: toggle(state.reflect, action.id) };
    case "goto":
      return action.step >= 0 && action.step <= state.furthest ? { ...state, step: action.step } : state;
    case "next": {
      const step = Math.min(LAST_STEP, state.step + 1);
      return { ...state, step, furthest: Math.max(state.furthest, step) };
    }
    case "reset":
      return initialState();
  }
}

/** A question counts as finished once answered well enough or its worked answer was shown. */
export const isQuestionDone = (q: QState | undefined): boolean =>
  q !== undefined && (q.status === "correct" || q.status === "revealed" || q.status === "reasonable");

/** The worked answer is offered after three hints or three wrong attempts. */
export const canReveal = (q: QState | undefined): boolean => !!q && !isQuestionDone(q) && (q.hints >= MAX_HINTS || q.attempts >= 3);

export type MascotMood = "thinking" | "got-it" | "stuck" | "explaining";

/**
 * Which robot pose to show, and the line beside it. The robot never reacts to a mistake with anything but
 * encouragement: "stuck" means "let's look at it another way", not "wrong".
 */
export function mascotMood(step: number, questionIds: readonly string[], q: State["q"], planOk: boolean): { pose: MascotMood; caption: string } {
  if (step >= 3) {
    return { pose: "explaining", caption: step === 3 ? "Explain your thinking: why is this a good plan?" : "Now tell someone how you planned it." };
  }
  if (step === 2) {
    return planOk
      ? { pose: "got-it", caption: "Your plan fits the budget. Nice thinking!" }
      : { pose: "thinking", caption: "Try different amounts and watch the numbers change." };
  }
  const items = questionIds.map((id) => q[id]);
  if (items.length > 0 && items.every(isQuestionDone)) return { pose: "got-it", caption: "Nice work! That step is done." };
  const tricky = items.some(
    (x) => x !== undefined && !isQuestionDone(x) && (x.hints > 0 || x.status === "incorrect" || x.status === "too-low" || x.status === "too-high"),
  );
  if (tricky) return { pose: "stuck", caption: "Hmm, let's look at it another way." };
  return { pose: "thinking", caption: "Take your time and think it through." };
}
