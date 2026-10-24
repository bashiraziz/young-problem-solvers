# Young Problem Solvers (YPS) website

Private development site for the YPS pilot programme (ages 9–12, Uganda). Next.js App Router + TypeScript + Tailwind, to be hosted on Vercel.

## Quick start
Requires Node.js 22 LTS (`.nvmrc`) and npm 11.

```sh
npm ci
npm run dev        # http://localhost:3000
npm run check      # lint + typecheck + unit tests + build
npx playwright install chromium
npm run test:e2e   # smoke, responsive and axe accessibility checks
```

No environment variables are needed. The local dev server is open; access control exists only on Vercel (see below).

## Layout
`src/app` routes · `src/components/{layout,marketing,interactive,ui}` · `src/content` programme/FAQ/challenge data · `src/lib` pure logic · `tests/{unit,e2e}` · `docs/` · `reference/` source brief.

## Release and rollback
1. Work on a branch and open a PR. CI (`.github/workflows/ci.yml`) must pass; Vercel creates a protected preview.
2. The Product Owner reviews the preview and approves.
3. Merge to `main` → Vercel production deployment (protected; see `docs/SECURITY.md`).
4. Rollback: Vercel dashboard → Deployments → previous good deployment → **Promote to Production** (or `vercel rollback`). Only the Product Owner performs production releases and rollbacks.

The GitHub repo is private. The Vercel project is `young-problem-solvers` with **Vercel Authentication → All Deployments** (see `docs/SECURITY.md`). After any Vercel settings change run `npm run verify:protection -- https://young-problem-solvers.vercel.app` (expects every URL to redirect to Vercel sign-in). Reviewers need Vercel accounts; Hobby allows one external user. See `docs/` for product, architecture, roadmap, security and decisions.
