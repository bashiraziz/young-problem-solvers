import type { AssessmentEvent, Unit } from "@/types/content";

/**
 * Parent-facing Foundation Programme content. Typed, versioned, and independent of presentation.
 * Source: Foundation Curriculum Specification V1 (Pilot Release 1.0), §1.5, §1.6, §2, §4.1, §6.
 *
 * Deliberately NOT included (confidential / instructor-only): individual-check questions, evidence
 * lists, scripted lesson, assessment forms, scoring criteria and answer keys. Do not add them here.
 */
export const CURRICULUM = {
  id: "yps.foundation",
  version: "1.0.0-pilot",
  source: "Foundation Curriculum Specification V1 (Pilot Release 1.0)",
} as const;

export const PROGRAMME = {
  name: "Young Problem Solvers",
  short: "YPS",
  tagline: "Think. Build. Explain.",
  ages: "9–12",
  weeks: 12,
  sessions: 24,
  sessionMinutes: 90,
  learningHours: 36,
  proposedGroupSize: 12,
} as const;

export const UNITS: readonly Unit[] = [
  {
    id: "foundation.u1",
    number: 1,
    title: "Think with Numbers",
    focus: "Place value, estimation, budgets, multiplication",
    summary: "By the end of the unit, children compare feasible event plans using checked calculations.",
    weeks: [
      {
        id: "foundation.w01",
        number: 1,
        title: "Number detectives",
        drivingQuestion: "How do we know if a numerical answer makes sense?",
        outcomes: [
          "Read, compare and partition whole numbers in everyday examples.",
          "Round to useful place values and estimate sums before calculating.",
          "Check a calculation using a second strategy and explain a discrepancy.",
        ],
      },
      {
        id: "foundation.w02",
        number: 2,
        title: "Budget choices",
        drivingQuestion: "How can a limited budget guide our decisions?",
        outcomes: [
          "Add and subtract UGX amounts accurately and keep track of a reserve.",
          "Distinguish required purchases from optional ones.",
          "Compare affordable plans using calculations and a clear explanation.",
        ],
      },
      {
        id: "foundation.w03",
        number: 3,
        title: "Groups, rates and sharing",
        drivingQuestion: "When should we multiply, divide or estimate?",
        outcomes: [
          "Model equal groups with multiplication and related division.",
          "Interpret a unit price and compare two offers of the same quantity.",
          "Explain remainders correctly in a real-life situation.",
        ],
      },
    ],
  },
  {
    id: "foundation.u2",
    number: 2,
    title: "Investigate the World",
    focus: "Measurement, data, evidence",
    summary: "By the end of the unit, children produce a supported claim from measurements or a small dataset.",
    weeks: [
      {
        id: "foundation.w04",
        number: 4,
        title: "Measure before deciding",
        drivingQuestion: "Why do reliable measurements matter?",
        outcomes: [
          "Choose suitable units for length and capacity.",
          "Estimate and then measure with appropriate tools.",
          "Record measurements with units and calculate simple totals and differences.",
        ],
      },
      {
        id: "foundation.w05",
        number: 5,
        title: "Collect and display data",
        drivingQuestion: "How can evidence help us notice patterns?",
        outcomes: [
          "Formulate a neutral, answerable question.",
          "Collect and organize small anonymous datasets using tallies.",
          "Construct and read a simple bar chart with titles and labelled axes.",
        ],
      },
      {
        id: "foundation.w06",
        number: 6,
        title: "Claims and evidence",
        drivingQuestion: "When is a claim stronger than a guess?",
        outcomes: [
          "Read values, totals and differences from a graph or table.",
          "Separate what a dataset shows from what it does not show.",
          "Use a calculation and evidence to support a short written claim.",
        ],
      },
    ],
  },
  {
    id: "foundation.u3",
    number: 3,
    title: "Design and Test",
    focus: "Patterns, algorithms, prototypes",
    summary: "By the end of the unit, children debug instructions and improve a design after a fair test.",
    weeks: [
      {
        id: "foundation.w07",
        number: 7,
        title: "Patterns and rules",
        drivingQuestion: "Can we describe a rule precisely enough to predict?",
        outcomes: [
          "Extend arithmetic and shape patterns from an explicit rule.",
          "Describe a rule in words, tables or arrows.",
          "Test a proposed rule with a new input and find counterexamples.",
        ],
      },
      {
        id: "foundation.w08",
        number: 8,
        title: "Logic and instructions",
        drivingQuestion: "What makes instructions unambiguous?",
        outcomes: [
          "Order actions as a finite sequence and identify missing steps.",
          "Follow constraints when planning a route or arrangement.",
          "Debug instructions and communicate the correction clearly.",
        ],
      },
      {
        id: "foundation.w09",
        number: 9,
        title: "Build, test, improve",
        drivingQuestion: "How do we know whether a design really works?",
        outcomes: [
          "Specify a clear success criterion before a trial.",
          "Run at least three fair trials and record observations.",
          "Use test results to make and justify one improvement.",
        ],
      },
    ],
  },
  {
    id: "foundation.u4",
    number: 4,
    title: "Build and Explain",
    focus: "Fractions, mini-enterprise, synthesis",
    summary: "By the end of the unit, children complete an independent challenge and explain a supported decision.",
    weeks: [
      {
        id: "foundation.w10",
        number: 10,
        title: "Fractions in decisions",
        drivingQuestion: "How can parts of a whole affect a plan?",
        outcomes: [
          "Represent common fractions as equal parts of a whole.",
          "Calculate unit fractions and familiar fractions of whole-number quantities.",
          "Explain a stock allocation using fractions and counts.",
        ],
      },
      {
        id: "foundation.w11",
        number: 11,
        title: "Mini-enterprise decisions",
        drivingQuestion: "How do we compare income, cost and surplus?",
        outcomes: [
          "Calculate total cost and revenue from quantities and unit amounts.",
          "Distinguish revenue from surplus and explain why both matter.",
          "Revise a plan when a constraint or demand estimate changes.",
        ],
      },
      {
        id: "foundation.w12",
        number: 12,
        title: "Final challenge and reflection",
        drivingQuestion: "What can I now solve independently and explain to others?",
        outcomes: [
          "Complete an independent, unfamiliar multi-step problem using appropriate strategies.",
          "Present one project decision supported by calculations or measurements.",
          "Identify personal growth, a remaining gap, and an actionable next goal.",
        ],
      },
    ],
  },
];

