import Link from "next/link";
import { Mascot } from "@/components/ui/mascot";
import { Container } from "@/components/ui/section";
import { DOWNLOADS, STATUS_LABEL, iCan, type Lesson } from "@/content/foundation";
import type { ContentStatus } from "@/content/foundation/schema";

export const unitPath = "/learn/foundation/unit-1";
export const lessonHref = (l: Lesson) => `${unitPath}/lesson/${l.slug}`;
export const practiceHref = (l: Lesson) => `/practice/foundation/unit-1/lesson/${l.slug}`;
export const lessonNumber = (l: Lesson) => l.slug.slice(1).replace(/^0/, "");

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className="inline-flex rounded-full bg-[#fff1cf] px-3 py-1.5 text-xs font-extrabold tracking-wide text-[#6b4a00] uppercase">
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Breadcrumb({ items }: { items: readonly { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm font-semibold text-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-2">
            {it.href ? (
              <Link href={it.href} className="inline-block py-1.5 underline-offset-2 hover:text-teal hover:underline">{it.label}</Link>
            ) : (
              <span aria-current="page" className="py-1.5 text-ink">{it.label}</span>
            )}
            {i < items.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Top of a lesson or practice page: the driving question, then the "I can" goals. */
export function LessonHeader({ lesson, kind, mascot }: { lesson: Lesson; kind: "lesson" | "practice"; mascot: "explaining" | "thinking" }) {
  return (
    <section className="bg-[radial-gradient(ellipse_at_85%_20%,#e2f3e6_0,transparent_55%)] pt-8 pb-8">
      <Container>
        <Breadcrumb
          items={[
            { href: "/programme/foundation", label: "Foundation Programme" },
            { href: unitPath, label: "Unit 1: Think with Numbers" },
            { label: `Lesson ${lessonNumber(lesson)}` },
          ]}
        />
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-extrabold tracking-[0.14em] text-teal uppercase">
              Week {lesson.wk} · Session {lesson.session} · {kind === "lesson" ? "Lesson" : "Practice"}
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl leading-[1.08] font-black tracking-tight text-balance sm:text-5xl">{lesson.title}</h1>
            <p className="mt-4 max-w-3xl text-xl font-semibold text-deep">{lesson.question}</p>
            <h2 className="mt-6 text-sm font-extrabold tracking-wider text-muted uppercase">By the end of this lesson</h2>
            <ul className="mt-2 max-w-3xl list-disc space-y-1.5 pl-5 leading-relaxed">
              {lesson.objectives.map((o) => (
                <li key={o}>{iCan(o)}</li>
              ))}
            </ul>
          </div>
          <Mascot pose={mascot} size={112} className="hidden lg:block" />
        </div>
        <p className="mt-6">
          <StatusBadge status="pilot-draft-not-validated" />
        </p>
      </Container>
    </section>
  );
}

export function LessonNav({ prev, next, kind }: { prev?: Lesson; next?: Lesson; kind: "lesson" | "practice" }) {
  const href = kind === "lesson" ? lessonHref : practiceHref;
  const link = "inline-flex min-h-11 items-center rounded-xl border border-line bg-white px-5 py-3 text-sm font-extrabold hover:bg-mint";
  return (
    <nav aria-label="Lessons in this unit" className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
      {prev ? <Link href={href(prev)} className={link}>← Lesson {lessonNumber(prev)}: {prev.title}</Link> : <span />}
      {next ? <Link href={href(next)} className={link}>Lesson {lessonNumber(next)}: {next.title} →</Link> : <span />}
    </nav>
  );
}

/** Printable A4 PDFs, labelled as pilot drafts, optionally opening at this lesson's page. */
export function PrintLinks({ lesson }: { lesson?: Lesson }) {
  const link = "inline-block py-1.5 text-teal underline-offset-2 hover:underline";
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {DOWNLOADS.map((d) => (
        <li key={d.id} className="rounded-2xl border border-line bg-white p-5">
          <p className="font-black">{d.title}</p>
          <p className="mt-1 text-sm text-muted">{d.blurb}</p>
          <p className="mt-2 text-xs font-bold text-muted">PDF · A4 · {d.pages} pages · pilot draft</p>
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-extrabold">
            <a href={d.href} download className={link}>Download</a>
            {lesson && (
              <a href={`${d.href}#page=${d.pageOf(lesson)}`} target="_blank" rel="noopener" className={link}>
                Open at this lesson<span className="sr-only"> (new tab)</span>
              </a>
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}
