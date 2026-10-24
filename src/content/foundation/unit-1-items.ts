import type { Lesson } from "./index";
import { stripNumber } from "./index";
import type { Item, OpenItem } from "@/lib/learning/items";

/**
 * Interactive items for Unit 1. Prompts come from the student content file; each item adds only the parameters of
 * the question and the method hints. There are NO answer strings here: correct responses are worked out by the rules
 * in `@/lib/learning/items` (see the design note there).
 *
 * Hints and the "check yourself" prompts below are written for the pilot, from each lesson's key idea and worked
 * steps. They are flagged for educator review in docs/LEARNING_LIBRARY.md.
 */

export interface LessonPractice {
  /** True when answers are checked on the page; false when the lesson is scaffolded from the content file only. */
  interactive: boolean;
  guided: readonly Item[];
  practice: readonly Item[];
  challenge: Item;
  exit: Item;
}

const open = (id: string, prompt: string, selfCheck: readonly string[] = [], hints: readonly string[] = []): OpenItem => ({
  id,
  kind: "open",
  prompt,
  selfCheck,
  hints,
});

const EXPLAIN_WITH_PLACES = [
  "I named the first place where the two numbers are different.",
  "I used place-value words such as thousands, hundreds, tens or ones.",
] as const;

const L01 = (l: Lesson): LessonPractice => {
  const id = (s: string) => `${l.id}.${s}`;
  return {
    interactive: true,
    guided: [
      {
        id: id("g1"),
        kind: "group",
        prompt: l.guided[0],
        hints: [],
        parts: [
          {
            id: id("g1a"),
            kind: "choice",
            prompt: "Which amount is larger?",
            rule: { rule: "larger", a: 18_950, b: 19_050 },
            hints: ["Write both amounts in a place-value table.", "Start at the left. Compare the ten-thousands, then the thousands, then the hundreds."],
          },
          open(id("g1b"), "Explain how you know.", EXPLAIN_WITH_PLACES),
        ],
      },
      {
        id: id("g2"),
        kind: "parts",
        prompt: l.guided[1],
        number: 32_406,
        hints: ["Write the number in a place-value table first.", "Each box holds the value of its column. A column with a 0 digit is worth 0."],
      },
    ],
    practice: [
      {
        id: id("p1"),
        kind: "parts",
        prompt: stripNumber(l.practice[0]),
        number: 40_305,
        hints: ["Draw a place-value table.", "A digit 0 in a column means that column is worth 0."],
      },
      {
        id: id("p2"),
        kind: "number",
        prompt: stripNumber(l.practice[1]),
        label: "Value of the digit 7",
        rule: { rule: "valueOfDigit", number: 57_219, digit: 7 },
        hints: ["Find which column the 7 is in.", "Say the column name, then say how much that column is worth."],
      },
      {
        id: id("p3"),
        kind: "choice",
        prompt: stripNumber(l.practice[2]),
        rule: { rule: "compare", a: 28_409, b: 28_490 },
        hints: ["The ten-thousands and thousands match, so look at the hundreds.", "If the hundreds match too, move right to the tens."],
      },
      {
        id: id("p4"),
        kind: "order",
        prompt: stripNumber(l.practice[3]),
        numbers: [9_200, 8_950, 9_020, 8_905],
        hints: ["Compare the thousands digits first.", "When two numbers share the thousands digit, compare their hundreds."],
      },
      open(id("p5"), stripNumber(l.practice[4]), ["I said which digits swapped places.", "I said how the value changed, using place-value words."], [
        "Write both numbers in a place-value table.",
        "Find the column where the two numbers are different.",
      ]),
      {
        id: id("p6"),
        kind: "group",
        prompt: stripNumber(l.practice[5]),
        hints: [],
        parts: [
          {
            id: id("p6a"),
            kind: "between",
            prompt: "Type two different amounts, separated by a space.",
            low: 12_450,
            high: 12_500,
            count: 2,
            hints: ["The ten-thousands, thousands and hundreds are the same as in both numbers.", "Choose the tens digit carefully."],
          },
          open(id("p6b"), "Explain why they fit.", ["I compared my amounts with both numbers, not just one."]),
        ],
      },
    ],
    challenge: open(id("c"), l.challenge, ["I compared the numbers from the highest place value.", "I did not decide from the last digits alone."], [
      "Write the three prices in a place-value table.",
      "Which column decides which price is highest?",
    ]),
    exit: {
      id: id("x"),
      kind: "group",
      prompt: l.exit,
      hints: [],
      parts: [
        {
          id: id("xa"),
          kind: "choice",
          prompt: "Which is greater?",
          rule: { rule: "larger", a: 30_099, b: 29_999 },
          hints: ["Compare the ten-thousands digits first."],
        },
        open(id("xb"), "Explain using one place value.", ["I named one place value and compared it."]),
      ],
    },
  };
};

