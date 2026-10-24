# Architecture

Single Next.js 16 App Router project, TypeScript strict, Tailwind v4. The homepage is rendered per request (session check) with static content; the only server logic is the password gate (`src/proxy.ts`, `src/lib/auth`, `/login`).

| Concern | Choice |
|---|---|
| Rendering | Server Components; client components only for `MobileMenu` and `BudgetChallenge` |
| Data | Typed static modules in `src/content`, types in `src/types` |
| Logic | Pure functions in `src/lib` (`budgeting.ts`), unit-tested |
| Styling | Tailwind tokens in `globals.css` `@theme` |
| Access | Shared-password gate: `proxy.ts` + signed session cookie (`docs/SECURITY.md`) |
| Headers | `next.config.ts`: `X-Robots-Tag: noindex`, nosniff, frame deny, referrer policy |
| Tests | Vitest + Testing Library (unit); Playwright + axe (mobile/tablet/desktop) |
| CI | GitHub Actions: lint, typecheck, unit, build, e2e |

Boundaries are folder-level so features (inquiry form, resources) can be added as modules. A CMS or separate service is introduced only on demonstrated need.
