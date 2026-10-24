import { Button } from "@/components/ui/button";
import { Container, SectionHead } from "@/components/ui/section";
import { ASSESSMENT_EVENTS } from "@/content/programme";

export function ParentsTeaser() {
  return (
    <section aria-labelledby="parents-teaser-h" className="bg-paper py-20">
      <Container>
        <SectionHead id="parents-teaser-h" eyebrow="For parents" title="Progress you can actually see.">
          We want families to see more than finished worksheets. The proposed assessments focus on what each child can do
          independently.
        </SectionHead>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ASSESSMENT_EVENTS.map((a) => (
            <li key={a.id} className="rounded-2xl border border-line bg-cream p-5">
              <p className="text-xs font-extrabold tracking-widest text-teal uppercase">{a.when}</p>
              <h3 className="mt-1 font-black">{a.title}</h3>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Button href="/parents" variant="outline">How assessment and reporting work →</Button>
        </div>
      </Container>
    </section>
  );
}
