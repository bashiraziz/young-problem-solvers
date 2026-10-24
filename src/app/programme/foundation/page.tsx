import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { PageIntro } from "@/components/ui/page-intro";
import { StatusBadge } from "@/components/learning/lesson-parts";
import { manifest } from "@/content/foundation";
import { CURRICULUM, LEARNING_CYCLE, PROGRAMME, UNITS } from "@/content/programme";

export const metadata: Metadata = {
  title: "Foundation Programme",
  description: "The 12-week Foundation Programme for ages 9–12: four units, 24 sessions and the specific things children can do by the end of each week.",
};

export default function ProgrammePage() {
  return (
    <>
      <PageIntro eyebrow="Foundation Programme" title="Twelve weeks. Four units. Clear outcomes.">
        <p>
          A pilot programme for children aged {PROGRAMME.ages}: {PROGRAMME.weeks} weeks, two {PROGRAMME.sessionMinutes}-minute
          sessions a week ({PROGRAMME.sessions} sessions, {PROGRAMME.learningHours} learning hours). Every outcome below is something
          an instructor can observe a child doing on their own.
        </p>
      </PageIntro>

      <Container className="pb-4">
        <nav aria-label="Jump to a unit" className="flex flex-wrap gap-2">
          {UNITS.map((u) => (
            <a key={u.id} href={`#${u.id}`} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-bold hover:bg-mint">
              Unit {u.number}: {u.title}
            </a>
          ))}
        </nav>
      </Container>

      {UNITS.map((u) => (
        <section key={u.id} id={u.id} aria-labelledby={`${u.id}-h`} className="py-12">
          <Container>
            <p className="text-xs font-extrabold tracking-[0.14em] text-teal uppercase">
              Unit {u.number} · Weeks {u.weeks[0].number}–{u.weeks[u.weeks.length - 1].number}
            </p>
            <h2 id={`${u.id}-h`} className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{u.title}</h2>
            <p className="mt-2 font-semibold text-muted">{u.focus}</p>
            <p className="mt-3 max-w-3xl text-lg leading-relaxed">{u.summary}</p>
            <UnitStatus number={u.number} />

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {u.weeks.map((w) => (
                <article key={w.id} className="rounded-3xl border border-line bg-white p-6">
                  <p className="text-xs font-extrabold tracking-widest text-teal uppercase">Week {w.number}</p>
                  <h3 className="mt-1 text-xl font-black">{w.title}</h3>
                  <p className="mt-2 text-sm font-semibold italic text-muted">{w.drivingQuestion}</p>
                  <p className="mt-4 text-sm font-extrabold">By the end of the week, each child can:</p>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
                    {w.outcomes.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </Container>
        </section>
      ))}

      <section aria-labelledby="cycle-h" className="bg-paper py-16">
        <Container>
          <h2 id="cycle-h" className="text-3xl font-black tracking-tight">Every session follows the same five stages</h2>
          <p className="mt-3 max-w-3xl text-lg text-muted">
            Discover → Learn → Solve → Explain → Reflect, across {PROGRAMME.sessionMinutes} minutes. A protected part of every
            lesson is independent work.
          </p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {LEARNING_CYCLE.map((c, i) => (
              <li key={c.id} className="rounded-2xl border border-line bg-cream p-5">
                <p className="text-xs font-extrabold tracking-widest text-teal uppercase">
                  {i + 1} · {c.minutes} min
                </p>
                <h3 className="mt-1 font-black">{c.stage}</h3>
                <p className="mt-2 text-sm text-muted">{c.summary}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="limits-h" className="py-16">
        <Container>
          <div className="rounded-3xl border border-line bg-mint p-7 sm:p-9">
            <h2 id="limits-h" className="text-2xl font-black">What we do not promise</h2>
            <ul className="mt-3 max-w-3xl list-disc space-y-2 pl-5 leading-relaxed">
              <li>No guaranteed exam or school-grade improvement, and no IQ claims.</li>
              <li>This is a pilot design, not an approved national syllabus. Its learning effects have not been validated.</li>
              <li>Topics fit broadly with primary mathematics emphases; no approval or certification by any authority is implied.</li>
            </ul>
            <p className="mt-4 text-xs text-ink/70">
              Content version {CURRICULUM.version}. Source: {CURRICULUM.source}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/challenge">Try a challenge →</Button>
              <Button href="/parents" variant="outline">How progress is reported</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/** Where each unit stands in the Learning Library. Unit 1 is drafted; Units 2 to 4 are outlined only. */
function UnitStatus({ number }: { number: number }) {
  const status = manifest.units[number - 1].status;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
      {status === "outline-only" ? (
        <span className="inline-flex rounded-full bg-cream px-3 py-1.5 text-xs font-extrabold tracking-wide uppercase">Outline only: lessons not yet written</span>
      ) : (
        <>
          <StatusBadge status="pilot-draft-not-validated" />
          <Link href="/learn/foundation/unit-1" className="inline-block py-2 text-sm font-extrabold text-teal underline-offset-2 hover:underline">
            Explore the six Unit 1 lessons →
          </Link>
        </>
      )}
    </div>
  );
}
