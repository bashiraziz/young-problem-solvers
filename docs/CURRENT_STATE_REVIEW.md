# Current state review — Milestone 2

Three parts: **A. baseline** (before any Milestone 2 change: `main` at `4d186e6`, production deployment READY) **B. after Milestone 2** (branch `milestone-2`, merged as `969cd6e`), and **C. an independent verification pass** (branch `verification-hardening`). Every "verified" line names its evidence; anything without evidence is under *Not tested*.

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

### Not tested (no evidence)
- **A real screen reader** (NVDA, VoiceOver, TalkBack). Replaced by automated checks only: axe, accessible-name and heading/landmark assertions, and keyboard/focus tests (see section C). Real assistive-technology use is untested.
- **Real phones and tablets.** Emulated viewports in Chromium, plus Firefox (desktop) and WebKit (iPhone viewport) engines, were tested; physical devices were not.
- **A child or parent using the challenge.** Timing, comprehension and difficulty are **unvalidated**; "about 15 minutes" is a text-based estimate (section C).
- **Production's own response headers while signed in.** Protected production would need a Trusted Sources rule for the agent's token, which is an access-control change that was not made. The identical commit was tested on its preview (strict CSP, headers, full suite); production differs only in omitting Vercel's preview-toolbar allowances.

### Security notes
- **Authorization:** one mechanism — Vercel Authentication, All Deployments. Local Playwright cannot exercise it; protection is verified externally with `verify:protection` (production, generated URL, deep links, static asset path, API path). Run it against the preview URL before sharing.
- **No** app cookies, sessions, secrets, brute-force surface or environment variables exist; nothing to leak from the client bundle (scanned).
- Headers: `noindex`, `nosniff`, `X-Frame-Options: DENY`, referrer policy; no CSP yet (P2).
- Risk: if protection is disabled the site is public at once. Content is deliberately safe if that happens (no personal data, no instructor material).

### Prioritised remaining issues
| Sev | Issue | Recommendation |
|---|---|---|
| P1 | **A bypass secret was created by the agent** and could not be revoked by it (blocked by the permission system). `vercel curl` generated a project-level *Protection Bypass for Automation* secret at 14:17:37 UTC on 24 Oct 2026. Anyone holding it can skip Vercel Authentication. Its identifier also appeared in the agent's session output. | Revoke it: Vercel → Project → Settings → Deployment Protection → Protection Bypass for Automation → revoke (or allow the agent to call the protection-bypass API and it will revoke it). `npm run verify:protection` should still pass afterwards. |
| P1 | Challenge pedagogy is unvalidated with children and not reviewed by a human educator | Observe a few children/parents using it; adjust hints and timing; keep the "estimate" wording until then |
| P2 | Obsolete `YPS_SESSION_SECRET` and `YPS_SITE_PASSWORD` env vars remain on the Vercel project (production, sensitive). The app no longer reads them; deleting them was also blocked for the agent. | Delete in Project → Settings → Environment Variables |
| P2 | Real screen-reader testing not done | Do a pass with NVDA/VoiceOver when a tester is available |
| P3 | Hero is typographic; no illustrations | Purpose-made art without identifiable children |
| P3 | Week titles differ between the Specification and the child-facing Workbook for 10 of 12 weeks | Site follows the Specification; choose one naming set if parents will also see the Workbook |

