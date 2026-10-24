# Security

## Access control (Phase 1)
Use **Vercel Authentication — All Deployments** (preview *and* production). The app has **no** password flow of its own; the v1 prototype password gate was not carried over. If a shared password becomes essential: evaluate Vercel Password Protection first; build custom auth only after a threat-model review (throttling, cookie flags, secret rotation, cache behaviour).

**Status: NOT YET VERIFIED.** No Vercel project exists yet. Before sharing any URL, the Product Owner must confirm in live Vercel settings that protection covers previews and the production domain, then test a preview URL logged out (expect a login page or 401). `noindex` and `robots.txt` are not access controls.

## Assumptions
- Repo is private; no secrets committed; `.env.example` only.
- No personal data about children, parents or staff in Phase 1.
- Everything under `public/` is served to anyone who passes deployment protection — put nothing sensitive there.
- Response headers are set in `next.config.ts`. A CSP is a Phase 2 task (Next inline scripts need nonce handling).
- No third-party scripts or external requests.
