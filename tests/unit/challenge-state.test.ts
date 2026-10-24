import { describe, expect, it } from "vitest";
import { canReveal, initialState, isQuestionDone, mascotMood, MAX_HINTS, reducer, type Action, type State } from "@/components/interactive/stall/state";

const run = (actions: Action[], from: State = initialState()) => actions.reduce(reducer, from);

describe("challenge state", () => {
  it("starts at the Estimate step with nothing recorded", () => {
    const s = initialState();
    expect(s).toMatchObject({ step: 0, furthest: 0, reasons: [], reasonsChecked: false });
    expect(s.q).toEqual({});
  });

  it("only advances forward through next, and can revisit earlier steps but not later ones", () => {
    let s = run([{ type: "next" }, { type: "next" }]);
    expect(s).toMatchObject({ step: 2, furthest: 2 });
    s = run([{ type: "goto", step: 0 }], s);
    expect(s).toMatchObject({ step: 0, furthest: 2 });
    s = run([{ type: "goto", step: 3 }], s);
    expect(s.step).toBe(0); // 3 is not unlocked
    s = run([{ type: "goto", step: -1 }], s);
    expect(s.step).toBe(0);
    s = run(Array.from({ length: 10 }, () => ({ type: "next" }) as Action));
    expect(s.step).toBe(4); // clamps at the last step
  });

  it("counts wrong attempts but not invalid input, and clears stale feedback on typing", () => {
    let s = run([
      { type: "input", id: "a", value: "12" },
      { type: "result", id: "a", status: "incorrect", message: "no" },
    ]);
    expect(s.q.a).toMatchObject({ attempts: 1, status: "incorrect", message: "no" });
    s = run([{ type: "result", id: "a", status: "invalid", message: "digits only" }], s);
    expect(s.q.a.attempts).toBe(1);
    s = run([{ type: "input", id: "a", value: "13" }], s);
    expect(s.q.a).toMatchObject({ status: "idle", message: "", input: "13" });
  });

  it("locks an answered question and treats correct, reasonable and revealed as done", () => {
    for (const status of ["correct", "reasonable"] as const) {
      const s = run([
        { type: "input", id: "a", value: "5" },
        { type: "result", id: "a", status, message: "ok" },
        { type: "input", id: "a", value: "6" },
      ]);
      expect(s.q.a.input).toBe("5");
      expect(isQuestionDone(s.q.a)).toBe(true);
    }
    expect(isQuestionDone(run([{ type: "reveal", id: "a", message: "w" }]).q.a)).toBe(true);
    expect(isQuestionDone(undefined)).toBe(false);
    expect(isQuestionDone(run([{ type: "result", id: "a", status: "too-low", message: "" }]).q.a)).toBe(false);
  });

  it("offers the worked answer only after 3 hints or 3 wrong attempts", () => {
    const hints = run(Array.from({ length: 5 }, () => ({ type: "hint", id: "a" }) as Action));
    expect(hints.q.a.hints).toBe(MAX_HINTS);
    expect(canReveal(hints.q.a)).toBe(true);
    const wrong = run(Array.from({ length: 3 }, () => ({ type: "result", id: "b", status: "incorrect", message: "" }) as Action));
    expect(canReveal(wrong.q.b)).toBe(true);
    const two = run(Array.from({ length: 2 }, () => ({ type: "result", id: "c", status: "incorrect", message: "" }) as Action));
    expect(canReveal(two.q.c)).toBe(false);
    expect(canReveal(undefined)).toBe(false);
  });

  it("changing the plan or the chosen reasons invalidates a previous reasons check", () => {
    let s = run([{ type: "toggleReason", id: "reserve" }, { type: "checkReasons" }]);
    expect(s.reasonsChecked).toBe(true);
    s = run([{ type: "qty", id: "juice", value: "10" }], s);
    expect(s.reasonsChecked).toBe(false);
    s = run([{ type: "checkReasons" }, { type: "toggleReason", id: "choice" }], s);
    expect(s.reasonsChecked).toBe(false);
  });

  it("cannot 'check' with no reasons picked", () => {
    expect(run([{ type: "checkReasons" }]).reasonsChecked).toBe(false);
  });

  it("toggles reasons and reflection ticks, caps free text at 300 characters", () => {
    let s = run([{ type: "toggleReason", id: "reserve" }, { type: "toggleReason", id: "reserve" }]);
    expect(s.reasons).toEqual([]);
    s = run([{ type: "toggleReflect", id: "x" }], s);
    expect(s.reflect).toEqual(["x"]);
    s = run([{ type: "reasonText", value: "a".repeat(500) }], s);
    expect(s.reasonText).toHaveLength(300);
  });

  it("reset returns everything to the initial state", () => {
    const s = run([
      { type: "next" },
      { type: "input", id: "a", value: "1" },
      { type: "qty", id: "juice", value: "9" },
      { type: "reasonText", value: "hello" },
      { type: "reset" },
    ]);
    expect(s).toEqual(initialState());
  });
});

describe("mascot mood", () => {
  const ids = ["a", "b"];
  const done = (id: string): Action => ({ type: "result", id, status: "correct", message: "ok" });

  it("thinks while the child is working", () => {
    expect(mascotMood(0, ids, {}, false).pose).toBe("thinking");
  });

  it("is puzzled, with encouraging words, after a wrong answer or a hint", () => {
    const wrong = run([{ type: "result", id: "a", status: "incorrect", message: "x" }]);
    expect(mascotMood(1, ids, wrong.q, false)).toEqual({ pose: "stuck", caption: "Hmm, let's look at it another way." });
    const hinted = run([{ type: "hint", id: "a" }]);
    expect(mascotMood(1, ids, hinted.q, false).pose).toBe("stuck");
  });

  it("does not treat a typo (not a number) as a mistake", () => {
    const typo = run([{ type: "result", id: "a", status: "invalid", message: "x" }]);
    expect(mascotMood(1, ids, typo.q, false).pose).toBe("thinking");
  });

  it("celebrates only once every question on the step is done", () => {
    expect(mascotMood(1, ids, run([done("a")]).q, false).pose).toBe("thinking");
    expect(mascotMood(1, ids, run([done("a"), done("b")]).q, false).pose).toBe("got-it");
  });

  it("stops being puzzled once the question is done", () => {
    const s = run([{ type: "hint", id: "a" }, done("a")]);
    expect(mascotMood(0, ["a"], s.q, false).pose).toBe("got-it");
  });

  it("celebrates a valid plan and explains on the justify and reflect steps", () => {
    expect(mascotMood(2, [], {}, true).pose).toBe("got-it");
    expect(mascotMood(2, [], {}, false).pose).toBe("thinking");
    expect(mascotMood(3, [], {}, false).pose).toBe("explaining");
    expect(mascotMood(4, [], {}, true).pose).toBe("explaining");
  });

  it("never uses words like wrong or failed", () => {
    for (const step of [0, 1, 2, 3, 4]) for (const ok of [true, false]) expect(mascotMood(step, ids, {}, ok).caption).not.toMatch(/wrong|fail|bad/i);
  });
});
