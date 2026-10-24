# Security

## Access control (Phase 1): Vercel Authentication, All Deployments
Vercel Authentication is the **only** access control. It is free on all plans and is applied at Vercel's edge before any request reaches the app, so a visitor without access sees only a Vercel sign-in redirect — never this site's code, login page or assets. The app has no authentication code (ADR-007; the earlier shared-password gate was removed).

**Configuration (project `young-problem-solvers`, set 24 Oct 2026 via the Vercel API)**
- `ssoProtection.deploymentType = "all"` → All Deployments: previews, generated URLs and production domains. (The project previously had Standard Protection, which left production domains public.)
- No Password Protection, no Trusted IPs, no shareable links in use.

**Verified from outside (curl, logged out):** `/`, `/login`, `/robots.txt`, `/favicon.ico` on the production URL all return `302` to `https://vercel.com/sso-api…`. Repeat with `npm run verify:protection -- <url> [more URLs]` (exit code 1 if anything is not behind the sign-in redirect). **Run it after any change to Vercel project or team settings and after adding a custom domain.**

**Who can view**
- Project owner, team or project members, and Vercel users granted access (a visitor requests access; the owner approves in Project → Settings → Deployment Protection → Requests).
- **Hobby plan: one external user per account.** More reviewers need a Pro plan or a different method (see "If more reviewers are needed").
- Shareable Links and Protection Bypass for Automation can bypass protection; neither is enabled. Do not create them without owner approval.

**Known risks**
1. **Single layer.** If protection is disabled — by a settings change, a project move, or a new custom domain handled differently — the site becomes public immediately. Mitigation: the verify script above; only the owner changes Vercel settings; content contains no personal data or secrets, only illustrative public-safe material.
2. Reviewers need Vercel accounts (and Hobby allows one external).
3. Previously authenticated users keep access after protection is re-enabled until their cookie expires.
4. No CSP yet (Phase 2 task); no rate limiting needed because there is no app-level login.

**If more reviewers are needed:** upgrade to Pro and add members/viewers; or turn Vercel Authentication off and reintroduce an app-level gate (the removed implementation is in git history at commit `0934039`); or share a Shareable Link only after an owner decision.

## Other assumptions
- Repo is private; no secrets committed; no environment variables are required in Phase 1; `.env*` files other than `.env.example` are gitignored.
- No personal data about children, parents or staff in Phase 1.
- Everything under `public/` is visible to anyone with access — put nothing sensitive there.
- `noindex` (`X-Robots-Tag`, `robots.txt`) is defence in depth, not access control.
- Response headers are set in `next.config.ts`: `X-Robots-Tag`, `nosniff`, `X-Frame-Options: DENY`, referrer policy; `poweredByHeader` off.
- No third-party scripts or external requests.
