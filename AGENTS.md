# AGENTS.md — YPS website

Guidance for coding agents (Claude Code, Codex). `CLAUDE.md` carries the same rules; keep both in sync.

## Fixed decisions
- Single Next.js (App Router) + TypeScript (`strict`) project. **Not** a monorepo; no microservices. Modularise by folder; split services only on demonstrated need (see `docs/DECISIONS.md`).
- Tailwind CSS v4 with tokens in `src/app/globals.css` (`@theme`). Server Components by default; `"use client"` only for interactivity (`mobile-menu`, `budget-challenge`).
- Programme text lives in `src/content/`, logic in `src/lib/`, never inline in components.
- Access is a shared-password gate (`src/proxy.ts`, `src/lib/auth`; see `docs/SECURITY.md`). Keep it fail-closed; never loosen the proxy matcher without updating tests.
- Phase 1: static content only. No database, payments, LMS, analytics, accounts, or real child/parent/staff data.

## Commands
`npm run check` = lint + typecheck + unit tests + build. `npm run test:e2e` = Playwright (builds, serves on port 3217 with test-only credentials).

## Content rules
- Do not invent addresses, dates, fees, credentials, testimonials, endorsements or outcomes. Sample reports stay labelled **illustrative**.
- Never imply accreditation or validated outcomes. Curriculum source docs govern facts; flag conflicts to the owner.
- Budget maths must stay covered by `tests/unit/budgeting.test.ts`.

## Boundaries
Ask the Product Owner before: spending money, creating/modifying external accounts, publishing, deploying to production, or merging a production release. Never commit secrets.
