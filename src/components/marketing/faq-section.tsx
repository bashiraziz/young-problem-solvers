import { Container, SectionHead } from "@/components/ui/section";
import { FAQ } from "@/content/faq";

export function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-h" className="py-20">
      <Container>
        <SectionHead center id="faq-h" eyebrow="Good questions" title="Frequently asked.">
          The programme is currently in development. Here is what is proposed for the pilot.
        </SectionHead>
        <div className="mx-auto max-w-3xl space-y-3">
          {FAQ.map((item) => (
            <details key={item.question} className="group rounded-2xl border border-line bg-white px-5 py-4">
              <summary className="cursor-pointer list-none font-extrabold marker:hidden [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.question}
                  <span aria-hidden="true" className="text-teal transition group-open:rotate-45 motion-reduce:transition-none">+</span>
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
