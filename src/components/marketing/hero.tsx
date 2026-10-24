import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { REFRESHMENTS_STALL as S } from "@/content/challenges/refreshments-stall";
import { PROGRAMME } from "@/content/programme";
import { formatUgx } from "@/lib/formatters";

export function Hero() {
  return (
    <section className="bg-[radial-gradient(ellipse_at_83%_34%,#e2f3e6_0,transparent_50%)] py-16 sm:py-20">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="inline-flex rounded-full border border-[#cce5d8] bg-[#e9f7eb] px-3.5 py-2 text-xs font-extrabold tracking-wider text-[#24645a] uppercase">
            Pilot programme in development
          </p>
          <h1 className="mt-6 text-4xl leading-[1.05] font-black tracking-tight text-balance sm:text-6xl">
            Great minds don&apos;t just find answers. <em className="text-teal not-italic">They learn to think.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            A mathematics-led programme for children aged {PROGRAMME.ages} where they make sense of numbers, tackle
            real-world problems and learn to explain their ideas with confidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/challenge">Try the challenge →</Button>
            <Button href="/programme" variant="outline">See the 12-week programme</Button>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm font-semibold text-ink/80">
            <li>Ages {PROGRAMME.ages}</li>
            <li>{PROGRAMME.weeks} weeks · {PROGRAMME.sessions} sessions</li>
            <li>{PROGRAMME.sessionMinutes} minutes each</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <p className="text-xs font-extrabold tracking-wider text-teal uppercase">Example challenge · ages {S.ageRange}</p>
          <p className="mt-3 text-2xl font-black">{S.title}</p>
          <p className="mt-3 leading-relaxed text-muted">
            You have <strong className="text-ink">{formatUgx(S.budget)}</strong> to stock a stall at the school fair. What will
            you buy? What could go wrong? Will you make a surplus?
          </p>
          <ol className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
            {["Estimate", "Calculate", "Choose", "Justify", "Reflect"].map((s, i) => (
              <li key={s} className="rounded-full bg-cream px-3 py-1.5">
                {i + 1}. {s}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm font-bold">Show your thinking! <span className="font-normal text-muted">There is more than one good plan.</span></p>
        </div>
      </Container>
    </section>
  );
}
