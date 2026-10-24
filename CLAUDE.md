# CLAUDE.md — YPS website

Mirror of `AGENTS.md`; keep both in sync.

## Fixed decisions
- Single Next.js (App Router) + TypeScript (`strict`) project. **Not** a monorepo; no microservices. Modularise by folder; split services only on demonstrated need (see `docs/DECISIONS.md`).
- Tailwind CSS v4 with tokens in `src/app/globals.css` (`@theme`). Server Components by default; `"use client"` only for interactivity (`site-nav`, `mobile-menu`, `interactive/stall`).
- Programme text lives in `src/content/`, logic in `src/lib/`, never inline in components.
- Access control is Vercel Authentication (All Deployments), configured in Vercel, not in code (ADR-007). It is the only layer: never change Vercel protection settings or add custom domains without owner approval, and run `npm run verify:protection -- <url>` after any such change. Do not add app-level auth in Phase 1.
- Phase 1: static content only. No database, payments, LMS, analytics, accounts, or real child/parent/staff data.

## Commands
`npm run check` = lint + typecheck + unit tests + build. `npm run verify:protection -- <url>` checks a deployment is behind Vercel sign-in. `npm run test:e2e` = Playwright (builds and serves on port 3217).

## Content rules
- Do not invent addresses, dates, fees, credentials, testimonials, endorsements or outcomes. Sample reports stay labelled **illustrative**.
- Never imply accreditation or validated outcomes. Curriculum source docs govern facts; flag conflicts to the owner.
- Challenge maths must stay covered by `tests/unit/stall-challenge.test.ts`; reference answers are computed from `src/content/challenges/` data and verified independently. The challenge must never store or transmit what a child types (e2e privacy test).
- Never publish instructor-only Specification material (individual checks, evidence lists, scripted lessons, assessment forms, scoring criteria, answer keys) or reuse its numbers. No downloads without explicit owner approval (ADR-009).

## Boundaries
Ask the Product Owner before: spending money, creating/modifying external accounts, publishing, deploying to production, or merging a production release. Never commit secrets.
