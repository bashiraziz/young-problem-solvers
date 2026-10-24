import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { REFRESHMENTS_STALL as S } from "@/content/challenges/refreshments-stall";

export function ChallengeCta() {
  return (
    <section aria-labelledby="challenge-cta-h" className="bg-deep py-16 text-white">
      <Container className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-xs font-extrabold tracking-[0.14em] text-sun uppercase">Experience the idea</p>
          <h2 id="challenge-cta-h" className="mt-3 text-3xl leading-tight font-black tracking-tight sm:text-4xl">
            A small challenge. A lot of thinking.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90">
            Plan a school-fair refreshments stall. Children estimate, calculate, choose, justify and reflect, with hints
            that explain <em>why</em> a strategy works. It takes {S.duration} and works with a child or a parent.
          </p>
          <p className="mt-3 text-sm text-white/80">Nothing is recorded, sent or saved. No account is needed.</p>
        </div>
        <div className="lg:justify-self-end">
          <Button href="/challenge" variant="sun">Try the challenge →</Button>
        </div>
      </Container>
    </section>
  );
}
