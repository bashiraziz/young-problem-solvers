import { BudgetChallenge } from "@/components/interactive/budget-challenge";
import { Container } from "@/components/ui/section";

export function ChallengeSection() {
  return (
    <section id="challenge" aria-labelledby="challenge-h" className="bg-deep py-20 text-white">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-extrabold tracking-[0.14em] text-sun uppercase">Experience the idea</p>
          <h2 id="challenge-h" className="mt-3 text-3xl leading-tight font-black tracking-tight sm:text-5xl">
            A small challenge. A lot of thinking.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/85">
            An example from the Week 2 budgeting unit. Children learn the arithmetic first, then make and explain
            decisions.
          </p>
          <h3 className="mt-8 text-xl font-black">Can you plan a learning event without going over budget?</h3>
          <p className="mt-2 leading-relaxed text-white/85">
            You have UGX 25,000. Transport costs UGX 3,000 and essential supplies cost UGX 14,000. What extras can you
            choose while keeping your plan affordable?
          </p>
          <ul className="mt-5 space-y-2 text-white/90">
            <li>✓ Identify what is required</li>
            <li>✓ Compare different combinations</li>
            <li>✓ Check the total and explain your choice</li>
          </ul>
          <p className="mt-6 text-xs text-white/75">Demo only: an interactive illustration, not a formal assessment.</p>
        </div>
        <BudgetChallenge />
      </Container>
    </section>
  );
}

