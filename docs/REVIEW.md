# Milestone 1 review package — Foundation website

Repository: https://github.com/bashiraziz/young-problem-solvers (private) · Latest commit reviewed: `0934039` (CI green on all three pushes).
Preview URL: https://young-problem-solvers.vercel.app — behind Vercel Authentication (All Deployments); a Vercel-account login is required, so only the owner (plus one granted external reviewer on Hobby) can open it.

## 1. Completed features
| Requirement | Status |
|---|---|
| Homepage: Think. Build. Explain. philosophy | Done |
| 12-week programme, four units, 24 sessions / 36 h | Done — **verified against the Curriculum Specification** (ADR-004) |
| Five-stage method (Discover → Learn → Solve → Explain → Reflect) | Done |
| Interactive problem-solving example (UGX budget) | Done, unit + e2e tested |
| Parent information: assessments, progress report | Done; sample report marked **illustrative** |
| Pilot status and FAQ (no fees, dates, accreditation or outcomes claimed) | Done |
| Responsive and accessible | Done (automated + keyboard audit); manual screen-reader test **not done** |
| Development access protection | Done: Vercel Authentication, All Deployments (ADR-007); verified from outside |
| Not built, by design | Contact/inquiry, CMS, database, analytics, accounts, payments |

## 2. Screenshots (`docs/review/`)
Desktop 1440: `home-desktop-full.png` · Tablet 820: `home-tablet-full.png` · Mobile 412: `home-mobile-full.png`, `home-mobile-menu-open.png`. (Login-page captures were removed with the app gate.)
Screenshots predate the content-alignment pass (assessment section and some titles changed) — retake before sign-off. Note: the header appears mid-page in full-page captures because it is `sticky`; that is a capture artifact, not a layout bug.

## 3. Test results (local, Windows; CI on Ubuntu also green)
| Check | Result |
|---|---|
| `npm run lint` | Pass |
| `npm run typecheck` (strict) | Pass |
| Unit tests (Vitest) | 14/14 pass — budgeting maths, challenge component, programme-content integrity |
| `npm run build` | Pass |
| Playwright e2e (mobile/tablet/desktop) | 19 pass, 2 skipped by design (keyboard skip-link test is desktop-only), **0 failures** |
| axe (WCAG 2.0/2.1/2.2 A+AA, serious/critical) | 0 violations on the homepage in all 3 viewports (one contrast issue found and fixed during development) |
| Horizontal overflow | None at 320, 412, 820, 1440 px |
| Performance (local production build, desktop; *not* Lighthouse on Vercel) | LCP ≈ 224 ms, CLS 0, TTFB ≈ 119 ms, 8 requests, ≈ 450 KB decoded JS, ≈ 14 KB transferred (cached) |

Outstanding failures: none. Not yet run: Lighthouse and WebPageTest on the deployed Vercel URL, real-device testing.

## 4. Security review
**Access control:** Vercel Authentication, All Deployments (ADR-007), enabled via the Vercel API and verified externally: `/`, `/robots.txt`, `/favicon.ico` (and `/login` before removal) → `302` to `vercel.com/sso-api`. Re-check with `npm run verify:protection -- <url>`. The earlier app-level password gate was removed.
**Strengths:** protection runs at the edge before the app (no public login page, nothing to brute-force); named revocable accounts; the app has no auth code or secrets and needs no environment variables; `noindex` header and `robots.txt`; `X-Frame-Options: DENY`, `nosniff`, referrer policy; `poweredByHeader` off; no third-party scripts; no personal data collected; `npm audit` reported 0 vulnerabilities at install.
**Weaknesses / limits:**
1. Single layer: if Vercel protection is disabled or a new unprotected domain is added, the site is public at once. Mitigation: owner-only settings changes, the verify script, no sensitive content in Phase 1.
2. Reviewers need Vercel accounts; Hobby allows one external user.
3. No CSP yet.
4. Branch protection / required CI on GitHub and Vercel team settings have not been reviewed by a second person.
5. Obsolete env vars `YPS_SITE_PASSWORD` and `YPS_SESSION_SECRET` may still exist in Vercel — delete them.

