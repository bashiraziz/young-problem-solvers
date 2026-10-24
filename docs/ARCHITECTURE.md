# Architecture

Single Next.js 16 App Router project, TypeScript strict, Tailwind v4. The homepage is statically prerendered; there is no server runtime logic in Phase 1.

| Concern | Choice |
|---|---|
| Routes | `/`, `/programme`, `/challenge`, `/parents`, `/about` (all statically prerendered) |
| Rendering | Server Components; client components only for `SiteNav`, `MobileMenu` and the challenge (`components/interactive/stall`) |
| Data | Typed, versioned modules in `src/content` with stable IDs (`foundation.u1`, `foundation.w02`, `yps.challenge.refreshments-stall`); types in `src/types`. Instructor-only material is excluded and test-enforced (ADR-009) |
| Logic | Pure functions in `src/lib/challenge` (parsing, estimate, calculation, plan, reasons) and a pure reducer for challenge state, all unit-tested; no storage or network |
| Styling | Tailwind tokens in `globals.css` `@theme` |
| Access | Vercel Authentication, All Deployments (platform edge; no auth code in the app) — `docs/SECURITY.md` |
| Headers | `next.config.ts`: `X-Robots-Tag: noindex`, nosniff, frame deny, referrer policy, Permissions-Policy, Content-Security-Policy (production) |
| Tests | Vitest + Testing Library (unit); Playwright + axe (mobile/tablet/desktop) |
| CI | GitHub Actions: lint, typecheck, unit, build, e2e |

Boundaries are folder-level so features (inquiry form, resources) can be added as modules. A CMS or separate service is introduced only on demonstrated need.
