import type { Unit } from "@/types/content";

export const PROGRAMME = {
  name: "Young Problem Solvers",
  short: "YPS",
  tagline: "Think. Build. Explain.",
  ages: "9–12",
  weeks: 12,
  sessions: 24,
  sessionMinutes: 90,
  learningHours: 36,
} as const;

// Source: Foundation Curriculum Specification V1 (Pilot Release 1.0), §1.5 unit map and §2 weekly scope.
export const UNITS: readonly Unit[] = [
  {
    number: 1,
    title: "Think with Numbers",
    focus: "Place value, estimation, budgets, multiplication",
    summary: "By the end of the unit, children compare feasible event plans using checked calculations.",
    weeks: [
      { number: 1, title: "Number detectives" },
      { number: 2, title: "Budget choices" },
      { number: 3, title: "Groups, rates and sharing" },
    ],
  },
  {
    number: 2,
    title: "Investigate the World",
    focus: "Measurement, data, evidence",
    summary: "By the end of the unit, children produce a supported claim from measurements or a small dataset.",
    weeks: [
      { number: 4, title: "Measure before deciding" },
      { number: 5, title: "Collect and display data" },
      { number: 6, title: "Claims and evidence" },
    ],
  },
  {
    number: 3,
    title: "Design and Test",
    focus: "Patterns, algorithms, prototypes",
    summary: "By the end of the unit, children debug instructions and improve a design after a fair test.",
    weeks: [
      { number: 7, title: "Patterns and rules" },
      { number: 8, title: "Logic and instructions" },
      { number: 9, title: "Build, test, improve" },
    ],
  },
  {
    number: 4,
    title: "Build and Explain",
    focus: "Fractions, mini-enterprise, synthesis",
    summary: "By the end of the unit, children complete an independent challenge and explain a supported decision.",
    weeks: [
      { number: 10, title: "Fractions in decisions" },
      { number: 11, title: "Mini-enterprise decisions" },
      { number: 12, title: "Final challenge and reflection" },
    ],
  },
];

// Source: Specification §1.6 fixed 90-minute lesson architecture (0–10, 10–25, 25–55, 55–78, 78–90).
export const LEARNING_CYCLE = [
  { stage: "Discover", minutes: 10 },
  { stage: "Learn", minutes: 15 },
  { stage: "Solve", minutes: 30 },
  { stage: "Explain", minutes: 23 },
  { stage: "Reflect", minutes: 12 },
] as const;

export const PILLARS = [
  {
    title: "Think deeply.",
    tag: "Mathematical reasoning",
    body: "Build number sense, use more than one strategy, notice patterns and check whether an answer makes sense.",
  },
  {
    title: "Build solutions.",
    tag: "Practical problem-solving",
    body: "Turn ideas into practical decisions, useful models and small projects that can be tested and improved.",
  },
  {
    title: "Explain clearly.",
    tag: "Communication and confidence",
    body: "Show calculations, ask thoughtful questions, listen to other approaches and defend a conclusion with evidence.",
  },
] as const;

// Source: Specification header (baseline · formative · midpoint · final) and §6 parent reporting.
export const ASSESSMENT_STEPS = [
  {
    title: "Start with a baseline",
    body: "A short diagnostic shows strengths and learning gaps before each learner begins.",
  },
  {
    title: "Gather evidence along the way",
    body: "Short independent tasks and exit tickets every session, plus a midpoint check at the end of Week 6.",
  },
  {
    title: "Share a clear report",
    body: "A final individual assessment and a parent report with independent evidence, a next learning goal and a short home activity.",
  },
] as const;

/**
 * Fictional learner. Mirrors the sample in the Assessment & Reporting Pack §6.2 (rubric 1–4).
 * Illustrative only — not real student data or measured results.
 */
export const SAMPLE_REPORT = {
  learner: "Sample Learner A",
  summary: "Attendance 22/24 · Baseline 9/20 · Final 15/20",
  rows: [
    { competency: "Calculation", rating: 3, evidence: "Correctly solved a two-item budget with a written reserve." },
    { competency: "Strategy", rating: 3, evidence: "Identified required purchases and checked feasibility." },
    { competency: "Explanation", rating: 3, evidence: "Supported a recommendation with a total and a comparison." },
    { competency: "Self-monitoring", rating: 2, evidence: "Checked sums when reminded; next target is checking without prompts." },
  ],
  nextStep:
    "Complete one new household shopping calculation each week: estimate first, then verify the final amount, and explain why that method was chosen.",
  caveat:
    "Scores come from two internal assessments that are comparable but not formally equated. They show work completed and do not imply an IQ increase, a guaranteed school-grade improvement or an externally certified level.",
} as const;
