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

// Unit and week titles come from the v1 prototype; unit names follow the implementation brief.
// Verify against the Curriculum Specification once supplied (see docs/DECISIONS.md).
export const UNITS: readonly Unit[] = [
  {
    number: 1,
    title: "Think with Numbers",
    focus: "Mathematical foundations",
    summary: "Children calculate accurately, estimate sensibly and explain their strategies.",
    weeks: [
      { number: 1, title: "Number detectives and estimation" },
      { number: 2, title: "Budget choices and money decisions" },
      { number: 3, title: "Groups, rates and sharing" },
    ],
  },
  {
    number: 2,
    title: "Investigate the World",
    focus: "Measurement and evidence",
    summary: "Children gather information, interpret it and know what the evidence can support.",
    weeks: [
      { number: 4, title: "Measure before deciding" },
      { number: 5, title: "Collect and display data" },
      { number: 6, title: "Claims and evidence" },
    ],
  },
  {
    number: 3,
    title: "Design a Solution",
    focus: "Logic and experimentation",
    summary: "Children describe rules, follow constraints and improve a solution after testing.",
    weeks: [
      { number: 7, title: "Patterns and rules" },
      { number: 8, title: "Logic and clear instructions" },
      { number: 9, title: "Build, test and improve" },
    ],
  },
  {
    number: 4,
    title: "Build and Explain",
    focus: "Integrated application",
    summary: "Children apply skills in a practical project, then show what they understand individually.",
    weeks: [
      { number: 10, title: "Fractions in everyday decisions" },
      { number: 11, title: "Mini-enterprise decisions" },
      { number: 12, title: "Independent challenge and reflection" },
    ],
  },
];

export const LEARNING_CYCLE = ["Discover", "Learn", "Solve", "Explain", "Reflect"] as const;

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

export const ASSESSMENT_STEPS = [
  { title: "Start with a diagnostic", body: "Understand strengths and learning gaps before placing each learner on a path." },
  { title: "Gather evidence each week", body: "Keep short independent tasks, explanations and samples of children's work." },
  { title: "Share meaningful feedback", body: "Provide a final progress report, project demonstration and a suggested next step." },
] as const;

/** Illustrative only — not real student data or measured results. */
export const SAMPLE_REPORT = {
  rows: [
    { skill: "Mathematical reasoning", level: "Independent / emerging", percent: 75 },
    { skill: "Problem-solving strategies", level: "Developing", percent: 55 },
    { skill: "Explaining ideas", level: "Developing", percent: 63 },
    { skill: "Independent work", level: "Building confidence", percent: 46 },
  ],
  note: "Can calculate a simple budget independently and describe the strategy. Next focus: comparing two plans and justifying the better choice.",
} as const;