const L02 = (l: Lesson): LessonPractice => {
  const id = (s: string) => `${l.id}.${s}`;
  const ROUND_HINTS = ["Decide which place you are rounding to.", "Look at the digit to its right: 5 or more rounds up, 4 or less stays."];
  return {
    interactive: true,
    guided: [
      {
        id: id("g1"),
        kind: "group",
        prompt: l.guided[0],
        hints: [],
        parts: [
          {
            id: id("g1a"),
            kind: "number",
            prompt: "First, estimate.",
            label: "My estimate (UGX)",
            rule: { rule: "estimateSum", terms: [7_480, 2_620], nearest: [1_000] },
            hints: ROUND_HINTS,
          },
          {
            id: id("g1b"),
            kind: "number",
            prompt: "Now calculate exactly.",
            label: "Exact sum (UGX)",
            rule: { rule: "sum", terms: [7_480, 2_620] },
            hints: ["Add the ones, then the tens, then the hundreds, then the thousands.", "Regroup (carry) when a column reaches 10."],
          },
        ],
      },
      open(
        id("g2"),
        l.guided[1],
        ["I rounded both amounts to make an estimate.", "I compared my estimate with the child's answer.", "I checked the exact sum a second way."],
        ["Round both amounts to the nearest 1,000 and add.", "Is the child's answer near your estimate?"],
      ),
    ],
    practice: [
      {
        id: id("p1"),
        kind: "group",
        prompt: stripNumber(l.practice[0]),
        hints: [],
        parts: [
          { id: id("p1a"), kind: "number", prompt: "Nearest 100.", label: "6,450 to the nearest 100", rule: { rule: "roundTo", value: 6_450, nearest: 100 }, hints: ROUND_HINTS },
          { id: id("p1b"), kind: "number", prompt: "Nearest 1,000.", label: "6,450 to the nearest 1,000", rule: { rule: "roundTo", value: 6_450, nearest: 1_000 }, hints: ROUND_HINTS },
        ],
      },
      {
        id: id("p2"),
        kind: "number",
        prompt: stripNumber(l.practice[1]),
        label: "My estimate (UGX)",
        rule: { rule: "estimateSum", terms: [2_780, 5_120], nearest: [1_000] },
        hints: ROUND_HINTS,
      },
      {
        id: id("p3"),
        kind: "number",
        prompt: stripNumber(l.practice[2]),
        label: "Exact sum (UGX)",
        rule: { rule: "sum", terms: [2_780, 5_120] },
        hints: ["Add the ones first.", "Compare your exact sum with your estimate from Question 2."],
      },
      {
        id: id("p4"),
        kind: "group",
        prompt: stripNumber(l.practice[3]),
        hints: [],
        parts: [
          {
            id: id("p4a"),
            kind: "number",
            prompt: "Estimate. Round to the nearest 100 or the nearest 1,000.",
            label: "My estimate (UGX)",
            rule: { rule: "estimateSum", terms: [12_490, 3_710], nearest: [100, 1_000] },
            hints: ROUND_HINTS,
          },
          { id: id("p4b"), kind: "number", prompt: "Calculate exactly.", label: "Exact sum (UGX)", rule: { rule: "sum", terms: [12_490, 3_710] }, hints: ["Regroup (carry) when a column reaches 10."] },
          open(id("p4c"), "Show your chosen rounding.", ["I wrote which place I rounded to."]),
        ],
      },
      {
        id: id("p5"),
        kind: "group",
        prompt: stripNumber(l.practice[4]),
        hints: [],
        parts: [
          { id: id("p5a"), kind: "number", prompt: "Correct the total.", label: "Correct total (UGX)", rule: { rule: "sum", terms: [5_750, 2_250] }, hints: ["Add the two prices again, carefully.", "Round both to the nearest 1,000 to see if the sign is sensible."] },
          open(id("p5b"), "Explain the mistake.", ["I said what was wrong with the sign.", "I showed a check."]),
        ],
      },
      open(id("p6"), stripNumber(l.practice[5]), ["I gave a situation where a closer estimate matters.", "I compared rounding to 100 with rounding to 1,000."], [
        "Which rounding gives an estimate closer to the exact answer?",
      ]),
    ],
    challenge: {
      id: id("c"),
      kind: "group",
      prompt: l.challenge,
      hints: [],
      parts: [
        { id: id("ca"), kind: "number", prompt: "Estimate first.", label: "My estimate (UGX)", rule: { rule: "estimateSum", terms: [9_650, 10_250], nearest: [1_000] }, hints: ROUND_HINTS },
        { id: id("cb"), kind: "number", prompt: "Now calculate the exact cost of both items.", label: "Exact cost (UGX)", rule: { rule: "sum", terms: [9_650, 10_250] }, hints: ["Add the hundreds carefully. Regroup when needed."] },
        {
          id: id("cc"),
          kind: "choice",
          prompt: "Is the money enough?",
          rule: { rule: "withinBudget", terms: [9_650, 10_250], budget: 20_000 },
          hints: ["Compare the exact cost with UGX 20,000."],
        },
      ],
    },
    exit: {
      id: id("x"),
      kind: "group",
      prompt: l.exit,
      hints: [],
      parts: [
        {
          id: id("xa"),
          kind: "choice",
          prompt: "Is the reported total right?",
          rule: { rule: "claimIsCorrect", terms: [8_350, 5_250], claimed: 14_600 },
          hints: ["Estimate first: round both amounts to the nearest 1,000.", "Then add exactly."],
        },
        open(id("xb"), "Show a check.", ["I used an estimate or a second method."]),
      ],
    },
  };
};

/** Lessons without interactive checking yet: every prompt gets a local scratchpad, in the same design. */
const scaffold = (l: Lesson): LessonPractice => {
  const id = (s: string) => `${l.id}.${s}`;
  return {
    interactive: false,
    guided: l.guided.map((g, i) => open(id(`g${i + 1}`), g)),
    practice: l.practice.map((p, i) => open(id(`p${i + 1}`), stripNumber(p))),
    challenge: open(id("c"), l.challenge),
    exit: open(id("x"), l.exit),
  };
};

const BUILDERS: Record<string, (l: Lesson) => LessonPractice> = {
  "YPS-F1-U1-L01": L01,
  "YPS-F1-U1-L02": L02,
};

export const practiceFor = (lesson: Lesson): LessonPractice => (BUILDERS[lesson.id] ?? scaffold)(lesson);
