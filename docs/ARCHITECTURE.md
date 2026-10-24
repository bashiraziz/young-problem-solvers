# Architecture

Single Next.js 16 App Router project, TypeScript strict, Tailwind v4. The homepage is statically prerendered; there is no server runtime logic in Phase 1.

| Concern | Choice |
|---|---|
| Rendering | Server Components; client components only for `MobileMenu` and `BudgetChallenge` |
| Data | Typed static modules in `src/content`, types in `src/types` |
| Logic | Pure functions in `src/lib` (`budgeting.ts`), unit-tested |
| Styling | Tailwind tokens in `globals.css` `@theme` |
| Headers | `next.config.ts`: `X-Robots-Tag: noindex`, nosniff, frame deny, referrer policy |
| Tests | Vitest + Testing Library (unit); Playwright + axe (mobile/tablet/desktop) |
| CI | GitHub Actions: lint, typecheck, unit, build, e2e |

Boundaries are folder-level so features (inquiry form, resources) can be added as modules. A CMS or separate service is introduced only on demonstrated need.
