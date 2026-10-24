import { Container, SectionHead } from "@/components/ui/section";
import { PROGRAMME, UNITS } from "@/content/programme";

export function ProgrammeOverview() {
  return (
    <section id="curriculum" aria-labelledby="curriculum-h" className="py-20">
      <Container>
        <SectionHead
          id="curriculum-h"
          eyebrow="The pilot programme"
          title={<>Twelve weeks. <br className="hidden sm:block" />Four connected units.</>}
        >
          Each unit combines explicit teaching, guided practice, independent challenges and evidence of progress. Each
          week includes two {PROGRAMME.sessionMinutes}-minute sessions: {PROGRAMME.sessions} sessions and{" "}
          {PROGRAMME.learningHours} learning hours in total.
        </SectionHead>
        <div className="grid gap-5 md:grid-cols-2">
          {UNITS.map((u) => (
            <article key={u.number} className="flex flex-col rounded-3xl border border-line bg-white p-7">
              <div className="flex items-center gap-4">
                <span aria-hidden="true" className="text-4xl font-black text-teal">{String(u.number).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-xl font-black">
                    <span className="sr-only">Unit {u.number}: </span>{u.title}
                  </h3>
                  <p className="text-sm text-muted">
                    Weeks {u.weeks[0].number}–{u.weeks[u.weeks.length - 1].number} · {u.focus}
                  </p>
                </div>
              </div>
              <ul className="mt-5 space-y-2">
                {u.weeks.map((w) => (
                  <li key={w.number} className="flex gap-3 rounded-xl bg-cream px-4 py-3 text-sm">
                    <span className="w-16 shrink-0 font-extrabold text-teal">Week {String(w.number).padStart(2, "0")}</span>
                    <span>{w.title}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-muted">{u.summary}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
