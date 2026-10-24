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
        <aside aria-label="Illustrative sample progress report" className="rounded-3xl border-2 border-dashed border-sun bg-white p-7 shadow-card">
          <p className="inline-block rounded-full bg-sun px-3 py-1 text-xs font-extrabold tracking-widest uppercase">
            Illustrative example only
          </p>
          <h3 className="mt-3 text-xl font-black">Learning progress snapshot</h3>
          <div className="mt-5 space-y-4">
            {SAMPLE_REPORT.rows.map((r) => (
              <div key={r.skill}>
                <div className="flex justify-between text-sm">
                  <strong>{r.skill}</strong>
                  <span className="text-muted">{r.level}</span>
                </div>
                <div
                  role="img"
                  aria-label={`${r.skill}: ${r.level} (illustrative)`}
                  className="mt-1.5 h-2.5 rounded-full bg-line"
                >
                  <div className="h-full rounded-full bg-teal" style={{ width: `${r.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-xl bg-cream p-4 text-sm">
            <strong>Illustrative teacher note:</strong> {SAMPLE_REPORT.note}
          </p>
          <p className="mt-3 text-xs text-muted">
            Visual example only. Not based on an actual student or measured pilot results; final reporting rubrics will
            be calibrated.
          </p>
        </aside>
      </Container>
    </section>
  );
}
