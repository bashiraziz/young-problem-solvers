import { Button } from "@/components/ui/button";
import { Container, SectionHead } from "@/components/ui/section";
import { PROGRAMME, UNITS } from "@/content/programme";

export function UnitTeasers() {
  return (
    <section aria-labelledby="units-h" className="py-20">
      <Container>
        <SectionHead id="units-h" eyebrow="The Foundation Programme" title={<>Twelve weeks. <br className="hidden sm:block" />Four connected units.</>}>
          {PROGRAMME.sessions} sessions of {PROGRAMME.sessionMinutes} minutes ({PROGRAMME.learningHours} learning hours),
          for children aged {PROGRAMME.ages}.
        </SectionHead>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {UNITS.map((u) => (
            <li key={u.id} className="rounded-2xl border border-line bg-white p-5">
              <p aria-hidden="true" className="text-3xl font-black text-teal">{String(u.number).padStart(2, "0")}</p>
              <h3 className="mt-1 text-lg font-black">
                <span className="sr-only">Unit {u.number}: </span>{u.title}
              </h3>
              <p className="text-sm font-semibold text-muted">Weeks {u.weeks[0].number}–{u.weeks[u.weeks.length - 1].number}</p>
              <p className="mt-2 text-sm text-muted">{u.focus}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Button href="/programme" variant="outline">See every week and what children can do →</Button>
        </div>
      </Container>
    </section>
  );
}
