# Decisions

## ADR-001 — Next.js App Router + TypeScript (24 Oct 2026)
Mandated by the Product Owner. Replaces the v1 JavaScript/Vercel Functions prototype.

## ADR-002 — Single application, no monorepo or microservices (24 Oct 2026)
Product Owner recommendation, accepted. One deployable; modularise by folder. Revisit only with demonstrated need (independent scaling, separate team, different runtime).

## ADR-003 — Application-level shared-password gate (24 Oct 2026)
Initially dropped in favour of Vercel Authentication. Reversed the same day: Product Owner has no paid Vercel plan, Vercel Password Protection is paid, and free Vercel Authentication admits only Vercel accounts with project access (reviewers would need to be added). The Product Owner approved a hardened gate, ported from the prototype and extended with throttling, fail-closed config, secret/password-bound sessions, 401 for non-page requests and no-store caching. Threat model and limits: `SECURITY.md`. Revisit if a paid plan or per-person access is needed.

## ADR-004 — Programme facts pending source verification
Curriculum docs were not supplied. Carried from the prototype: week titles and "36 learning hours" (24 × 90 min = 36 h, arithmetic verified). Changes: unit 3 renamed "Design a Solution" (per brief; prototype said "Design and Test"); the prototype FAQ claim about the "Kira area" was dropped as unverified. **Open:** confirm all against the Curriculum Specification.

## ADR-005 — E2E tests use port 3217 and never reuse a server
3100 was occupied by an unrelated app on the dev machine, which made tests hit the wrong server.
