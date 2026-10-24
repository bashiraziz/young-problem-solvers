# Roadmap (sequence, not pre-authorisation)

**Phase 1 — Protected dev site (this repo):** foundation, responsive content, budget demo, CI, previews, deployment protection.

| Phase | Goal | Risks | Prerequisites | Candidate approach |
|---|---|---|---|---|
| 2 Public info & inquiries | Verified contact details; parent inquiry capture; modest analytics | Child/parent PII; spam; consent | Approved address/contact, privacy notice, consent wording | Server action → email or managed form store; privacy-friendly analytics |
| 3 Curriculum resources | Versioned instructor guides, worksheets, teaching packs | Leaking unpublished IP; file access control | Final curriculum docs; instructor roles | Typed/MDX content in repo; instructor auth; CMS only if publishing needs justify |
| 4 Academy operations | Enrollment, scheduling, attendance, assessments, parent reports | Child data privacy, retention, staff access | Legal/privacy review, data model, consent flows | Managed Postgres + auth with row-level access; audit log |
| 5 Multiple centres | Site admin, partner schools, training, licensing | Operational complexity, quality control | Successful pilot, commercial model | Multi-tenant data model; revisit service boundaries then |

## Milestones after Foundation (see `REVIEW.md` §8 and `CURRICULUM_PLATFORM.md`)
M2 Curriculum Content System → M3 Interactive Learning → M4 Student Progress. Each requires Product Owner approval; the Phase 2 inquiry work above runs in parallel once contact details and consent wording are approved.
