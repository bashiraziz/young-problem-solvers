# Content milestone: current-state audit (before implementation)

Requested by `docs/YPS_Claude_Code_Content_Milestone_Brief.md`. Taken on 24 Oct 2026 before any Learning Library code was written.

## 1. Baseline

| Item | Finding |
|---|---|
| `main` at audit time | `1774848` ("Add robot mascot, logo mark and favicon"), identical to `origin/main` |
| Work branch | `learning-library` (not merged) |
| Stack | Next.js 16.4 App Router, React 19, TypeScript strict, Tailwind v4; single project (ADR-002) |
| Routes before | `/`, `/programme`, `/challenge`, `/parents`, `/about`, `/robots.txt`, `/sitemap.xml` (empty), `/icon.svg`, `/apple-icon.png`, 404 |
| Data model | Typed content in `src/content` (programme, FAQ, one challenge), pure logic in `src/lib`; no database, accounts, storage or network use |
| Downloads before | None. `public/` held only icons and mascot images; a unit test forbade documents |
| Interactive features | The Refreshments Stall challenge (client-side only; privacy and accessibility tests) |

## 2. Protection (verified, not assumed)

- Access control is **Vercel Authentication, All Deployments** (ADR-007). There is no app-level password.
- `npm run verify:protection -- https://young-problem-solvers.vercel.app` returned **PROTECTED (302 to vercel.com/sso-api) on all 17 paths**, including deep links to lesson and practice pages, both PDF paths, static assets and an unknown API route.
- The Vercel project has no environment variables and 0 protection-bypass secrets (checked via the API on 24 Oct 2026).

## 3. Repository hygiene

- **The GitHub repository is currently PUBLIC** (`gh repo view`: visibility PUBLIC). It was created private. Earlier project rules said "keep the repo private". This matters because anything pushed, including the student pilot drafts in this milestone, is publicly readable on GitHub regardless of Vercel Authentication. **Owner decision needed** (see the review summary).
- History scan (`git log --all`): no confidential file names (teacher, assessment, key, `.env`) have ever been committed; no tokens, keys or bypass secrets in any commit. `.env.example` holds placeholder text only (the removed app-gate variables).
- The files the owner dropped into `docs/` include the **teacher manual and the student assessment (both marked CONFIDENTIAL) and a zip of them**. They are untracked. `.gitignore` now blocks them (`/docs/*CONFIDENTIAL*`, `/docs/*Teacher*`, `/docs/*.zip`, `/docs/*.docx`, `/docs/YPS_Unit1_*.pdf`) so they cannot be committed by accident. Claude did not open the teacher manual, the assessment or the teacher-pack zip contents.

## 4. Brief versus what exists

| Brief target | Status | Decision |
|---|---|---|
| `/programme/foundation` | Existed as `/programme` | Moved (`/programme` forwards with a temporary redirect); added unit status and a link into the library |
| `/learn/foundation/unit-1` | Missing | Built |
| `/learn/foundation/unit-1/lesson/[id]` | Missing | Built; all six lessons |
| `/practice/foundation/unit-1/lesson/[id]` | Missing | Built; all six lessons |
| `/parents/progress-example` | Illustrative report already on `/parents` | **Not duplicated** (brief: avoid duplicate routes) |
| `/curriculum` | Same content as `/programme/foundation` plus the pilot-status notes | **Not duplicated** |
| Printable coursebook and workbook | None | Added as pilot-draft PDFs under `public/downloads/` |

## 5. Verified, missing, blocked, proposed

- **Verified:** protection on all paths; content already matched the 12-week manifest (titles, driving questions and outcomes agree; a unit test now enforces this); no confidential material in history.
- **Missing before this milestone:** everything in the table above marked "Built".
- **Blocked or needs the owner:** repo visibility; approval to publish student material; educator review (two Uganda primary mathematics educators) before wider use; see the "Review flags" in `LEARNING_LIBRARY.md`.
- **Proposed:** keep Units 2 to 4 as visible outlines until their content exists.
