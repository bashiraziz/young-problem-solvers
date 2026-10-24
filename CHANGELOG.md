# Changelog

## Milestone 2 — parent-facing curriculum demonstration (branch `milestone-2`, not merged)
- **Information architecture:** five routes — Home, Foundation Programme, Try a Challenge, For Parents, About — with a shared header, mobile menu, footer, per-page metadata and a single `h1` each.
- **Challenge:** original 10–15 minute "School Fair Refreshments Stall" (UGX 100,000): estimate → calculate → choose → justify → reflect; graduated hints, specific mistake feedback, worked answer after three hints, evidence-checked reasons, "3 out of 4 sell" what-if, adult explanation of what it does and does not measure. No accounts, storage, cookies or network requests.
- **Programme:** all 12 weeks with driving questions and three observable outcomes each; five-stage session cycle with minutes; "what we do not promise".
- **Parents:** four-point assessment timeline (baseline, every session, Week 6, Week 12) and an illustrative report mirroring the Assessment & Reporting Pack.
- **Content:** typed, versioned programme content with stable IDs; challenge reference answers computed from data and verified in tests. Instructor-only material kept out (tests enforce it).
- **Removed:** the old homepage budget demo (it reused numbers from the Specification's Week 2 individual check).
- **Fixes:** YPS favicon; mobile Choose step uses cards instead of a scrolling table; clearer labels; mobile menu state.
- **Tests:** 44 unit tests (was 14) and 72 Playwright tests (was 19) at 375/768/1440 px, including a privacy test and a link crawler.
- **Tooling:** `npm run verify:protection -- <url>` (external check that every path redirects to Vercel sign-in); `scripts/capture-screenshots.mjs`.
- **Docs:** `docs/CURRENT_STATE_REVIEW.md`, ADR-008 and ADR-009.

## Foundation (merged to `main`)
- `4d186e6` Vercel Authentication (All Deployments) replaces the app gate; content aligned to the Curriculum Specification; curriculum platform design and review package.
- `0934039`, `e46145d` short-lived app-level password gate (removed in `4d186e6`).
- `285c2ef` Next.js + TypeScript foundation.
