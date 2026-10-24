# Decisions

## ADR-001 — Next.js App Router + TypeScript (24 Oct 2026)
Mandated by the Product Owner. Replaces the v1 JavaScript/Vercel Functions prototype.

## ADR-002 — Single application, no monorepo or microservices (24 Oct 2026)
Product Owner recommendation, accepted. One deployable; modularise by folder. Revisit only with demonstrated need (independent scaling, separate team, different runtime).

## ADR-003 — Application-level shared-password gate (24 Oct 2026) — SUPERSEDED by ADR-007
Initially dropped in favour of Vercel Authentication. Reversed the same day: Product Owner has no paid Vercel plan, Vercel Password Protection is paid, and free Vercel Authentication admits only Vercel accounts with project access (reviewers would need to be added). The Product Owner approved a hardened gate, ported from the prototype and extended with throttling, fail-closed config, secret/password-bound sessions, 401 for non-page requests and no-store caching. Threat model and limits: `SECURITY.md`. Revisit if a paid plan or per-person access is needed.

## ADR-004 — Programme facts verified against the curriculum documents (24 Oct 2026)
Verified against `Foundation Curriculum Specification V1`, the Assessment & Reporting Pack and the Student Workbook, held in `~/Documents/Young_Problem_Solvers` (outside the repo). Corrections made: unit 3 is **"Design and Test"** (the spec; the implementation brief said "Design a Solution" — **conflict flagged to the Product Owner**, spec followed per brief §3); week titles 1, 8, 10, 12 aligned to the spec; unit emphasis and performance statements taken from spec §1.5; five-stage minutes from §1.6; sample report now mirrors Pack §6.2 (rubric 1–4, four competencies); FAQ aligned (entry range P4–P6, class size 12 marked as proposed, devices optional). The prototype claim about the "Kira area" appears nowhere in the spec and stays removed.

### Original note (superseded)
Curriculum docs were not yet supplied. Carried from the prototype: week titles and "36 learning hours" (24 × 90 min = 36 h, arithmetic verified). Changes: unit 3 renamed "Design a Solution" (per brief; prototype said "Design and Test"); the prototype FAQ claim about the "Kira area" was dropped as unverified. **Open:** confirm all against the Curriculum Specification.

## ADR-005 — E2E tests use port 3217 and never reuse a server
3100 was occupied by an unrelated app on the dev machine, which made tests hit the wrong server.

## ADR-006 — Curriculum platform: files-first content, two experiences in one app (24 Oct 2026)
Proposed (design only, not implemented). Curriculum content lives in versioned, schema-validated files (MDX + YAML/JSON) separate from code; the database, when introduced, holds people and progress only. Public academy site and instructor/student/parent platform are separate route groups with enforced module boundaries inside the single Next.js app. Details: `CURRICULUM_PLATFORM.md`. Pending Product Owner approval.

## ADR-007 — Vercel Authentication (All Deployments) replaces the app gate (24 Oct 2026)
Vercel now offers Vercel Authentication with All Deployments protection at no charge on all plans (docs updated 15 Sep 2026). Product Owner decision: enable it and remove the app-level gate entirely. Reasons: protection runs at the edge before the app (no public login page, no password guessing, no shared-password or per-instance throttle weaknesses); named, revocable accounts; less code to maintain. Trade-offs accepted: a single layer (disabling it exposes the site), reviewers need Vercel accounts, Hobby allows one external user. Applied via the Vercel API (`ssoProtection.deploymentType = "all"`; it was previously Standard Protection, which left production domains public) and verified from outside before the gate code was deleted. The removed implementation remains in git history at `0934039`. Obsolete Vercel env vars `YPS_SITE_PASSWORD` / `YPS_SESSION_SECRET` should be deleted from the project. Details and risks: `SECURITY.md`.

## ADR-008 — Multi-route information architecture (Milestone 2)
Home, Foundation Programme, Try a Challenge, For Parents and About are separate routes, not sections of one page. UX reasons: each audience question gets a focused page and a shareable URL; the challenge needs room and its own heading structure; the single long page was hard to navigate on phones. Every route has one `h1`, its own metadata and a place in header, mobile menu and footer; no empty pages or dead ends (link-crawler test).

## ADR-009 — Original challenge; keep instructor material out of the public app (Milestone 2)
The earlier homepage demo reproduced the Specification's Week 2 numbers, which come from an instructor-only lesson and individual check. It was replaced by an original, fictional scenario (UGX 100,000 refreshments stall) with its own data file; reference answers are computed from that data and verified in tests. Only parent-facing curriculum content (titles, driving questions, observable outcomes, assessment timeline) is published. A unit test fails the build if assessment markers or answer-key wording appear in shipped source, and `public/` must contain no documents. No downloads were offered because none were approved. Challenge answers are a client-side demonstration only: nothing is stored or transmitted.

## ADR-010 — Learning Library: student content only, answers as rules, two approved downloads (Milestone 3)
Context: the owner supplied a student content pack and asked for a Foundation learning library. The GitHub repository is public, so anything committed is readable by anyone.
Decisions: (1) Only student-facing content is committed (`src/content/foundation/v1/*.json`, validated by a strict Zod schema that rejects answer-like fields) plus the two student PDFs (`public/downloads/`, labelled pilot draft). Teacher manuals, answer keys, the unit assessment and the teacher-pack zip are never committed; `.gitignore` blocks them and tests guard `public/` and `src/`. (2) Interactive questions store parameters and a rule, never an answer string; correct responses are computed in the browser. This keeps children's input local (the privacy rule) at the cost that a reader of the JavaScript could compute answers. Server-side checking would hide them but would transmit what children type, so it is deferred to the Product Owner. (3) Only lessons whose practice differs from their worked example are interactive (L1, L2); L3 to L6 are scaffolded until the practice numbers are revised. (4) `/programme` moved to `/programme/foundation` (temporary redirect); `/curriculum` and `/parents/progress-example` were not added because they would duplicate existing pages. (5) Production release needs Product Owner approval; nothing here is merged.
