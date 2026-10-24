import manifestJson from "./v1/manifest.json";
import studentJson from "./v1/unit-1-student-content.json";
import { manifestSchema, studentContentSchema, type ContentStatus, type StudentLesson } from "./schema";

/**
 * The Foundation learning library: typed, validated, versioned content, kept apart from presentation.
 * Source: YPS Unit 1 Student Website Content Pack v1 (pilot draft, not validated).
 * Student-facing only. Teacher manuals, solutions and assessments are never imported here (ADR-009, ADR-010).
 */
export const manifest = manifestSchema.parse(manifestJson);
const student = studentContentSchema.parse(studentJson);

export const CONTENT_VERSION = manifest.contentVersion;

export interface Lesson extends StudentLesson {
  /** URL segment, e.g. "l01". */
  slug: string;
  /** Page of the printable coursebook / workbook PDF where this lesson starts. */
  coursebookPage: number;
  workbookPage: number;
}

export const lessonSlug = (id: string) => id.split("-").pop()!.toLowerCase();

const manifestLessons = manifest.units.find((u) => u.id === "unit-1")?.lessons ?? [];

export const UNIT_1_LESSONS: readonly Lesson[] = student.lessons.map((l, i) => {
  const meta = manifestLessons.find((m) => m.id === l.id);
  if (!meta) throw new Error(`Lesson ${l.id} is missing from the manifest`);
  if (meta.week !== l.wk || meta.session !== l.session || meta.title !== l.title || meta.question !== l.question) {
    throw new Error(`Lesson ${l.id}: manifest and student content disagree`);
  }
  return { ...l, slug: lessonSlug(l.id), coursebookPage: i + 3, workbookPage: 2 * i + 3 };
});

export const getLesson = (slug: string) => UNIT_1_LESSONS.find((l) => l.slug === slug);

export const getNeighbours = (slug: string) => {
  const i = UNIT_1_LESSONS.findIndex((l) => l.slug === slug);
  return { prev: UNIT_1_LESSONS[i - 1], next: UNIT_1_LESSONS[i + 1] };
};

export const UNIT_1 = { ...manifest.units[0], lessons: UNIT_1_LESSONS };
export const OUTLINED_UNITS = manifest.units.filter((u) => u.status === "outline-only");

export const STATUS_LABEL: Record<ContentStatus, string> = {
  "pilot-draft-not-validated": "Pilot draft: not validated",
  "approved-student-preview": "Approved student preview",
  "teacher-and-student-materials-drafted": "Pilot draft: under review",
  "outline-only": "Outline only: not yet written",
};

export const DOWNLOADS = [
  {
    id: "coursebook",
    title: "Student Coursebook",
    blurb: "Explanations and worked examples for all six lessons.",
    href: "/downloads/YPS_Unit1_Student_Coursebook_PILOT_DRAFT.pdf",
    pages: 8,
    pageOf: (l: Lesson) => l.coursebookPage,
  },
  {
    id: "workbook",
    title: "Student Workbook",
    blurb: "Practice sets, stretch challenges, exit tickets and a portfolio page.",
    href: "/downloads/YPS_Unit1_Student_Workbook_PILOT_DRAFT.pdf",
    pages: 15,
    pageOf: (l: Lesson) => l.workbookPage,
  },
] as const;

/** "Represent five-digit amounts…" becomes "I can represent five-digit amounts…". */
export const iCan = (objective: string) => `I can ${objective.charAt(0).toLowerCase()}${objective.slice(1)}`;

/** Practice entries arrive numbered ("1. Write…"); the page numbers them itself. */
export const stripNumber = (prompt: string) => prompt.replace(/^\d+\.\s*/, "");
