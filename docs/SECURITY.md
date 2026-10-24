# Security

## Access control (Phase 1): shared-password gate
The Product Owner approved an application-level shared-password gate (see `DECISIONS.md` ADR-003) because Vercel Password Protection is a paid feature and free Vercel Authentication only admits Vercel accounts with project access.

**How it works**
- `src/proxy.ts` runs on every request except `/_next/static/*` and `/login`. Without a valid session cookie: browser navigations redirect to `/login`; everything else (`/robots.txt`, `/sitemap.xml`, `/favicon.ico`, any asset or API route) gets `401`. All responses carry `Cache-Control: private, no-store`.
- Second layer: the homepage calls `requireSession()`, which also makes it dynamic so it is never statically cached.
- Session: `HttpOnly`, `SameSite=Lax`, `Secure` in production, 12 hours. Token = expiry + random nonce + HMAC-SHA-256, keyed by `YPS_SESSION_SECRET` **and** the password, so changing either signs everyone out.
- Password check: SHA-256 both sides, then constant-time compare; max length 512.
- Throttle: 5 failures per IP per 15 minutes, plus a 600 ms delay on each failure. The redirect after login is always `/` (no open redirect).
- **Fails closed**: if `YPS_SITE_PASSWORD` (14+ chars) or `YPS_SESSION_SECRET` (32+ chars) is missing or short, every request is blocked and the login page shows only "Unavailable." (detail goes to server logs).

**Known limits** (acceptable for a small invite-only preview with no personal data)
- The throttle is in memory per server instance. On serverless hosting it is not shared across instances, so it slows brute force but is not a hard cap. Mitigation: a long random password. Upgrade path: Vercel WAF rate limiting or a shared store.
- One shared password: no per-person identity or audit trail. Rotate it when a reviewer should lose access.
- Server Actions are POSTs and pass through the proxy; the login action is the only unauthenticated one.
- Anything in `public/` is gated by the proxy, but treat it as visible to every password holder.

**Optional extra layer:** Vercel Authentication (free) can be added later on top; it would restrict viewers to Vercel accounts.

## Operations
- Set `YPS_SITE_PASSWORD` and `YPS_SESSION_SECRET` in Vercel for **Production and Preview**. Generate the secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- Rotate by changing either value and redeploying; all sessions end.
- **Status: not deployed.** After the first Vercel deploy, verify on a real preview URL, logged out and in a private window, that `/`, `/robots.txt` and a static asset are blocked. This has not been done.
- `noindex` and `robots.txt` are not access controls.

## Other assumptions
- Repo is private; no secrets committed; `.env.example` only; `.env.local` is gitignored.
- No personal data about children, parents or staff in Phase 1.
- Response headers are set in `next.config.ts`. A CSP is a Phase 2 task.
- No third-party scripts or external requests.