/** Specification §1.6 fixed 90-minute lesson architecture (0–10, 10–25, 25–55, 55–78, 78–90). */
export const LEARNING_CYCLE = [
  { id: "discover", stage: "Discover", minutes: 10, summary: "A short, accessible mystery; children share a first estimate or idea." },
  { id: "learn", stage: "Learn", minutes: 15, summary: "Worked examples, with common mistakes pointed out." },
  { id: "solve", stage: "Solve", minutes: 30, summary: "One guided task, then an independent problem with feedback." },
  { id: "explain", stage: "Explain", minutes: 23, summary: "Children compare strategies and give reasons." },
  { id: "reflect", stage: "Reflect", minutes: 12, summary: "An individual written exit ticket and a next step." },
] as const;

export const PILLARS = [
  {
    id: "think",
    title: "Think deeply.",
    tag: "Mathematical reasoning",
    body: "Build number sense, use more than one strategy, notice patterns and check whether an answer makes sense.",
  },
  {
    id: "build",
    title: "Build solutions.",
    tag: "Practical problem-solving",
    body: "Turn ideas into practical decisions, useful models and small projects that can be tested and improved.",
  },
  {
    id: "explain",
    title: "Explain clearly.",
    tag: "Communication and confidence",
    body: "Show calculations, ask thoughtful questions, listen to other approaches and defend a conclusion with evidence.",
  },
] as const;

/** Why YPS is not tutoring, an abacus course or a generic coding club (Specification, Design decisions). */
export const DIFFERENCES = [
  { id: "not-tutoring", title: "Not extra homework", body: "Mathematical understanding comes first. Projects apply what was taught; they never replace instruction." },
  { id: "not-abacus", title: "Not an abacus course", body: "No abacus is needed. Children use paper, physical materials, discussion and mental strategies." },
  { id: "not-coding-club", title: "Not a gadget-first coding club", body: "Logic and instructions are taught with unplugged tasks. Devices are optional and never required." },
  { id: "individual", title: "Individual evidence", body: "Group work never replaces independent evidence. Every child shows what they can do on their own." },
] as const;

/** Specification §4.1 assessment schedule (parent-facing summary only). */
export const ASSESSMENT_EVENTS: readonly AssessmentEvent[] = [
  {
    id: "baseline",
    when: "Before Week 1",
    title: "Baseline",
    body: "A short entry conversation and diagnostic show each child's strengths and learning gaps.",
  },
  {
    id: "formative",
    when: "Every session",
    title: "Formative feedback",
    body: "A brief independent exit ticket and the instructor's observations help adapt teaching straight away.",
  },
  {
    id: "midpoint",
    when: "Week 6",
    title: "Midpoint check",
    body: "A short independent check and a project sample help spot stalled progress and plan support.",
  },
  {
    id: "final",
    when: "Week 12",
    title: "End-of-term assessment",
    body: "A final individual assessment plus a portfolio piece the child explains in their own words.",
  },
];

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
