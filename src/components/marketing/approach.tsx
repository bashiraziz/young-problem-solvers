import { Container, SectionHead } from "@/components/ui/section";
import { DIFFERENCES, PILLARS } from "@/content/programme";

export function Approach() {
  return (
    <section aria-labelledby="approach-h" className="bg-paper py-20">
      <Container>
        <SectionHead
          center
          id="approach-h"
          eyebrow="Think. Build. Explain."
          title={<>Less memorising. <br className="hidden sm:block" />More meaningful learning.</>}
        >
          We teach essential mathematics carefully, then ask children to use it in the world around them.
        </SectionHead>
        <div className="grid gap-5 md:grid-cols-3">
          {PILLARS.map((p) => (
            <article key={p.id} className="rounded-3xl border border-line bg-cream p-7">
              <h3 className="text-2xl font-black">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{p.body}</p>
              <p className="mt-5 text-xs font-extrabold tracking-widest text-teal uppercase">{p.tag}</p>
            </article>
          ))}
        </div>

        <h3 className="mt-16 text-center text-2xl font-black">How YPS is different</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DIFFERENCES.map((d) => (
            <article key={d.id} className="rounded-2xl border border-line bg-white p-5">
              <h4 className="font-black">{d.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
