import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { PROGRAMME } from "@/content/programme";

export function Hero() {
  return (
    <section id="top" className="bg-[radial-gradient(ellipse_at_83%_34%,#e2f3e6_0,transparent_50%)] py-16 sm:py-20">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="inline-flex rounded-full border border-[#cce5d8] bg-[#e9f7eb] px-3.5 py-2 text-xs font-extrabold tracking-wider text-[#24645a] uppercase">
            Pilot programme in development
          </p>
          <h1 className="mt-6 text-4xl leading-[1.05] font-black tracking-tight text-balance sm:text-6xl">
            Great minds don&apos;t just find answers. <em className="text-teal not-italic">They learn to think.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            A fresh learning experience where children make sense of numbers, tackle real-world challenges and learn to
            explain their ideas with confidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#curriculum">Explore the 12-week programme →</Button>
            <Button href="#challenge" variant="outline">Try a mini challenge ↗</Button>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm font-semibold text-ink/80">
            <li>Two {PROGRAMME.sessionMinutes}-minute lessons weekly</li>
            <li>Designed for ages {PROGRAMME.ages}</li>
          </ul>
        </div>
        <div
          role="img"
          aria-label="Illustration of a challenge card: how would you spend UGX 25,000? Budget 25,000, minus transport 3,000, minus essential supplies 14,000, leaves 8,000."
          className="rounded-3xl border border-line bg-white p-6 shadow-card"
        >
          <p className="text-xs font-extrabold tracking-wider text-teal uppercase">YPS challenge card · 02 / 12</p>
          <p className="mt-3 text-2xl font-black">How would you spend UGX 25,000?</p>
          <div className="mt-5 space-y-2 text-sm" aria-hidden="true">
            <div className="flex justify-between rounded-xl bg-cream px-4 py-3"><span>Budget available</span><strong>25,000</strong></div>
            <div className="flex justify-between rounded-xl bg-cream px-4 py-3"><span>Keep for transport</span><strong>− 3,000</strong></div>
            <div className="flex justify-between rounded-xl bg-cream px-4 py-3"><span>Essential supplies</span><strong>− 14,000</strong></div>
            <div className="flex justify-between rounded-xl bg-deep px-4 py-3 text-white"><span>What is left for extras?</span><strong>8,000 ✓</strong></div>
          </div>
          <p className="mt-4 text-sm font-bold">Show your thinking! <span className="font-normal text-muted">There is more than one way.</span></p>
        </div>
      </Container>
    </section>
  );
}
