# Curriculum platform architecture (design only — nothing here is implemented)

Goal: grow the site into a learning platform **without a rewrite and without building a full LMS now**. Status: proposal for Product Owner review; see ADR-006.

## 1. Principles
1. **Content is data, not code.** Curriculum lives in versioned files validated by schemas; components render it. Editing a lesson never requires touching React.
2. **Two experiences, one app, hard boundaries.** `(academy)` = public-facing parent/prospect site (today's homepage). `(platform)` = instructors, students, parents (`/teach`, `/learn`, `/parent`). Same Next.js project (ADR-002); separated by route group and `src/features/*` modules, with an ESLint `no-restricted-imports` rule so academy code cannot import platform internals.
3. **Content never goes in the database.** A database (later) holds *people and progress* only. Content stays in git, so it is reviewable, diffable and versioned with releases.
4. **Audience is enforced on the server.** Every content item carries `audience: public | student | parent | instructor`. The loader filters by the caller's role; instructor guides and assessment answer keys are never bundled into public or student pages.
5. **Pure, tested logic.** Exercise checking and scoring are pure functions with unit tests (as `src/lib/challenge/stall.ts` already is).

## 2. Content model
```
Programme (e.g. foundation)          id, title, ageRange, status
 └─ Level (e.g. level-1)             prerequisites[], curriculumVersion
     └─ Unit  (4)                    title, focus, outcomes[]
         └─ Week (12)
             └─ Session (24)         durationMin, stages: discover|learn|solve|explain|reflect
                 ├─ Activity[]       instructions, materials[]          audience: instructor/student
                 ├─ Exercise[]       kind + params + checker id         audience: student
                 └─ Resource[]       workbook page | lesson guide | slide  audience per item
Assessment                           diagnostic | weekly | final; items[]; rubric ref
Rubric                               criteria[], levels[] (descriptors only, no scores of real children)
```
IDs are stable slugs (`foundation.l1.u1.w2.s1`). Anything referencing content (progress rows, reports) stores the ID **and** `curriculumVersion`.

## 3. Storage and management
| Option | Verdict |
|---|---|
| **Typed files in repo: MDX (prose) + YAML/JSON (structure), validated with Zod at build time** | **Recommended now.** Zero infrastructure, reviewable in PRs, versioned, works offline, instructor/student filtering done by the loader. |
| Git-based editor (e.g. Keystatic/Decap) over the same files | Add later *only if* non-developers edit weekly. No data migration. |
| Headless CMS / database-backed content | Not recommended until multi-author, scheduled publishing or localisation demand it; the Zod schemas then become the CMS model. |

Layout (proposed):
```
content/
  programmes/foundation/
    programme.yaml
    level-1/
      level.yaml
      unit-1-think-with-numbers/
        unit.yaml
        week-02/
          week.yaml
          session-1.mdx          # activities + exercise refs
          exercises/*.yaml       # kind, params, feedback text
          resources/workbook.mdx
          resources/lesson-guide.mdx   # audience: instructor
  assessments/…  rubrics/…
src/lib/curriculum/             # schemas (zod), loader, audience filter, version resolver
```
CI step: `npm run content:validate` fails the build on schema errors, broken references, missing audience, or an exercise `kind` with no renderer.

**Releases:** content is tagged `curriculum-vX.Y.Z` (semver: major = sequence/outcome change, minor = new lesson/exercise, patch = wording). A published version is immutable; learners stay on the version they started.

## 4. Exercises
- Each exercise is data: `{ id, kind, prompt, params, hints[], feedback }`.
- `kind` maps to a registered renderer + pure checker: `numeric-entry`, `multiple-choice`, `ordering`, `budget-builder` (today's demo generalised), `explain-your-reasoning` (free text, **human-marked**, never auto-graded).
- Checkers return `{ correct, feedbackKey }`, never touch the DOM, and ship with unit tests. Adding a kind = one renderer + one checker + schema entry.
- Interactive pages are client components; answer keys stay on the server (check via server action once accounts exist; until then only public demo exercises with non-sensitive keys).

## 5. Capability map (what each need maps to)
| Need | Design | When |
|---|---|---|
| Digital student workbooks | `Resource(kind: workbook)` MDX rendered at `/learn/...`; printable CSS | Milestone 2 |
| Interactive exercises | Exercise registry above | Milestone 3 |
| Instructor lesson guides | `audience: instructor` resources at `/teach/...`, role-gated | Milestone 2 (content) / 4 (auth) |
| Individual assessments | `Assessment` + `Rubric` content; attempts stored as records | Milestone 4 |
| Student progress reports | Generated from records against a rubric + `curriculumVersion`; templates marked illustrative until validated | Milestone 4 |
| Parent access | Parent↔learner link; parents see only their linked learners' reports | Milestone 4 |
| Multiple levels/programmes | `Programme → Level` with `prerequisites`; routes parameterised by IDs | Built into schema from Milestone 2 |

## 6. People and progress data (Milestone 4, not before)
- Roles: `student`, `parent`, `instructor`, `admin`. Authorisation checks live in a single server-side data-access layer, not in components.
- Store: managed Postgres (candidate: Neon via Vercel Marketplace) with row-level scoping by role/centre. Learners are **pseudonymous** (internal ID + first name or nickname); no dates of birth, photos or contact details beyond what consent and a documented purpose require.
- Prerequisites (from the brief): privacy design, consent flows, retention policy, staff access rules, safeguarding review, legal review for Uganda. Auth library to be chosen then (candidates: Better Auth, Auth.js); Vercel Authentication (ADR-007) is the Phase 1 gate and is replaced by real accounts and roles when they arrive.
- Audit log for reads/writes of child records.

## 7. Evolution path (no rewrite)
1. **M2:** add `content/`, schemas, loader, `content:validate`; migrate `src/content/programme.ts` into it; render existing homepage from the loader. Introduce `(academy)` route group (URL-neutral).
2. **M3:** exercise registry + a handful of original exercises; `/learn` previews behind Vercel Authentication.
3. **M4:** accounts, roles, database, records, reports, `/parent`.
4. Split a service **only on demonstrated need** (ADR-002).

## 8. Risks
- Content authored without the Curriculum Specification (not yet supplied) would need rework → M2 starts by importing the spec, not inventing content.
- Answer keys leaking to the client → server-side checking and audience filtering from day one.
- Over-building: every new capability is gated by a milestone and Product Owner approval.
