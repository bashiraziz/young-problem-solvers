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

Copy `.env.example` to `.env.local` and set `YPS_SITE_PASSWORD` (14+ chars) and `YPS_SESSION_SECRET` (32+ chars). Without them the site fails closed and shows a configuration message.

## Layout
`src/app` routes · `src/components/{layout,marketing,interactive,ui}` · `src/content` programme/FAQ/challenge data · `src/lib` pure logic · `tests/{unit,e2e}` · `docs/` · `reference/` source brief.

## Release and rollback
1. Work on a branch and open a PR. CI (`.github/workflows/ci.yml`) must pass; Vercel creates a password-gated preview.
2. The Product Owner reviews the preview and approves.
3. Merge to `main` → Vercel production deployment (password-gated; see `docs/SECURITY.md`).
4. Rollback: Vercel dashboard → Deployments → previous good deployment → **Promote to Production** (or `vercel rollback`). Only the Product Owner performs production releases and rollbacks.

The GitHub repo exists (private). The Vercel project is **not yet set up** and needs Product Owner authorisation. In Vercel, set both env vars for Production and Preview. Access is controlled by the shared-password gate (`docs/SECURITY.md`). See `docs/` for product, architecture, roadmap, security and decisions.
