# YPS — Content Milestone 3: Build the Learning Library

**Target:** Existing Next.js App Router / TypeScript strict application on Vercel  
**Status:** Product specification / approval required before deployment  
**Start from what already exists; do not rebuild functioning pages.**

## Why this milestone
The website needs educational substance. YPS now has a 12-week scope/sequence and first complete six-lesson Unit 1 pilot content pack. Add a reviewable learning library, not an empty LMS.

## Review before any implementation
1. Pull the latest `main` and report commit SHA, current routes, components, data model, protections and existing download surfaces.
2. Compare present pages with the proposed target below. Reuse existing features and avoid duplicate navigational routes.
3. Verify whether the live deployment is behind Vercel Authentication or app-level password; test deep links and protected API assets.
4. Ensure the public repo has no secrets, teacher keys, assessment keys or learner PII in *any committed history*.
5. Produce `docs/content-current-state.md` summarizing verified, missing, blocked and proposed changes, with screenshots.

## Product information architecture
- `/programme/foundation` — overview, four units, 12 weeks, outcomes, ages 9–12, 24 × 90-minute sessions.
- `/learn/foundation/unit-1` — unit landing page, learner goals and six lesson cards.
- `/learn/foundation/unit-1/lesson/[id]` — student-friendly textbook explanations, worked examples and two guided prompts. No answer keys displayed by default.
- `/practice/foundation/unit-1/lesson/[id]` — independent learner workbook exercise view. Make printable PDF available only for explicitly approved student material.
- `/parents/progress-example` — *illustrative* competency report with sample data only.
- `/curriculum` — overview and transparent pilot status; no invented accreditation, tests, fee claims or testimonials.

## Source material
- `unit-1-public-course-manifest.json`: typed syllabus facts/lesson metadata, intended for a versioned content library.
- `unit-1-student-content.json`: six student lessons, explanations and exercise prompts (no answers), appropriate for approved student views.
- `YPS_Unit1_Student_Coursebook_v1.docx` and `.pdf`: student textbook, separately editable/printable.
- `YPS_Unit1_Student_Workbook_v1.docx` and `.pdf`: student practice and reflection material.
- `YPS_Unit1_Assessment_Student_CONFIDENTIAL_v1.docx` and `.pdf`: student unit assessment, not for public publication before testing.
- `YPS_Unit1_Teacher_Manual_CONFIDENTIAL_v1.docx` and `.pdf`: **confidential, MUST NOT be copied, imported or committed into public repository, `/public`, server bundles, Vercel build artifact or logs.** Distribute only through private approved channels.

## Curriculum architecture
- Keep content in `content/programmes/foundation/v1/` (or comparable) separate from rendering and UI components.
- Type-check with a schema (Zod or TypeScript + runtime validation) for stable IDs, units, lesson order, learning objectives and print assets.
- Preserve `contentVersion` and `status` fields (`pilot-draft-not-validated`, `approved-student-preview`, etc.).
- Render semantic mathematical text and accessible tables. Avoid embedding all content in client components.
- Keep the instructor answers outside *all code in the public repository*. A password-protected route is insufficient protection against access to public Git history.
- Do not create student logins, child data storage, actual progress analytics, grading AI, databases, payments, or CMS in this milestone.

## Learning experience
1. Start each lesson with the driving question and 2–3 “I can …” objectives.
2. Explain the concept with concise worked examples and representations. Let learners reveal the steps progressively.
3. Show guided questions; offer hints by *method*, not by exposing answers immediately.
4. Link to independent print practice and a simple reflection prompt.
5. Allow a local-only anonymous answer scratchpad, if useful. Do not save, transmit, or track children's written answers.
6. Provide inclusive scaffolds: large tap targets, keyboard use, screen-reader labels, 375px mobile layout, and printable A4 worksheets.
7. Make it obvious that Unit 1 is under review and Units 2–4 are outlined but not yet authored.

## Pilot learner and instructor quality
- Ask two Uganda primary mathematics educators to check content and questions before wider publication.
- Run usability tests with adults and supervised child pilots only with parental consent; retain no child data in Git or analytics.
- Mark teacher-only materials as confidential. Use a **separate private repository** or private content store later only if a staff portal is approved.

## Acceptance criteria
- Confirm latest commit and list present feature coverage before changes.
- Complete a polished unit landing page and at least 2 fully functional lesson/practice views; scaffold the remaining 4 lessons from content JSON with consistent design.
- Unit menu lists all six lessons, correctly tied to week/session and objectives.
- All student answers absent from the public source, downloadable files, and client bundles; test with repository search and build artifact inspection.
- Printable student coursebook and workbook downloads preserve A4 layout and are labelled pilot drafts.
- Tests cover content schema, lesson routes, math examples, keyboard operation, and responsive layout; build, lint and type check pass.
- Provide Playwright desktop/mobile screenshots, links, accessibility notes, test results, Git SHA and PR for approval. Do not merge/publish without approval.

## Content expansion roadmap
1. **Now:** Unit 1 (Weeks 1–3) pilot, educator review and revisions.
2. **Next:** Unit 2 (Weeks 4–6) investigative measurement and data content.
3. **Then:** Unit 3 (Weeks 7–9) patterns, algorithms, prototyping.
4. **Then:** Unit 4 (Weeks 10–12) fractions, mini-enterprise, presentations and independent capstone.
5. **Later:** parent/student accounts and individual progress — only after safeguarding, privacy design and pilot evidence justify them.

## Reporting
Before coding, return a concise current-state audit. Then implement on a branch and provide screenshots, precise test outcomes and reviewable PR. Product Owner approves any publishing and public download of materials.
