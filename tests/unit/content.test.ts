import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { REFRESHMENTS_STALL } from "@/content/challenges/refreshments-stall";
import { FAQ } from "@/content/faq";
import { ASSESSMENT_EVENTS, CURRICULUM, LEARNING_CYCLE, PROGRAMME, SAMPLE_REPORT, UNITS } from "@/content/programme";

const weeks = UNITS.flatMap((u) => u.weeks);

describe("programme content integrity", () => {
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
    expect(UNITS.map((u) => u.title)).toEqual(["Think with Numbers", "Investigate the World", "Design and Test", "Build and Explain"]);
  });

  it("sample report ratings use the 1–4 rubric", () => {
    for (const r of SAMPLE_REPORT.rows) {
      expect(r.rating).toBeGreaterThanOrEqual(1);
      expect(r.rating).toBeLessThanOrEqual(4);
    }
  });
});

describe("stable IDs and versioning", () => {
  it("curriculum is versioned", () => {
    expect(CURRICULUM.version).toMatch(/^\d+\.\d+\.\d+(-[a-z]+)?$/);
  });

  it("unit, week, faq and assessment IDs are unique and well-formed", () => {
    const ids = [...UNITS.map((u) => u.id), ...weeks.map((w) => w.id), ...FAQ.map((f) => f.id), ...ASSESSMENT_EVENTS.map((a) => a.id)];
    expect(new Set(ids).size).toBe(ids.length);
    for (const u of UNITS) expect(u.id).toMatch(/^foundation\.u[1-4]$/);
    for (const w of weeks) expect(w.id).toBe(`foundation.w${String(w.number).padStart(2, "0")}`);
  });

  it("every week has a driving question and three observable outcomes", () => {
    for (const w of weeks) {
      expect(w.drivingQuestion).toMatch(/\?$/);
      expect(w.outcomes).toHaveLength(3);
    }
  });

  it("the stall challenge only references real curriculum weeks and has a sound price list", () => {
    const weekIds = new Set(weeks.map((w) => w.id));
    for (const id of REFRESHMENTS_STALL.weekIds) expect(weekIds.has(id)).toBe(true);
    for (const p of REFRESHMENTS_STALL.products) {
      expect(p.sell).toBeGreaterThan(p.buy);
      expect(Number.isInteger(p.buy) && Number.isInteger(p.sell)).toBe(true);
    }
  });
});

describe("confidential material stays out of the public app", () => {
  // Instructor-only / assessment markers that must never appear in shipped source (tests excluded).
  const forbidden = [/INDIVIDUAL CHECK/i, /EVIDENCE TO KEEP/i, /answer key/i, /\bForm [AB]\b/, /scoring criteria/i];

  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const full = join(dir, name);
      return statSync(full).isDirectory() ? walk(full) : /\.(ts|tsx|css|md|json|svg)$/.test(name) ? [full] : [];
    });

  it("shipped source contains no instructor answer keys or assessment markers", () => {
    const files = walk(join(process.cwd(), "src"));
    expect(files.length).toBeGreaterThan(10);
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      for (const re of forbidden) {
        // programme.ts documents its exclusion list in a comment; allow that single explanatory file.
        if (file.endsWith("programme.ts") && /Deliberately NOT included/.test(text)) continue;
        expect(re.test(text), `${file} matches ${re}`).toBe(false);
      }
    }
  });

  it("public/ holds no downloadable documents", () => {
    const publicDir = join(process.cwd(), "public");
    const entries = statSync(publicDir, { throwIfNoEntry: false }) ? readdirSync(publicDir) : [];
    expect(entries.filter((f) => /\.(pdf|docx?|xlsx?|zip|csv)$/i.test(f))).toEqual([]);
  });
});
