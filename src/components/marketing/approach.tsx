import { Container, SectionHead } from "@/components/ui/section";
import { LEARNING_CYCLE, PILLARS } from "@/content/programme";

export function Approach() {
  return (
    <section id="approach" aria-labelledby="approach-h" className="bg-paper py-20">
      <Container>
        <SectionHead
          center
          id="approach-h"
          eyebrow="Our difference"
          title={<>Less memorising. <br className="hidden sm:block" />More meaningful learning.</>}
        >
          Not an abacus course, another homework class or a gadget-first coding club. We teach essential mathematics
          carefully, then ask children to use it in the world around them.
        </SectionHead>
        <div className="grid gap-5 md:grid-cols-3">
          {PILLARS.map((p) => (
            <article key={p.title} className="rounded-3xl border border-line bg-cream p-7">
              <h3 className="text-2xl font-black">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{p.body}</p>
              <p className="mt-5 text-xs font-extrabold tracking-widest text-teal uppercase">{p.tag}</p>
            </article>
          ))}
        </div>
        <ol aria-label="Five-stage learning cycle" className="mt-10 flex flex-wrap justify-center gap-3">
          {LEARNING_CYCLE.map((step, i) => (
            <li key={step} className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-bold">
              <span aria-hidden="true" className="flex size-6 items-center justify-center rounded-full bg-teal text-xs text-white">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
