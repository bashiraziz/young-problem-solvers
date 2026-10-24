# Young Problem Solvers (YPS) — Website Implementation & Long-Term Development Brief

**Owner:** YPS founder / Product Owner  
**Primary development agent:** Claude Code; Codex may provide independent code review  
**Decision date:** 24 October 2026  
**Status:** Development; no public enrollment  
**Architecture decision:** **Next.js App Router + TypeScript from day one — mandatory, not an option to debate.**

## 1. Mission and product positioning

Build and maintain the YPS website, initially as a protected development site and later as the digital platform for an original supplementary learning programme in Uganda for children aged 9–12. YPS stands for **Young Problem Solvers**; its educational philosophy is **Think. Build. Explain.**

The pilot course lasts **12 weeks**, with **24 sessions of 90 minutes** organized into four units:

1. Think with Numbers
2. Investigate the World
3. Design a Solution
4. Build and Explain

Mathematical reasoning and problem-solving lead. Communication, investigation, creativity and age-appropriate computational thinking support them. YPS is **not** an abacus academy, exam-cramming centre or primarily a robotics/coding club. The curriculum is a pilot, not an officially accredited or outcome-validated programme; never imply otherwise.

## 2. Non-negotiable technical foundation

- **Framework:** Next.js with **App Router** (no Pages Router for new application routes).
- **Language:** TypeScript everywhere: UI, server code, shared utilities, content data, and tests as supported by tools. Set `strict: true`; avoid `any` and unsafe type assertions.
- **UI:** React with Server Components by default; only mark genuinely interactive components as Client Components.
- **Styling:** Tailwind CSS with centralized YPS design tokens, reusable UI primitives, and responsive typography/spacing. Preserve the prototype's identity where it serves usability; do not mechanically reproduce defects.
- **Hosting:** Vercel, connected to a **private** GitHub repository owned by the Product Owner.
- **Node/runtime:** Use an actively supported Node.js LTS release compatible with the chosen stable Next.js version, checked against current framework and Vercel documentation. Pin package-manager and runtime expectations and commit a lockfile.
- **Quality:** ESLint, strict type check, automated unit/integration tests, and end-to-end smoke tests. CI must run checks on PRs before merge.
- **Documentation:** `README.md`, `CLAUDE.md`, `AGENTS.md` (compatible Codex guidance), `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `docs/SECURITY.md`, `docs/DECISIONS.md` (short architectural decision records).
- **Phase 1 data:** Static versioned programme content. **No database, payment integration, LMS, third-party analytics, user account system, or real child/parent information** unless approved.

### Suggested application structure (adapt only for a documented reason)

```text
yps/
  src/
    app/
      layout.tsx
      page.tsx
      globals.css
      not-found.tsx
      robots.ts
      sitemap.ts
    components/
      layout/
      marketing/
      interactive/
      ui/
    content/
      programme.ts
      faq.ts
    lib/
      budgeting.ts
      formatters.ts
    types/
  public/
  tests/
    unit/
    e2e/
  docs/
    PRODUCT.md
    ARCHITECTURE.md
    ROADMAP.md
    SECURITY.md
    DECISIONS.md
  CLAUDE.md
  AGENTS.md
  README.md
  .env.example
