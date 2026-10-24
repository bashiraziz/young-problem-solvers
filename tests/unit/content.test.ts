import { describe, expect, it } from "vitest";
import { LEARNING_CYCLE, PROGRAMME, SAMPLE_REPORT, UNITS } from "@/content/programme";

describe("programme content integrity", () => {
  const weeks = UNITS.flatMap((u) => u.weeks);

  it("has 4 units and 12 consecutive weeks", () => {
    expect(UNITS).toHaveLength(4);
    expect(weeks.map((w) => w.number)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
    expect(weeks.length).toBe(PROGRAMME.weeks);
  });

  it("session and hour totals are consistent (2 × 12 sessions, 90 min each)", () => {
    expect(PROGRAMME.sessions).toBe(PROGRAMME.weeks * 2);
    expect((PROGRAMME.sessions * PROGRAMME.sessionMinutes) / 60).toBe(PROGRAMME.learningHours);
  });

  it("lesson-cycle minutes add up to one session", () => {
    expect(LEARNING_CYCLE.reduce((s, c) => s + c.minutes, 0)).toBe(PROGRAMME.sessionMinutes);
  });

  it("unit titles follow the Curriculum Specification", () => {
    expect(UNITS.map((u) => u.title)).toEqual([
      "Think with Numbers",
      "Investigate the World",
      "Design and Test",
      "Build and Explain",
    ]);
  });

  it("sample report ratings use the 1–4 rubric", () => {
    for (const r of SAMPLE_REPORT.rows) {
      expect(r.rating).toBeGreaterThanOrEqual(1);
      expect(r.rating).toBeLessThanOrEqual(4);
    }
  });
});
