# Young Problem Solvers — Claude Code Milestone 2 Brief

**Owner:** YPS Product Owner  
**Status:** Private development, not public enrolment  
**Technology decision:** Next.js App Router, TypeScript strict, React, Tailwind, Vercel, private GitHub repository

## Objective
Move from a protected informational prototype to a **reviewable, parent-convincing curriculum demonstration**, without expanding into a full learning management system. Preserve the YPS identity **Think. Build. Explain.** and the original 12-week Foundation Programme (ages 9–12, 24 × 90-minute sessions).

## Step 0 — Audit what is actually implemented

The deployed URL is `https://young-problem-solvers.vercel.app/`. An unauthenticated visitor currently reaches `/login`. This alone does **not** demonstrate that all application routes, API endpoints, downloadable resources and static files are properly protected.

Before adding features:

1. Report the current Git commit SHA, deployed environment, project structure, Next.js and TypeScript versions, and which routes/components are implemented versus placeholder.
2. Provide screenshots of every route on mobile (375 px), tablet (768 px), and desktop (1440 px), plus a short walkthrough of the actual deployed interactions. Redact secrets and personal information.
3. Run and report `lint`, `typecheck`, production build, unit tests, and Playwright smoke tests, with exact commands and exit status. If not configured, add them.
4. Verify login/logout behavior, access restrictions for direct deep links, API routes, static downloads and protected content, cookie attributes, secret handling, brute-force controls (if app-managed passwords), and cache headers. Document the actual access mechanism: Vercel Authentication versus app-managed password. Do not assume one is equivalent to the other.
5. Audit semantic HTML, keyboard navigation, visible focus, colour contrast, mobile layout, reduced-motion handling, broken links and runtime errors.
6. Confirm no false educational claims, testimonials, approvals, prices, school locations, test scores or opening dates are presented as established facts.
7. Produce a short `docs/CURRENT_STATE_REVIEW.md` with: verified, incomplete, defective, not tested; severity and recommendations. Do not mark any check as passed without evidence.

Fix **critical security defects and broken fundamental UX** before pursuing Milestone 2.

## Milestone 2 — Parent-facing curriculum demonstration

### A. Information architecture

Provide clear navigation to:

- **Home** — who YPS is for; Think. Build. Explain.; why the experience differs from tutoring, abacus and generic coding clubs; a meaningful *Try a Challenge* CTA.
- **Foundation Programme** — ages 9–12, 12 weeks, 24 sessions, four units and all weekly topics; specific observable learning outcomes; no promise of guaranteed gains.
- **Try a Challenge** — the working interactive demonstration below.
- **For Parents** — baseline assessment, formative feedback, end-of-term assessment, and an **illustrative** progress-report example.
- **About / Pilot Status** — transparently state that YPS is a developing educational programme; do not invent enrollment details.

These may be distinct routes or well-organised sections if there is a documented UX reason. Avoid empty pages and navigation dead ends.

### B. Interactive sample challenge — budget reasoning

Implement one polished, original **10–15-minute challenge** suitable for ages 9–12, for example planning a fictional refreshments stall with a UGX 100,000 budget. It must:

- clearly state age range, learning objectives, assumptions, unit prices and task instructions;
- progress from **estimate → calculate → choose → justify → explain / reflect**;
- validate totals (including units, change, remaining budget, simple revenue/cost/surplus) and handle edge cases; all reference answers verified in unit tests;
- give graduated hints and constructive feedback, including *why* a strategy works;
- let children enter or choose a reason for their decision without requiring a student account; avoid transmitting or persistently storing the response;
- work without paid AI APIs, databases, cookies for student progress, or collection of children's personal data;
- support keyboard operation, screen-reader labels, and mobile layouts;
- include a reset action and a short adult-facing explanation of what the activity measures **and does not measure**.

Do not turn this into an abacus demonstration, a multiple-choice-only quiz, or a flashy game without genuine mathematical learning objectives.

### C. Programme and reporting previews

- Show the four curriculum units and 12-week sequence faithful to the approved Foundation Curriculum Specification.
- Provide an **illustrative parent report**, clearly marked as sample data, with observable competencies and evidence of learning.
- If offering downloads, use only explicitly approved parent/student-facing excerpts. **Never expose instructor answer keys or confidential assessment items** in public bundles or static file paths.
- Place curriculum content in typed, versioned source files, separate from presentation components, with stable IDs for future localization and curricular revisions.

## Acceptance criteria

- Site remains protected in all intended environments; authorization checks and assets/direct deep links are tested. No secrets in client bundles or Git history.
- Next.js App Router + strict TypeScript retained; no database, accounts, payment processor, CMS or student-record collection added.
- No placeholder CTA, broken navigation, incorrect calculations or invented marketing assertions.
- Core experience demonstrable on 375px, 768px and 1440px; keyboard accessible and WCAG 2.2 AA-oriented.
- Automated unit tests cover challenge calculations and invalid input. Playwright smoke tests cover auth, navigation and complete challenge flow.
- `lint`, `typecheck`, test and production build all pass in CI and locally (report evidence).
- Documentation includes setup, `docs/CURRENT_STATE_REVIEW.md`, product/content decisions, any open risks and a concise changelog.
- Provide a Git commit/PR, exact preview URL, representative desktop/mobile screenshots, and a 3–5 minute walkthrough or equivalent annotated evidence.

## Delivery and decisions

Work in a feature branch/PR; do not merge to production, disable protection, make paid purchases, collect information about children or add new external services without Product Owner approval. If features are already implemented, demonstrate them rather than recreating them. List remaining issues by severity (P0–P3) and make a recommendation for Milestone 3.

**Explicitly defer:** full student portal, user accounts, teachers' LMS, enrollment/payment collection, parent dashboard with actual child records, AI tutors, school partnerships and multi-centre operations.

## Requested deliverable back to Product Owner

1. Current state audit with screenshots and test evidence.
2. Working interactive sample challenge integrated into the live protected development site.
3. Full 12-week programme presentation and illustrative parent report.
4. Risk list and recommended next milestone.

Keep this milestone narrow and demonstrably complete.
