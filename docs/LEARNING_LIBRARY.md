# YPS Learning Library (Milestone 3)

A lightweight, reviewable library for the Foundation Programme, ages 9 to 12. Unit 1 (Think with Numbers, Weeks 1 to 3) is a **pilot draft, not validated**. Units 2 to 4 appear only as outlines.

No accounts, database, payments, CMS, analytics or stored student data. Everything is static pages plus client-side practice that never stores or sends what a child types.

## What was built

| Route | Purpose |
|---|---|
| `/programme/foundation` | Overview (moved from `/programme`, which forwards). Four units, 12 weeks, status per unit |
| `/learn/foundation/unit-1` | Unit landing: goals, six lesson cards tied to week and session, print links, outlined Units 2 to 4 |
| `/learn/foundation/unit-1/lesson/l01` … `l06` | Driving question, "I can" goals, big idea, step-by-step reveal, worked example, guided questions, links to practice and print |
| `/practice/foundation/unit-1/lesson/l01` … `l06` | Six practice questions, stretch challenge, exit ticket, print links |
| `/downloads/…PILOT_DRAFT.pdf` | Student coursebook (8 pp) and workbook (15 pp), A4, each opens at the lesson's page |

**Two complete interactive lessons: 1 (Place Value) and 2 (Estimate, Calculate, Check).** Lessons 3 to 6 are scaffolded from the content file in the same design: full lesson text and worked example, every prompt shown word for word with a local scratchpad, no answer checking (see flag 1).

## Learning experience

1. Each lesson opens with the driving question and three "I can …" goals.
2. The method appears one step at a time ("Show step 2 of 3"), then the worked example, with an accessible table where it helps (place-value table, estimate-versus-exact table).
3. Guided questions give **hints by method**, up to three, easiest nudge last. A wrong answer gets a nudge about the kind of slip (for example "your answer is ten times too big"), never the answer.
4. Written explanations use a local scratchpad (never saved or sent) plus a "check yourself" list the child ticks. Nothing is scored.
5. Large tap targets, native form controls, keyboard operation, labelled inputs, live regions for feedback, 375 px layout, tables that scroll with a keyboard-focusable region.
6. A small "n of N parts finished" count lives only in the page's memory.

## Architecture

- `src/content/foundation/v1/manifest.json` and `unit-1-student-content.json`: the supplied files, unchanged. Validated at build time by Zod (`schema.ts`, strict: any unknown or answer-like field fails the build). `contentVersion` and `status` are preserved (`2026-10-pilot-v1`, `pilot-draft-not-validated`).
- `src/content/foundation/index.ts`: joins manifest and student content, checks they agree, adds URL slugs and PDF page numbers.
- `src/content/foundation/unit-1-items.ts`: interactive questions. Each stores the **parameters** of the question; the prompt text comes from the content file.
- `src/lib/learning/items.ts`: pure rules and checkers (no UI, no storage).
- `src/components/learning/*`: client components only where there is interaction; lesson text renders on the server.

### How answers are handled (read this)

No file in the repository contains an answer key or answer strings. A question stores its numbers, and a rule works out the correct response in the browser (for example "round 6,450 to the nearest 100"). End-to-end tests compute their inputs the same way, rather than listing an answer table.

**Limit:** the checking code ships to the browser, so someone who reads the JavaScript could work out the answers. The brief asks for answers to be absent from client bundles. Truly hiding them means checking on a server, which would transmit what a child typed. That conflicts with the rule that children's answers are never transmitted or stored, so it was **not** done. Decision for the Product Owner (ADR-010).

### What is never in the repository

Teacher manuals, answer keys, the unit assessment, and the teacher-pack zip. They stay in `docs/` locally and are blocked by `.gitignore`. Tests fail if `public/` holds any document other than the two approved student PDFs, if their names look confidential, or if `src/` mentions the confidential file names. The browser test downloads every script a lesson page loads and searches for confidential markers; a build-output search found none.

## Review flags (changes and decisions for the Product Owner)

1. **Practice answers appear inside worked examples in Lessons 3 to 6.** The model text in the content file already contains the working for most practice questions: L3 questions 1 to 5 (22,000; 5,000; 3,000; 14,000; 8,000), L4 questions 1 to 3, L5 questions 2 to 4, L6 questions 1 to 5. A child can copy them, and an answer checker would test nothing. That is why only Lessons 1 and 2 (whose practice differs from the worked examples) are interactive. **Recommendation:** have the content author use different numbers in the practice questions for L3 to L6, then switch them on. No teaching sequence was changed.
2. **The L3 worked example uses the Specification's Week 2 numbers** (budget UGX 25,000, reserve 3,000, required supplies 14,000). In Milestone 2 these were removed from the site because they came from an instructor-only lesson and individual check (ADR-009). The supplied student pack publishes them. If the confidential individual check relies on the same figures, students who study this lesson will have seen them. Please confirm this is intended.
3. **The repository is public** (it was created private). The student pilot drafts and PDFs on this branch will be readable on GitHub once pushed, whatever Vercel Authentication does. The pack's own README says student publication waits for educator and Product Owner approval.
4. **Written by Claude, not in the supplied pack (needs educator review):** all hints, the "check yourself" prompts, the kind feedback messages, and the short labels such as "Which amount is larger?" and "Show your chosen rounding." They are derived from each lesson's key idea and steps. The rounding hints use the usual "5 or more rounds up" rule, which the content file implies but does not state. Practice question 4 in Lesson 2 accepts either rounding (nearest 100 or 1,000), because the question says "show your chosen rounding".
5. **Status mapping.** The manifest marks Unit 1 `teacher-and-student-materials-drafted`; the site shows this as "Pilot draft: under review". Units 2 to 4 show "Outline only".
6. **Routes not created** because they would duplicate existing pages: `/curriculum` and `/parents/progress-example`.
7. **The PDFs carry "PILOT DRAFT" footers** and are A4 (verified: 595 × 842 pt). The site labels them as pilot drafts. A text search of both PDFs found no answer-key section (only worked examples in the coursebook), and the workbook's name and date lines are blank.
8. **Educator review and child pilots** (brief: two Uganda primary mathematics educators; parental consent for any child session; no child data kept) have not happened and cannot be done by Claude.

## Not done, on purpose

Student accounts, progress storage, analytics, AI marking, a CMS, Units 2 to 4 content, teacher or staff portal, server-side answer checking.
