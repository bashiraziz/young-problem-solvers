# Current state review — Milestone 2

Two snapshots: **A. baseline** (before any Milestone 2 change: `main` at `4d186e6`, production deployment READY) and **B. after Milestone 2** (branch `milestone-2`). Every "verified" line names its evidence; anything without evidence is under *Not tested*.

## A. Baseline audit (commit `4d186e6`)

**Environment:** Next.js 16.4.3 (App Router), React 19.3.1, TypeScript 5.9.3 strict, Tailwind 4, Node 24.20 locally (Node 22 pinned for CI/Vercel via `.nvmrc`). Deployed to Vercel project `young-problem-solvers` (production deployment `dpl_9Uhw5LLZeYSeGfFyDLo6c326fJuB`, state READY, commit `4d186e6`, queried via the Vercel API).

**Implemented vs placeholder:** one real route (`/`), `404`, `robots.txt`, empty `sitemap.xml`. No placeholder routes. The homepage contained hero, approach, 12-week list, a budget demo, parent section, pilot status and FAQ as sections of one page.

**Access mechanism (actual, not assumed):** Vercel Authentication, **All Deployments**, set via API on 24 Oct 2026 (it was Standard Protection before, which left production domains public). The app has no auth code. The brief's statement that "an unauthenticated visitor reaches `/login`" is **outdated**: that app-level gate was removed (ADR-007); visitors now get a `302` to `vercel.com/sso-api`.

| Check | Command / method | Result |
|---|---|---|
| Lint | `npm run lint` | exit 0 |
| Typecheck (strict) | `npm run typecheck` | exit 0 |
| Unit tests | `npm test` | exit 0 |
| Production build | `npm run build` | exit 0 |
| Playwright | `npx playwright test` | exit 0 — 19 passed, 2 skipped (by design) |
| Protection, production URL and generated deployment URL | `curl` of `/`, `/programme`, `/challenge`, `/parents`, `/about`, `/sitemap.xml`, `/api/x`, `/_next/static/chunks/main.js`, `/favicon.ico` | all `302 → vercel.com/sso-api` on both hosts |
| Secrets in Git | `git log --all -S<local password>` / `-S<local session secret>`; tracked `.env*` files | no hits; only `.env.example` tracked |
| Cookies / brute force | n/a — no app-managed auth exists any more | not applicable |

**Baseline defects found**
| ID | Sev | Finding | Status |
|---|---|---|---|
| D1 | P1 | The homepage demo and hero card used the numbers of the Specification's Week 2 lesson / individual check (UGX 25,000, 3,000 reserve, 14,000 supplies). The Specification keeps individual checks and answer keys instructor-only, so a parent-facing page must not reproduce them. | **Fixed:** replaced with an original scenario; a test now blocks assessment markers in shipped source. |
| D2 | P2 | Favicon was the default Next.js icon. | **Fixed:** YPS icon (`src/app/icon.svg`). |
| D3 | P2 | Single-page site; the brief requires Home, Programme, Challenge, For Parents and About. | **Fixed** (Milestone 2). |
| D4 | P3 | Programme page content did not carry weekly outcomes or stable IDs. | **Fixed.** |

No critical security defect and no broken fundamental UX was found at baseline, so nothing blocked Milestone 2.

## B. After Milestone 2 (branch `milestone-2`)

### Verified (with evidence)
| Area | Evidence |
|---|---|
| Quality gates | `npm run lint` exit 0 · `npm run typecheck` exit 0 · `npm test` exit 0 (**44 unit tests**) · `npm run build` exit 0 (7 static routes) · `npx playwright test` exit 0 (**72 passed, 3 skipped by design**, 3 viewports) |
| Challenge maths | `tests/unit/stall-challenge.test.ts`: reference answers worked out by hand (48,000 · 24,000 · 72,000 · 13,000 left; example plan cost 88,000, revenue 112,000, surplus 24,000, 3-of-4 scenario −5,400) independent of the code; boundary cases (exact budget, 1 item over, empty plan, quantity 0/200/201/−1/1.5/NaN, estimate band edges 57,599/57,600/86,400/86,401); typed-input parsing (`48,000`, `48 000`, `-5`, `4.5`, `abc`, `1e5`, empty, oversized) |
| Challenge flow | `tests/e2e/challenge.spec.ts` on 375/768/1440 px: estimate → calculate → choose → justify → reflect, mistakes and hints, worked answer after 3 hints, later steps lock when the plan is invalid, Start again clears everything, keyboard-only completion |
| Privacy of the challenge | e2e test: during a full run there are **no non-GET requests, no cross-origin requests**, and `localStorage`, `sessionStorage`, cookies and IndexedDB are empty. No accounts, database, AI API or cookies. |
| Navigation and links | e2e: all five routes reachable from the header (and the mobile menu), `aria-current="page"`, every internal link returns 200, every in-page anchor has a target, 404 page works |
| Runtime errors | e2e: each route loads with zero console errors, page errors, failed requests or HTTP ≥400 |
| Accessibility (automated) | axe with WCAG 2.0/2.1/2.2 A+AA tags: **0 serious/critical violations** on all five routes and on every challenge step, at all three viewports |
| Accessibility (manual/DOM) | one `h1` per page; landmarks; skip link first tab stop and works; visible 3 px focus ring on every control (earlier audit: 14 consecutive tab stops); focus moves to the step heading on each step change; hints, feedback and plan messages in `aria-live="polite"` regions; inputs have labels plus the question as description; mobile menu has `aria-expanded`, closes on Escape and after navigation; `prefers-reduced-motion` disables smooth scroll and transitions; no horizontal overflow at 375/768/1440 (e2e) and at 320 (earlier check) |
| Responsive layout | Screenshots `docs/review/*` at 375, 768, 1440. One real defect was found by reviewing them (D5 below) and fixed. |
| Claims | `src` scanned for testimonials, prices, enrolment calls, accreditation, partnerships, opening dates, guaranteed results: none. The only prices are the fictional stall's. Accreditation and validation are explicitly denied on Programme, About and FAQ. |
| Confidential material | Build output scanned (`.next/static`, 14 files): zero hits for assessment markers, answer-key wording, env var names, key/token patterns, the old 25,000 scenario or the removed location claim. A unit test blocks `INDIVIDUAL CHECK`, `EVIDENCE TO KEEP`, answer-key wording and `Form A/B` in shipped source; `public/` holds no downloadable documents. |
| Access protection | `npm run verify:protection -- https://young-problem-solvers.vercel.app` → all 10 paths `302 → vercel.com/sso-api`, exit 0 (production, current build). |
| Branch preview | Draft PR #1 → Vercel preview `https://young-problem-solvers-qupcemlpo-bashiraziz-projects.vercel.app` (commit `8b89dd6`, state READY). `verify:protection` on it: all 10 paths `302 → vercel.com/sso-api`, exit 0. |
| Content source | Unit titles, week titles, driving questions and outcomes match the Foundation Curriculum Specification V1; typed, versioned (`CURRICULUM.version`), stable IDs (`foundation.u1`, `foundation.w02`, …) in `src/content/`, separate from components. |

