# Changelog

## Robot mascot, logo mark and favicon (uncommitted)
- **Brand:** the robot-head mark replaces the "YPS" text badge in the header and footer (decorative, 44 px, same tilt); the wordmark uses Nunito 900 via `next/font/google` (self-hosted at build, so the CSP is unchanged). New `src/app/icon.svg`, `favicon.ico` and `apple-icon.png`.
- **Mascot:** `src/components/ui/mascot.tsx` (five poses in `public/mascot/`, decorative `alt=""`). Used once each on the home hero (`explaining`, hidden below `sm`), the 404 page (`stuck`) and the challenge, where `mascotMood` in `state.ts` picks the pose (thinking, stuck after a wrong answer or hint with "Hmm, let's look at it another way.", got-it when a step is done, explaining on Justify and Reflect). Parents, About and Programme have no mascot.
- **Tests:** unit tests for pose logic; e2e for one mascot per page, decorative alt text, logo name, pose per challenge state, icons served; 404 copy updated. Brief: `docs/CLAUDE_CODE_BRIEF.md`.

## Verification pass (branch `verification-hardening`)
- **Security:** Content-Security-Policy and Permissions-Policy (production), with tests (zero violations; cross-origin posts blocked).
- **Accessibility fixes:** reflow at 320 px and with enlarged text/spacing; targets at least 24 px; header never loses the menu button at large text; price list replaces a wide table; extended a11y tests.
- **Robustness:** challenge reads the input value at submit time (WebKit race); tests run on Chromium, Firefox and WebKit; the full suite also runs against a protected Vercel preview (`playwright.deployed.config.ts`).
- **Content:** time claim changed to "about 15 minutes (estimate)"; "shortfall" vocabulary from the Student Workbook; Workbook cross-checked.
- **Evidence:** Lighthouse (accessibility 100, best practices 100 on all runs); see `docs/CURRENT_STATE_REVIEW.md` section C. `scripts/readability.mjs` added.

## Milestone 2 — parent-facing curriculum demonstration (branch `milestone-2`, not merged)
- **Information architecture:** five routes — Home, Foundation Programme, Try a Challenge, For Parents, About — with a shared header, mobile menu, footer, per-page metadata and a single `h1` each.
- **Challenge:** original "School Fair Refreshments Stall" (UGX 100,000): estimate → calculate → choose → justify → reflect; graduated hints, specific mistake feedback, worked answer after three hints, evidence-checked reasons, "3 out of 4 sell" what-if, adult explanation of what it does and does not measure. No accounts, storage, cookies or network requests.
- **Programme:** all 12 weeks with driving questions and three observable outcomes each; five-stage session cycle with minutes; "what we do not promise".
- **Parents:** four-point assessment timeline (baseline, every session, Week 6, Week 12) and an illustrative report mirroring the Assessment & Reporting Pack.
- **Content:** typed, versioned programme content with stable IDs; challenge reference answers computed from data and verified in tests. Instructor-only material kept out (tests enforce it).
- **Removed:** the old homepage budget demo (it reused numbers from the Specification's Week 2 individual check).
- **Fixes:** YPS favicon; mobile Choose step uses cards instead of a scrolling table; clearer labels; mobile menu state.
- **Tests:** 45 unit tests (was 14) and an expanded Playwright suite (was 19 tests) at 375/768/1440 px, including a privacy test and a link crawler.
- **Tooling:** `npm run verify:protection -- <url>` (external check that every path redirects to Vercel sign-in); `scripts/capture-screenshots.mjs`.
- **Docs:** `docs/CURRENT_STATE_REVIEW.md`, ADR-008 and ADR-009.

## Foundation (merged to `main`)
- `4d186e6` Vercel Authentication (All Deployments) replaces the app gate; content aligned to the Curriculum Specification; curriculum platform design and review package.
- `0934039`, `e46145d` short-lived app-level password gate (removed in `4d186e6`).
- `285c2ef` Next.js + TypeScript foundation.
