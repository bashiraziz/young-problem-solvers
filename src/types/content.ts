export interface Week {
  /** Stable ID, e.g. "foundation.w02". Never reuse or renumber; revise via the curriculum version. */
  id: string;
  number: number;
  title: string;
  drivingQuestion: string;
  /** Observable "by the end of the week, each learner can…" outcomes. */
  outcomes: readonly string[];
}

export interface Unit {
  /** Stable ID, e.g. "foundation.u1". */
  id: string;
  number: number;
  title: string;
  focus: string;
  summary: string;
  weeks: readonly Week[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface AssessmentEvent {
  id: string;
  when: string;
  title: string;
  body: string;
}
