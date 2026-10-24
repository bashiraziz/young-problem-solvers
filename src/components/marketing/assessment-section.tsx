import { Container, SectionHead } from "@/components/ui/section";
import { ASSESSMENT_STEPS, SAMPLE_REPORT } from "@/content/programme";

export function AssessmentSection() {
  return (
    <section id="parents" aria-labelledby="parents-h" className="bg-paper py-20">
      <Container className="grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHead id="parents-h" eyebrow="For parents" title="Progress you can actually see.">
            We want families to see more than finished worksheets. Our proposed assessments focus on what each child can
            do independently.
          </SectionHead>
          <ol className="space-y-5">
            {ASSESSMENT_STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-mint font-black text-teal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-black">{s.title}</h3>
                  <p className="text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
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
  );
}