### Defects found and fixed during Milestone 2
| ID | Sev | Finding | Fix |
|---|---|---|---|
| D5 | P1 (UX) | At 375 px the Choose step's table needed sideways scrolling and clipped product names and quantity boxes. | Replaced the table with one card per product and a visible label per box; re-captured and re-tested. |
| D6 | P2 | Calculation prompts read badly ("60 samosas of samosa") and the four answer boxes shared one label. | Rewrote prompts; each input is described by its question. |
| D7 | P3 | Mobile menu could reopen after navigating away and back. | Menu open state is tied to the page it was opened on, and links close it; e2e test added. |

### Incomplete / by design (not defects)
- **Downloads:** none offered. The brief allows only approved parent/student excerpts; none were approved, so `public/` is empty of documents.
- **Student Workbook** was not cross-checked against the site.
- **Educator review** of the challenge's wording, difficulty and hints for ages 9–12 has not happened. It was written by the engineering agent and needs a teacher's eye before it is shown as evidence of pedagogy.
- Deferred by the brief: accounts, portals, LMS, payments, parent dashboards, AI tutors.

### Not tested (no evidence yet)
- **Authenticated rendering of the milestone preview** (protection is verified; what a signed-in reviewer sees is not). The agent cannot sign in to the owner's Vercel account.
- Lighthouse / Core Web Vitals on a deployed URL. (Earlier local measurement of the old homepage: LCP ≈ 224 ms, CLS 0.)
- Screen readers (NVDA, VoiceOver, TalkBack), 200 % text zoom, Windows High Contrast.
- Real phones and tablets; browsers other than Chromium.
- A child or parent actually using the challenge: timing (10–15 min claim), comprehension and difficulty are **unvalidated**.
- Vercel's behaviour when a team setting changes (the single-layer risk is mitigated only by `verify:protection` and process).

### Security notes
- **Authorization:** one mechanism — Vercel Authentication, All Deployments. Local Playwright cannot exercise it; protection is verified externally with `verify:protection` (production, generated URL, deep links, static asset path, API path). Run it against the preview URL before sharing.
- **No** app cookies, sessions, secrets, brute-force surface or environment variables exist; nothing to leak from the client bundle (scanned).
- Headers: `noindex`, `nosniff`, `X-Frame-Options: DENY`, referrer policy; no CSP yet (P2).
- Risk: if protection is disabled the site is public at once. Content is deliberately safe if that happens (no personal data, no instructor material).

### Prioritised remaining issues
| Sev | Issue | Recommendation |
|---|---|---|
| P1 | Challenge pedagogy unreviewed by an educator | Have an instructor/teacher review hints, wording, difficulty and the "3 out of 4" fraction step before wider sharing |
| P1 | Signed-in walkthrough of the preview not yet done | Owner signs in to Vercel and walks through the preview URL (protection already verified) |
| P2 | No CSP | Nonce-based CSP in Milestone 3 |
| P2 | Lighthouse, screen-reader and zoom checks outstanding | Run on the preview; record in this file |
| P2 | Student Workbook not cross-checked | Review in Milestone 3 |
| P3 | Hero is typographic; no illustrations | Commission purpose-made art (no identifiable children) |
| P3 | Obsolete `YPS_*` env vars may remain in Vercel | Owner deletes them |

### Walkthrough (annotated evidence in place of a video)
`docs/review/` holds, per viewport: `home`, `programme`, `challenge`, `parents`, `about` full pages, and for mobile and desktop the challenge at each stage: `challenge-step1` (wrong estimate + hint) → `step2` (zeros mistake feedback) → `step3` (plan within budget) → `step4` (reasons checked against the child's numbers) → `step5` (3-of-4 "what if" and self-check). The e2e test `full flow` is the executable version of the same walkthrough.

### Recommendation for Milestone 3
Educator review and iteration on the challenge first. Then, if approved: a second original challenge (e.g. data and evidence, Weeks 4–6), the content loader and schema validation from `docs/CURRICULUM_PLATFORM.md`, a CSP, and an owner-approved decision on any parent-facing downloads.