### Walkthrough (annotated evidence in place of a video)
`docs/review/` holds, per viewport: `home`, `programme`, `challenge`, `parents`, `about` full pages, and for mobile and desktop the challenge at each stage: `challenge-step1` (wrong estimate + hint) → `step2` (zeros mistake feedback) → `step3` (plan within budget) → `step4` (reasons checked against the child's numbers) → `step5` (3-of-4 "what if" and self-check). The e2e test `full flow` is the executable version of the same walkthrough.

## C. Independent verification pass (agent-run, after the merge of Milestone 2)

Everything below was run by the agent. Branch `verification-hardening`.

| Check | Method | Result |
|---|---|---|
| **Deployed preview, full e2e** | Suite run against the Vercel preview of the branch, authenticated with the CLI's short-lived OIDC token (`x-vercel-trusted-oidc-idp-token`; third-party requests answered locally so the token cannot leave; `playwright.deployed.config.ts`) | **177 passed, 3 skipped by design**, at 375/768/1440 px, on commit `dbefc01` (preview `young-problem-solvers-a1zlkylti-…vercel.app`) |
| **Lighthouse 13.5** (preview, mobile and desktop, 5 routes) | `lighthouse` via Chrome, same token header | Accessibility **100** and Best practices **100** on all 10 runs. Performance: mobile 90–96, desktop 99. LCP 2.5 s mobile (simulated slow 4G) / 0.6 s desktop; CLS 0; TBT 0–320 ms. SEO is intentionally not scored (`noindex`). |
| **Cross-browser** | Same suite locally on Chromium (375/768/1440), Firefox (1440) and WebKit (375, iPhone) | **299 passed, 6 skipped by design, 0 failed** locally (after the CI-found fix D16) |
| **Content Security Policy** | New `csp.spec.ts` | CSP and security headers on every route; **zero violations** across all pages and a full challenge run; a page script's cross-origin `fetch` is **blocked by the browser**; the site refuses framing |
| **Accessibility, extended** | New `a11y-extended.spec.ts`, every route, all viewports and browsers | Heading hierarchy never skips; one banner/main/contentinfo; unique nav names; reflow at 320 px; 200 % text and WCAG text-spacing overrides; forced-colors and reduced-motion; targets ≥ 24 px; focus never hidden behind the sticky header |
| **Student Workbook cross-check** | Read `Young_Problem_Solvers_Student_Workbook_v1.docx` against the site | Unit names identical (**"Design and Test"**, which also resolves the earlier brief-vs-spec conflict); all 12 driving questions identical to the Specification; the Workbook calls a negative surplus a **"shortfall"** (the challenge now uses that word). Week titles differ for 10 of 12 weeks (the Workbook uses child-friendly titles); the parent-facing site follows the Specification. |
| **Readability and time** | `scripts/readability.mjs` on the rendered challenge text | Flesch-Kincaid ≈ grade 3.6 overall (adult-facing objectives block ≈ 6), ≈ 9 words per sentence. Time model (reading 100–150 wpm + 13 interactions at 30–60 s) gives **≈ 12–22 minutes**, so the "10–15 minutes" claim was **not supported**; all copy now says "about 15 minutes (estimate)". This is a text-based estimate, not a measurement with children. |

### Defects found by this pass (all fixed unless noted)
| ID | Sev | Finding | Fix |
|---|---|---|---|
| D8 | P1 (a11y) | `/challenge` overflowed horizontally at 320 px (a grid item grew to its widest child); at 200 % text, columns spilled long words | `min-width:0` for grid/flex children and `overflow-wrap` in base styles |
| D9 | P1 (robustness) | **WebKit:** pressing Enter right after typing submitted a *stale* value ("Type a number first"). Autofill, IME or paste could trigger the same | Submit handler reads the input's actual value |
| D10 | P2 (a11y) | Header and footer links were 20 px tall (< 24 px, WCAG 2.5.8) | Larger padding |
| D11 | P2 (a11y) | At 375 px with 200 % text the **Menu button left the viewport** (WebKit) | Tagline hidden in the header on small screens; menu cluster no longer shrinks |
| D12 | P2 (a11y) | Price table was too wide at large text and, once shrinkable, became an unfocusable scroll region (axe: serious) | Replaced by a plain list |
| D13 | P2 (content) | "10–15 minutes" unsupported by the timing model | Changed to "about 15 minutes (estimate)" everywhere |
| D14 | P3 (content) | "loss" / "lose money" vs the Workbook's "shortfall" | Vocabulary aligned; unit tests for shortfall and break-even |
| D16 | P1 (a11y) | **Found by CI, not by local runs:** on GitHub's Linux runner (wider default fonts) `/about` overflowed in WebKit under text-spacing overrides. Cause: my own global `min-width:0` flex rule had collapsed the FAQ "+" indicator to zero width and squeezed the logo mark, and the FAQ question text could not wrap beside the indicator. | `shrink-0` on fixed-size items, text wrapped in `min-w-0`; regression test plus a deliberately wide font in the spacing tests so local runs are as strict as CI |
| D15 | P1 (security hygiene) | `vercel curl` created a persistent automation-bypass secret (see Prioritised issues) | **Open:** revoke needed; the agent was blocked from doing it |

### Recommendation for Milestone 3
Educator review and iteration on the challenge first. Then, if approved: a second original challenge (e.g. data and evidence, Weeks 4–6), the content loader and schema validation from `docs/CURRICULUM_PLATFORM.md`, a CSP, and an owner-approved decision on any parent-facing downloads.
