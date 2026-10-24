import { z } from "zod";

/** Runtime validation for the versioned Foundation content files. A malformed file fails the build. */

const lessonId = z.string().regex(/^YPS-F1-U[1-4]-L0[1-6]$/);
const nonEmpty = z.string().min(1);

export const CONTENT_STATUS = z.enum([
  "pilot-draft-not-validated",
  "approved-student-preview",
  "teacher-and-student-materials-drafted",
  "outline-only",
]);
export type ContentStatus = z.infer<typeof CONTENT_STATUS>;

const manifestLesson = z.object({
  id: lessonId,
  week: z.number().int().min(1).max(12),
  session: z.number().int().min(1).max(2),
  title: nonEmpty,
  question: z.string().endsWith("?"),
  learningObjectives: z.array(nonEmpty).length(3),
}).strict();

export const manifestSchema = z.object({
  schemaVersion: z.string(),
  programmeId: z.literal("yps-foundation"),
  contentVersion: nonEmpty,
  title: nonEmpty,
  ageBand: z.tuple([z.number(), z.number()]),
  durationWeeks: z.literal(12),
  sessionsPerWeek: z.literal(2),
  sessionMinutes: z.literal(90),
  status: CONTENT_STATUS,
  publicationNotice: nonEmpty,
  units: z
    .array(
      z.object({
        id: z.string().regex(/^unit-[1-4]$/),
        title: nonEmpty,
        weeks: z.array(z.number().int()).length(3),
        status: CONTENT_STATUS,
        lessons: z.array(manifestLesson).optional(),
      }),
    )
    .length(4),
  weeks: z
    .array(
      z.object({
        week: z.number().int().min(1).max(12),
        title: nonEmpty,
        objectives: z.array(nonEmpty).length(3),
        drivingQuestion: z.string().endsWith("?"),
      }),
    )
    .length(12),
});

const studentLesson = z.object({
  id: lessonId,
  wk: z.number().int(),
  session: z.number().int(),
  title: nonEmpty,
  question: z.string().endsWith("?"),
  objectives: z.array(nonEmpty).length(3),
  keyidea: nonEmpty,
  model: nonEmpty,
  worked_steps: z.array(nonEmpty).min(3),
  guided: z.array(nonEmpty).length(2),
  practice: z.array(nonEmpty).length(6),
  challenge: nonEmpty,
  exit: nonEmpty,
}).strict();

export const studentContentSchema = z
  .object({
    schemaVersion: z.string(),
    unitId: z.string(),
    visibility: z.literal("student-preview"),
    lessons: z.array(studentLesson).length(6),
  })
  // Student files carry no answers. Reject any field that looks like a key rather than trusting reviewers to notice.
  .strict();

export type StudentLesson = z.infer<typeof studentLesson>;
export type Manifest = z.infer<typeof manifestSchema>;
