import type { Metadata } from "next";
import { StallChallenge } from "@/components/interactive/stall/stall-challenge";
import { Container } from "@/components/ui/section";
import { PageIntro } from "@/components/ui/page-intro";
import {
  ADULT_DOES_NOT_MEASURE,
  ADULT_MEASURES,
  REFRESHMENTS_STALL as S,
  STALL_ASSUMPTIONS,
  STALL_OBJECTIVES,
} from "@/content/challenges/refreshments-stall";
import { formatUgx } from "@/lib/formatters";

export const metadata: Metadata = {
  title: "Try a Challenge",
  description: "An estimated 15-minute budgeting challenge for ages 9–12: estimate, calculate, choose, justify and reflect. Nothing is recorded or sent.",
};

export default function ChallengePage() {
  return (
    <>
      <PageIntro eyebrow={`Try a challenge · ages ${S.ageRange} · ${S.duration}`} title={S.title}>
        <p>
          You have {formatUgx(S.budget)} to stock a refreshments stall at a school fair. Estimate first, then calculate, choose
          your plan, explain why it is a good one, and reflect. A child can work on their own; a grown-up can sit alongside.
        </p>
      </PageIntro>

      <Container className="space-y-6 pb-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <section aria-labelledby="learn-h" className="rounded-3xl border border-line bg-white p-6">
            <h2 id="learn-h" className="text-xl font-black">What you will practise</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
              {STALL_OBJECTIVES.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
            <h3 className="mt-5 font-black">Ground rules</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
              {STALL_ASSUMPTIONS.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="prices-h" className="rounded-3xl border border-line bg-white p-6">
            <h2 id="prices-h" className="text-xl font-black">Price list</h2>
            <ul className="mt-3 divide-y divide-line">
              {S.products.map((p) => (
                <li key={p.id} className="py-3">
                  <p className="font-bold">{p.name}</p>
                  <p className="text-sm text-muted">
                    You buy at {formatUgx(p.buy)} per {p.unit}. You sell at {formatUgx(p.sell)} per {p.unit}.
                  </p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl bg-cream px-4 py-3"><dt className="text-muted">Your budget</dt><dd className="font-extrabold">{formatUgx(S.budget)}</dd></div>
              <div className="rounded-xl bg-cream px-4 py-3"><dt className="text-muted">Stall fee (must pay)</dt><dd className="font-extrabold">{formatUgx(S.stallFee)}</dd></div>
            </dl>
          </section>
        </div>

        <section aria-label="The challenge">
          <StallChallenge />
        </section>

        <section aria-labelledby="adult-h" className="rounded-3xl border border-line bg-mint p-6 sm:p-8">
          <h2 id="adult-h" className="text-xl font-black">For the adult: what this activity does and does not show</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-extrabold">It gives a glimpse of</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
                {ADULT_MEASURES.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-extrabold">It does not measure</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
                {ADULT_DOES_NOT_MEASURE.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-sm font-semibold">
            Privacy: no account, cookies, storage or network requests are used for this activity. Everything typed stays in this
            browser tab, and leaves when the page closes or Start again is pressed.
          </p>
          <p className="mt-2 text-xs text-ink/70">
            Activity {S.id} v{S.version}. It is a demonstration, not a formal assessment.
          </p>
        </section>
      </Container>
    </>
  );
}