```

Keep curriculum text and programme data separate from components. Do not introduce a CMS prematurely; design clean boundaries so one can be introduced later without a site rewrite.

## 3. Supplied inputs and authority

Read these before implementing educational content:

- `YPS_Vercel_Website_v1.zip` — **visual/content prototype only**. This is an older JavaScript/Vercel Functions app, **not Next.js**. Reference its visuals, copy and budgeting interaction, but do **not** retain its runtime as the application foundation.
- `Young_Problem_Solvers_Curriculum_Specification_v1.docx` or PDF.
- `Young_Problem_Solvers_Student_Workbook_v1.docx` or PDF.
- `Young_Problem_Solvers_Assessment_Reporting_Pack_v1.docx` or PDF.

The curriculum source files govern terminology, sequencing, learning claims and programme facts. If a source is missing or there are conflicting claims, flag it to the owner. Do not invent factual claims.

## 4. First assignment: audit the prototype, then build the new foundation

1. **Audit** the prototype's content, design, navigation, accessibility, interaction, security, and usability. Document reusable ideas and problems to fix.
2. **Initialize a new Next.js App Router + TypeScript repository** immediately, using appropriate current stable releases. This framework choice is already approved; do not propose retaining the original JavaScript runtime or ask whether to use TypeScript.
3. **Port approved content and visuals** into semantic, reusable React components. Preserve the YPS identity and “Think. Build. Explain.” methodology.
4. **Implement a protected homepage** with: hero and positioning; philosophy; 12-week overview; an interactive, age-appropriate UGX budgeting challenge; assessments and progress reporting; pilot status; FAQ. Add a contact route only when its details and consent workflow are approved.
5. **Make the site accessible and responsive** on small phones, tablets and desktops. Follow WCAG 2.2 AA-oriented practices: semantic headings, visible focus, labels, adequate contrast and keyboard operation. Respect reduced-motion preferences.
6. **Set up branch-based Vercel previews and CI**, with one documented production-release and rollback process.
7. **Document** every security or product assumption, environment variable, dependency and release step.

A completed homepage is not enough: deliver a maintainable, reviewed, reproducibly buildable repository.

## 5. Private access and security

### Preferred Phase 1 setup

Use **Vercel Authentication** with **All Deployments** protected, if appropriate for the owner's account and current Vercel offering. Confirm protection for both preview URLs and the production domain in the live Vercel settings, not merely in a local config. Share access only with approved reviewers. Vercel's September 2026 announcement says All Deployments Vercel Authentication is available without an additional protection fee on all plans; confirm current terms when deploying.

### If a shared password is later essential

Evaluate Vercel native Password Protection first, including its current price/plan terms. Implement application-level shared-password authentication only if specifically approved after a threat-model review. The earlier prototype's password flow is **not** automatically production-ready: it requires attention to throttling, cookie security, secret rotation and cache/protected-route behavior.

For all approaches:
- Keep the repository private and secrets out of Git; provide `.env.example` only.
- Confirm that all protected routes, API routes, assets and downloadable curriculum files follow the intended access boundary; do not assume a login page protects static files.
- `noindex`, `robots.txt` and security-through-obscurity are **not** access controls.
- Do not ingest personal information relating to children, parents or staff in Phase 1.
- Do not make public deployments, incur costs, or modify accounts without explicit human authorization.

References: https://vercel.com/changelog/protect-production-deployments-for-free-on-every-plan and https://vercel.com/docs/deployment-protection

## 6. Product and content standards

- Use clear, parent-friendly English and Uganda-appropriate examples and UGX amounts.
- Do not invent campus addresses, opening dates, tuition rates, credentials, endorsements, approved licenses, testimonials or proven learning outcomes.
- Any sample report must be prominently marked **illustrative**.
- Avoid identifiable photos of real children unless valid permissions and a safeguarding review are documented. Prefer appropriately licensed generic imagery or purpose-created illustrations.
- Ensure sample math is correct and independently tested (especially interactive budgeting).
- Do not present the app as a full learning management system before those features exist.

## 7. Testing / definition of done for Phase 1

Supply evidence of:

- `build`, `lint`, `typecheck` and unit-test commands all passing.
- Unit tests for budgeting/calculation logic and other meaningful domain behavior.
- Browser smoke tests: page loads, key navigation, budget interaction, accessible mobile menu (if used), protected and unprotected request behavior as configured.
- Responsive layout checks for common mobile, tablet and desktop widths.
- Accessibility checks, with manually verified keyboard interaction and focus behavior.
- No secrets or live student data committed; `noindex` correctly configured for private environment.
- Correct deployment-protection configuration documented and checked on an actual preview URL.
- `CLAUDE.md`, `AGENTS.md`, README and roadmap updated to match the code.
- Clear owner-controlled approval and rollback instructions.

Do **not** claim that Vercel deployment or integration tests succeeded unless they were actually performed and verifiable.

## 8. Roadmap — sequence, not pre-authorization

**Phase 1 — Protected development website:** Next.js/TypeScript foundation, responsive marketing content, interactive demonstration, CI, Vercel previews, deployment protection.

**Phase 2 — Public information and inquiries:** verified address/contact details, parent inquiry capture with privacy notice and consent, enrollment interest and modest analytics after approval.

**Phase 3 — Curriculum resources:** versioned instructor guides, worksheets and teaching packs, role-based instructor access; introduce a CMS only if actual publishing needs justify it.

**Phase 4 — Academy operations:** student enrollment, scheduling, attendance, assessments and parent reporting with explicit child-data privacy design, staff access rules, retention and consent.

**Phase 5 — Multiple centres and partner schools:** site administration, school partnerships, instructor training, curriculum licensing and reporting if the educational and commercial pilot succeeds.

For Phases 2–5, create a backlog with goals, risks, prerequisites and candidate implementation approaches. Do not implement these phases now.

## 9. Required first response from Claude Code

Before changing accounts or deploying, provide:

1. A concise audit of the supplied prototype.
2. A Next.js App Router + TypeScript implementation plan **consistent with the fixed architecture decision**.
3. A proposed folder structure and initial dependencies, each justified.
4. A migration checklist mapping prototype sections/interactions to the new application.
5. A private-access recommendation and security concerns.
6. An initial set of testable milestones, acceptance criteria and unresolved questions.

**Proceed with local implementation of the fixed architecture under this brief; request explicit Product Owner approval before spending money, creating/modifying external accounts, publishing, or merging a production release.**