## 5. Accessibility review
**Verified:** semantic landmarks and heading order, one `h1`; skip link visible on focus; all interactive controls reachable by Tab in a logical order with a visible 3 px focus ring (14 consecutive stops checked); labels on all inputs (the budget checkboxes are `<label>`-wrapped; a `fieldset`/`legend` groups them); `aria-live` result region for the budget; mobile menu uses `aria-expanded`/`aria-controls`, closes on Escape and returns focus; `prefers-reduced-motion` disables smooth scroll and transitions; reflow OK at 320 px; decorative elements `aria-hidden`; illustrative report marked in text, not colour alone.
**Not yet verified:** screen readers (NVDA/VoiceOver/TalkBack); 200 % text zoom; Windows High Contrast; the mobile menu does not trap focus or close on outside click (acceptable pattern, but worth a UX decision); colour-contrast of every state beyond what axe samples.

## 6. Local development and deployment
**Local:** Node 22 (`.nvmrc`), `npm ci`, `npm run dev` (no env vars; the local server is open). Checks: `npm run check`; e2e: `npx playwright install chromium && npm run test:e2e`.
**Vercel (project already exists and is connected to the repo):**
1. Framework preset Next.js; no build overrides; no environment variables needed (delete the obsolete `YPS_*` ones).
2. Settings → Deployment Protection: Vercel Authentication **on**, scope **All Deployments** (already set via API; confirm in the dashboard).
3. To add a reviewer: they open the URL, sign in to Vercel and request access; approve under Deployment Protection → Requests (Hobby: one external user).
4. After any settings change: `npm run verify:protection -- https://young-problem-solvers.vercel.app`.
5. Rollback: Deployments → previous good deployment → Promote to Production.
No paid services are required or used.

## 7. Prioritised issues
**P0 — resolved**
1. Access protection: Vercel Authentication, All Deployments, enabled and verified externally (302 to Vercel sign-in on every tested path). The app-level gate (and its login-page leak) no longer exists. Still to do (owner): sign in with your Vercel account and confirm the site renders; delete the obsolete `YPS_*` env vars.
2. Curriculum documents verified (ADR-004). **Conflict for the owner:** the Specification names unit 3 "Design and Test", while the implementation brief said "Design a Solution". The site now follows the Specification; tell me if the brief's name is the intended one. Other fixes: week titles 8, 10, 12; unit emphasis and performance lines; stage minutes; sample report mirrors the Assessment Pack (rubric 1–4); FAQ wording (entry range, class size 12 as *proposed*, devices optional). The Student Workbook has not yet been cross-checked.

**P1 — before sharing beyond the owner**
3. Manual screen-reader and 200 % zoom pass (section 5).
4. Run Lighthouse on the deployed preview and record scores.
5. Enable GitHub branch protection on `main` (require CI) so production releases are owner-controlled.
6. Decide whether a shared throttle (Vercel WAF rate limit) is needed for your threat model.

**P2 — polish**
7. `src/app/favicon.ico` is still the default Next.js icon → replace with a YPS mark.
8. Imagery: the page is typography-only; purpose-made illustrations (no identifiable children) would help parents.
9. Add a CSP (nonce-based).
10. Decide mobile-menu behaviour (focus trap / outside click).
11. `npm audit` and dependency update routine (Dependabot is free) — not configured.

## 8. Roadmap — next three milestones (each needs owner approval before starting)
**M2 — Curriculum Content System** (depends on P0-2): import the spec; `content/` + Zod schemas + loader + `content:validate`; render the programme overview from it; `(academy)`/`(platform)` route groups; instructor/student/parent audience model. Design: `docs/CURRICULUM_PLATFORM.md`.
**M3 — Interactive Learning:** exercise registry and checkers; a small set of original exercises with hints and feedback; digital workbook pages behind Vercel Authentication; unit tests per checker; educator review of every item.
**M4 — Student Progress:** only when real learners are in scope — privacy/consent/safeguarding design first, then accounts, roles, Postgres, assessment records, parent reports, audit log; Vercel Authentication is replaced by real accounts.
Parallel, owner-led: verified contact details and consent wording for Phase 2 inquiries.
