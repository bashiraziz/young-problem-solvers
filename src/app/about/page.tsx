import type { Metadata } from "next";
import { FaqSection } from "@/components/marketing/faq-section";
import { Container } from "@/components/ui/section";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata: Metadata = {
  title: "About and Pilot Status",
  description: "YPS is a developing educational pilot. What is decided, what is not, and why registration is not open.",
};

const SETTLED = [
  "The programme design: mathematics-led, ages 9–12, 12 weeks, 24 sessions of 90 minutes, four units.",
  "The teaching approach: Think. Build. Explain. with a five-stage session cycle and individual evidence of learning.",
  "A plan to assess with a baseline, weekly feedback, a midpoint check and a final assessment.",
];

const OPEN = [
  "Venue and location",
  "Fees and any financial support",
  "Timetable and start dates",
  "How families will register",
  "Instructor recruitment, training and safeguarding arrangements",
  "Any approvals required from education or licensing authorities",
  "Whether the pilot's learning outcomes are supported by evidence",
];

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="About · pilot status" title="A programme in development, built carefully.">
        <p>
          Young Problem Solvers is an educational pilot for children in Uganda. We are building the curriculum, training
          approach and assessments before opening enrollment, and we would rather say what is undecided than guess.
        </p>
      </PageIntro>

      <section aria-labelledby="status-h" className="py-10">
        <Container className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-line bg-white p-7">
            <h2 id="status-h" className="text-xl font-black">Designed so far</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
              {SETTLED.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-mint p-7">
            <h2 className="text-xl font-black">Not decided yet</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
              {OPEN.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
            <p className="mt-4 font-bold">Registration is not open and no places are being offered.</p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="safeguard-h" className="py-8">
        <Container>
          <div className="rounded-3xl border border-line bg-white p-7">
            <h2 id="safeguard-h" className="text-xl font-black">Principles we are building in</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-muted">
              These are design requirements for the pilot, not claims that they are already in place:
            </p>
            <ul className="mt-3 max-w-3xl list-disc space-y-2 pl-5 leading-relaxed">
              <li>Instructor checks, supervised sessions and safe-pickup procedures before any child attends.</li>
              <li>Children&apos;s information kept restricted, and no children&apos;s details or photographs published without separate, explicit permission.</li>
              <li>No public rankings of children, and no promises of exam-score gains.</li>
            </ul>
          </div>
        </Container>
      </section>

      <FaqSection />
    </>
  );
}
