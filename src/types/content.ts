export interface Week {
  number: number;
  title: string;
}

export interface Unit {
  number: number;
  title: string;
  focus: string;
  summary: string;
  weeks: readonly Week[];
}

export interface FaqItem {
  question: string;
  answer: string;
}
