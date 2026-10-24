import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { PageIntro } from "@/components/ui/page-intro";
import { ASSESSMENT_EVENTS, PROGRAMME, SAMPLE_REPORT } from "@/content/programme";

export const metadata: Metadata = {
  title: "For Parents",
  description: "How assessment and progress reporting are designed to work: a baseline, weekly feedback, a midpoint check, a final assessment and an illustrative parent report.",
};

export default function ParentsPage() {
  return (
    <>
      <PageIntro eyebrow="For parents" title="Progress you can actually see.">
        <p>
          The pilot is designed to give families evidence of what a child can do independently, not just completed
          worksheets. Here is how that is planned to work across the {PROGRAMME.weeks} weeks.
        </p>
      </PageIntro>

      <section aria-labelledby="timeline-h" className="py-10">
        <Container>
          <h2 id="timeline-h" className="text-3xl font-black tracking-tight">Four kinds of evidence</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {ASSESSMENT_EVENTS.map((a, i) => (
              <li key={a.id} className="flex gap-4 rounded-2xl border border-line bg-white p-6">
                <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-mint font-black text-teal">
                  {i + 1}
                </span>
                <div>
                  <p className="text-xs font-extrabold tracking-widest text-teal uppercase">{a.when}</p>
                  <h3 className="mt-1 text-lg font-black">{a.title}</h3>
                  <p className="mt-2 text-muted">{a.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="report-h" className="bg-paper py-16">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 id="report-h" className="text-3xl font-black tracking-tight">What a parent report looks like</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Each learner gets a short report with a 1–4 rating on four competencies, the independent evidence behind each
              rating, a next learning goal, and a 10–15 minute activity for home.
            </p>
            <h3 className="mt-6 font-black">How to read it</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 leading-relaxed text-muted">
              <li>Ratings describe work the child completed, not a rank against other children.</li>
              <li>Baseline and final assessments are comparable but not formally equated, so changes are described, not proven.</li>
              <li>Reports never promise an IQ increase, a guaranteed school-grade improvement or an externally certified level.</li>
            </ul>
          </div>

          <aside aria-label="Illustrative sample parent report" className="rounded-3xl border-2 border-dashed border-sun bg-white p-7 shadow-card">
            <p className="inline-block rounded-full bg-sun px-3 py-1 text-xs font-extrabold tracking-widest uppercase">
              Illustrative example only · fictional learner
            </p>
            <h3 className="mt-3 text-xl font-black">Parent progress report</h3>
            <p className="mt-1 text-sm text-muted">
              {SAMPLE_REPORT.learner} · {SAMPLE_REPORT.summary}
            </p>
            <ul className="mt-5 space-y-3">
              {SAMPLE_REPORT.rows.map((r) => (
                <li key={r.competency} className="rounded-xl bg-cream p-4">
                  <div className="flex items-center justify-between gap-3">
                    <strong>{r.competency}</strong>
                    <span className="text-sm font-extrabold text-teal">Rating {r.rating} of 4</span>
                  </div>
                  <div aria-hidden="true" className="mt-2 flex gap-1">
                    {[1, 2, 3, 4].map((n) => (
                      <span key={n} className={`h-2 flex-1 rounded-full ${n <= r.rating ? "bg-teal" : "bg-line"}`} />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-muted">{r.evidence}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-cream p-4 text-sm">
              <strong>Next step:</strong> {SAMPLE_REPORT.nextStep}
            </p>
            <p className="mt-3 text-xs text-muted">
              Visual example only; not a real learner or measured pilot result. {SAMPLE_REPORT.caveat}
            </p>
          </aside>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="rounded-3xl border border-line bg-mint p-7 sm:p-9">
            <h2 className="text-2xl font-black">Try it with your child</h2>
            <p className="mt-2 max-w-2xl leading-relaxed">
              The challenge takes 10–15 minutes and shows the Think. Build. Explain. approach in action. Nothing is saved or sent.
            </p>
            <div className="mt-5">
              <Button href="/challenge">Try the challenge →</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
