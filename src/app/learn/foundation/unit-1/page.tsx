import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, PrintLinks, StatusBadge, lessonHref, lessonNumber, practiceHref } from "@/components/learning/lesson-parts";
import { Container } from "@/components/ui/section";
import { PageIntro } from "@/components/ui/page-intro";
import { CONTENT_VERSION, OUTLINED_UNITS, UNIT_1, STATUS_LABEL, iCan } from "@/content/foundation";
import { practiceFor } from "@/content/foundation/unit-1-items";
import { UNITS } from "@/content/programme";

export const metadata: Metadata = {
  title: "Unit 1: Think with Numbers",
  description: "Six lessons over Weeks 1–3: place value, estimating and checking, budgets, trade-offs, equal groups and value for money. Pilot draft for review.",
};

const unit = UNITS[0];

export default function UnitOnePage() {
  return (
    <>
      <PageIntro eyebrow="Learning Library · Foundation Programme · Weeks 1–3" title="Unit 1: Think with Numbers">
        <p>{unit.summary} Six 90-minute sessions, each with a lesson to read, questions to try with hints, and practice to do on your own.</p>
      </PageIntro>

      <Container className="space-y-14 pb-16">
        <div className="space-y-3">
          <Breadcrumb items={[{ href: "/programme/foundation", label: "Foundation Programme" }, { label: "Unit 1" }]} />
          <div role="note" className="rounded-2xl border border-[#ecd9a4] bg-[#fff8e6] p-5">
            <p className="flex flex-wrap items-center gap-3">
              <StatusBadge status="pilot-draft-not-validated" />
              <span className="text-sm font-bold">Under review</span>
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed">
              This unit is a pilot draft. It has not been checked by classroom teachers or tested with children, and nothing here is an
              accredited syllabus or a promise of results. Questions and wording may change after review. Content version {CONTENT_VERSION}.
            </p>
          </div>
        </div>

        <section aria-labelledby="goals-h">
          <h2 id="goals-h" className="text-3xl font-black tracking-tight">What you will learn</h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {unit.weeks.map((w) => (
              <article key={w.id} className="rounded-3xl border border-line bg-white p-6">
                <p className="text-xs font-extrabold tracking-widest text-teal uppercase">Week {w.number}</p>
                <h3 className="mt-1 text-xl font-black">{w.title}</h3>
                <p className="mt-2 text-sm font-semibold italic text-muted">{w.drivingQuestion}</p>
                <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
                  {w.outcomes.map((o) => (
                    <li key={o}>{iCan(o)}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="lessons-h">
          <h2 id="lessons-h" className="text-3xl font-black tracking-tight">Six lessons</h2>
          <ol className="mt-6 grid gap-5 md:grid-cols-2">
            {UNIT_1.lessons.map((l) => {
              const interactive = practiceFor(l).interactive;
              return (
                <li key={l.id} className="flex flex-col rounded-3xl border border-line bg-white p-6">
                  <p className="text-xs font-extrabold tracking-widest text-teal uppercase">
                    Lesson {lessonNumber(l)} · Week {l.wk} · Session {l.session}
                  </p>
                  <h3 className="mt-1 text-xl font-black">
                    <Link href={lessonHref(l)} className="underline-offset-4 hover:text-teal hover:underline">{l.title}</Link>
                  </h3>
                  <p className="mt-2 font-semibold italic text-muted">{l.question}</p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed">
                    {l.objectives.map((o) => (
                      <li key={o}>{iCan(o)}</li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs font-bold text-muted">
                    {interactive ? "Interactive questions with hints" : "Lesson and printable practice. Interactive checking coming later."}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-x-6 gap-y-1 pt-4 text-sm font-extrabold">
                    <Link href={lessonHref(l)} className="inline-block py-2 text-teal underline-offset-2 hover:underline">
                      Read the lesson<span className="sr-only">: {l.title}</span>
                    </Link>
                    <Link href={practiceHref(l)} className="inline-block py-2 text-teal underline-offset-2 hover:underline">
                      Practice<span className="sr-only">: {l.title}</span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section aria-labelledby="print-h">
          <h2 id="print-h" className="text-3xl font-black tracking-tight">Print it</h2>
          <p className="mt-2 max-w-3xl text-muted">Student coursebook and workbook for the whole unit, on A4. Labelled pilot drafts.</p>
          <div className="mt-5">
            <PrintLinks />
          </div>
        </section>

        <section aria-labelledby="later-h" className="rounded-3xl bg-paper p-6 sm:p-8">
          <h2 id="later-h" className="text-2xl font-black tracking-tight">Units 2 to 4</h2>
          <p className="mt-2 max-w-3xl text-muted">Outlined in the programme, but the lessons are not written yet.</p>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {OUTLINED_UNITS.map((u) => (
              <li key={u.id} className="rounded-2xl border border-line bg-white p-5">
                <p className="font-black">Unit {u.id.slice(-1)}: {u.title}</p>
                <p className="mt-1 text-sm text-muted">Weeks {u.weeks[0]}–{u.weeks[u.weeks.length - 1]}</p>
                <p className="mt-3"><span className="inline-flex rounded-full bg-cream px-3 py-1.5 text-xs font-extrabold tracking-wide uppercase">{STATUS_LABEL[u.status]}</span></p>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
